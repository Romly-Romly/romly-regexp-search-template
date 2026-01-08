// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import * as ryutils from './ryutils';

// ディフォルトテンプレート
import default_templates from "./default_templates";










const CONFIG_SECTION = 'Romly-RegexpSearchTemplate';
const CONFIG_KEY_DESCRIPTION_LABEL = 'descriptionLabel2';
const CONFIG_KEY_SHOW_LINENUMBER = 'showLineNumber';










/**
 * 検索結果を保持するクラス
 */
class MyMatchRecord
{
	index: number;
	label: string;
	lineNumber: number;

	// 正規表現
	pattern: string;

	matchedTexts: Array<string> = [];

	// 名前付きキャプチャのコピー
	namedCaptures: Map<string, string> = new Map();

	// QuickPickItem の description の上書き。
	description: string | undefined = undefined;

	private _searchText: string;

	/**
	 * コンストラクタ。
	 * @param m マッチした正規表現の結果
	 * @param aLabel ラベル
	 * @param aLineNumber 行番号
	 */
	constructor(aPattern: string, m: RegExpExecArray, aLabel: string, aLineNumber: number, aSearchText: string)
	{
		this.pattern = aPattern;
		this.index = m.index;
		m.forEach(element => {
			this.matchedTexts.push(element);
		});
		this.label = aLabel;
		this.lineNumber = aLineNumber;

		// 名前付きキャプチャのコピー
		if (m.groups)
		{
			for (const [name, value] of Object.entries(m.groups))
			{
				this.namedCaptures.set(name, value);
			}
		}

		// 検索ボタンをクリックした時に検索する文字列
		this._searchText = aSearchText !== '' ? this.replaceVariables(aSearchText) : m[0];
	}

	/**
	 * マッチしたテキスト全体を返す。
	 * @returns
	 */
	matchText(): string
	{
		return this.matchedTexts[0];
	}

	/**
	 * 検索結果を行番号順に並び替える
	 * @param records
	 */
	static sort(records: Array<MyMatchRecord>)
	{
		records.sort((a, b) => a.index - b.index);
	}

	replaceVariables(s: string): string
	{
		// 数字（${0}～${9}）を置き換える
		for (let i = 0; i <= 9; i++)
		{
			if (this.matchedTexts[i] !== undefined)
			{
				s = s.replaceAll('${' + i.toString() + '}', flattenTabs(this.matchedTexts[i]));
			}
		}

		// 行番号
		s = s.replaceAll('${lineNumber}', this.lineNumber.toString());

		// 名前付きキャプチャの置き換え
		for (const [name, value] of this.namedCaptures)
		{
			if (value !== undefined)
			{
				s = s.replaceAll('${' + name + '}', flattenTabs(value));
			}
		}

		return s;
	}

	get searchText(): string
	{
		return this._searchText;
	}
}










/**
 * マッチした項目を表す QuickPickItem
 */
class MyMatchResultQuickPickItem implements vscode.QuickPickItem
{
	private readonly BUTTON_ID_SEARCH = 'search';

	readonly label: string;
	readonly description: string;
	buttons: ryutils.RyQuickPickButton[];

	matchResult: MyMatchRecord;

	constructor(matchResult: MyMatchRecord)
	{
		this.matchResult = matchResult;
		this.label = matchResult.label;

		// matchResult.description があればそちらを優先
		if (matchResult.description)
		{
			this.description = matchResult.description;
		}
		else
		{
			// descriptionLabel2 の設定に従って description 用の文字列を作る。
			const descriptionLabel = vscode.workspace.getConfiguration(CONFIG_SECTION).get(CONFIG_KEY_DESCRIPTION_LABEL) as string;
			this.description = matchResult.replaceVariables(descriptionLabel);
		}

		this.buttons = [{ iconPath: new vscode.ThemeIcon('search'), tooltip: vscode.l10n.t("search"), id: this.BUTTON_ID_SEARCH }];
	}

	onSelect(): void
	{
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor)
		{
			const selectedResult = this.matchResult;

			// 設定を読み込む
			const selectMatch = vscode.workspace.getConfiguration(CONFIG_SECTION).get('selectMatch');

			// カーソルを移動
			const pos = activeEditor.document.positionAt(selectedResult.index);
			const posEnd = activeEditor.document.positionAt(selectedResult.index + selectedResult.matchText().length);
			//const pos = new vscode.Position(selectedResult.index, selectedResult.index);
			activeEditor.selection = selectMatch ? new vscode.Selection(pos, posEnd) : new vscode.Selection(pos, pos);

			// selectionだけ変えてもスクロールしないので、表示する必要がある。
			activeEditor.revealRange(new vscode.Range(activeEditor.selection.start, activeEditor.selection.end), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
		}
	}

	onButtonClick(button: ryutils.RyQuickPickButton): void
	{
		if (button.id === this.BUTTON_ID_SEARCH)
		{
			const findInFilesArgs =
			{
				query: this.matchResult.searchText,
				// replace?: string;
				// triggerSearch?: boolean;
				// filesToInclude?: string;
				// filesToExclude?: string;
				isRegex: false,
				// isCaseSensitive?: boolean;
				// matchWholeWord?: boolean;
			};
			// 検索ビューを開く
			vscode.commands.executeCommand('workbench.action.findInFiles', findInFilesArgs).then(() =>
			{
				// 検索結果をエディターで開く
				// vscode.commands.executeCommand('search.action.openInEditor');
			});
		}
	}
}










// ディフォルトテンプレートの配列を返す
function defaultTemplateList(): Array<Object>
{
	// 配列のコピーを作成する
	return [...default_templates];
}










/**
 * 文字列中のタブ文字をスペース4個に変換する。UI上でちゃんと幅が取られるようにするための処理。
 * @param text
 * @returns
 */
function flattenTabs(text: string): string
{
	return text.replaceAll(/\t/g, '        ');
}










/**
 * マッチ結果を利用する書式指定の文字列をマッチ結果を使って置き換える。
 * @param text 書式指定を含む文字列。$0～$9 や、 ${name} で名前付きキャプチャグループが使える。
 * @param m マッチ結果
 * @returns 書式指定をマッチ結果で置き換えた文字列
 */
function replaceWithMatchedTexts(text: string, m: RegExpExecArray): string
{
	let s = text;
	for (let i = 0; i < m.length; i++)
	{
		// タブ文字をスペース4個に変換することでUI上でちゃんと幅が取られるようにする。
		if (m[i] !== undefined)
		{
			s = s.split("$" + i.toString()).join(flattenTabs(m[i]));
		}
	}

	if (m.groups)
	{
		for (const [name, value] of Object.entries(m.groups))
		{
			let captured = (value !== undefined) ? flattenTabs(value) : '';
			s = s.split('${' + name + '}').join(captured);
		}
	}

	return s;
}










/**
 * アクティブなテキストエディターに対して複数の正規表現での検索をまとめて実行し、結果をQuickPickで表示する。
 * @param activeEditor アクティブなテキストエディター
 * @param template 正規表現テンプレート
 */
function doRegExpAndShowResult(activeEditor: vscode.TextEditor, template: any)
{
	// アクティブなエディタの全テキストを取得
	let text = activeEditor.document.getText();

	// 設定を読み込む
	const showLineNumber = vscode.workspace.getConfiguration(CONFIG_SECTION).get(CONFIG_KEY_SHOW_LINENUMBER);

	// 正規表現でマッチング
	const matchResults: MyMatchRecord[] = [];
	template.templates.forEach((element: any) =>
	{
		// element に flag プロパティがある場合はそちらを優先
		const flag = element.flag || 'gm';

		let re = new RegExp(element.pattern, flag);
		let m: RegExpExecArray | null;
		while ((m = re.exec(text)) !== null)
		{
			const line = activeEditor.document.positionAt(m.index).line;
			let label = '';
			if (showLineNumber)
			{
				label += line.toString() + ':  ';
			}

			label += replaceWithMatchedTexts(element.label, m);
			const matchResult = new MyMatchRecord(re.source, m, label, line, element.searchText || '');

			if (element.hasOwnProperty('description'))
			{
				matchResult.description = replaceWithMatchedTexts(element.description, m);
			}

			matchResults.push(matchResult);
		}
	});

	// 検索結果を行番号順に並び替える
	MyMatchRecord.sort(matchResults);

	const quickPickItemsForMatchResults: MyMatchResultQuickPickItem[] = [];
	matchResults.forEach(matchResult =>
	{
		const item = new MyMatchResultQuickPickItem(matchResult);
		quickPickItemsForMatchResults.push(item);
	});

	if (quickPickItemsForMatchResults.length > 0)
	{
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = quickPickItemsForMatchResults;
		quickPick.placeholder = vscode.l10n.t("Select a result to jump.");
		quickPick.onDidAccept(() =>
		{
			const selection = quickPick.selectedItems[0];
			if (selection instanceof MyMatchResultQuickPickItem)
			{
				selection.onSelect();
				quickPick.dispose();
			}
		});
		quickPick.onDidTriggerItemButton((e) =>
		{
			if (e.item instanceof MyMatchResultQuickPickItem)
			{
				const button = e.button as ryutils.RyQuickPickButton;
				e.item.onButtonClick(button);
				quickPick.dispose();
			}
		});
		quickPick.show();
	}
	else
	{
		// マッチングしなかった場合はメッセージを表示
		const msg = vscode.l10n.t("No match for {label} in this file.", { label: template.label });
		vscode.window.showWarningMessage(msg);
	}
}









// 拡張子のリストを文字列に変換するだけ
function joinExtensionsArray(extensions: any)
{
	return Array.isArray(extensions) ? extensions.join(' ') : '';
}










// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('extension.regexp_search_template', () =>
	{
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor)
		{
			const msg = vscode.l10n.t("Please execute while a text editor is active.");
			vscode.window.showErrorMessage(msg);
			return;
		}


		const templates: any[] = [];

		// ユーザー定義のテンプレート設定を読み込む
		const templatesConfiguration = vscode.workspace.getConfiguration(CONFIG_SECTION).get('templates');
		if (templatesConfiguration instanceof Array)
		{
			templates.push(...templatesConfiguration);
		}

		// テンプレートが一つもなかった場合、ディフォルト設定を設定に書き込んで使うか尋ねる
		if (templates.length === 0)
		{
			const msg = vscode.l10n.t("No templates are found. Shall I put sample templates in the settings JSON?");
			vscode.window.showInformationMessage(msg, vscode.l10n.t("Yes")).then(value =>
			{
				if (value !== undefined)
				{
					// 設定にサンプルを書き込む
					vscode.workspace.getConfiguration(CONFIG_SECTION).update('templates', defaultTemplateList(), true);

					// 書き込んだ旨表示
					const msg = vscode.l10n.t("Default settings were written. Please execute the command again.");
					vscode.window.showInformationMessage(msg);
				}
			});
		}
		else
		{
			// アクティブなテキストエディターの拡張子から、対応するテンプレートを選択
			// extensions が Array で、ext を含むものを抽出
			const ext = path.extname(activeEditor.document.fileName);
			const theTemplates = templates.filter((element: any) => Array.isArray(element.extensions) && element.extensions.includes(ext));


			if (theTemplates.length === 1)
			{
				doRegExpAndShowResult(activeEditor, theTemplates[0]);
			}
			else
			{
				let placeHolderText: string;
				// 対応するテンプレートが見つからなかった場合、複数見つかった場合はQuickPickを表示して選んでもらう
				if (theTemplates.length > 0)
				{
					placeHolderText = vscode.l10n.t("{ext} matches {numMatches} templates. Select one to execute.", { ext: ext, numMatches: String(theTemplates.length) });
					templates.length = 0;
					theTemplates.forEach(element => {
						templates.push(element);
					});
				}
				else
				{
					placeHolderText = vscode.l10n.t("Template for {ext} is not found. Select one to execute.", { ext: ext });
				}

				const searchTemplates_quickPickItems: Array<vscode.QuickPickItem> = [];
				templates.forEach(element => {
					searchTemplates_quickPickItems.push({ label: element.label, description: joinExtensionsArray(element.extensions) });
				});
				vscode.window.showQuickPick(searchTemplates_quickPickItems, {
					placeHolder: placeHolderText
				}).then(selection => {
					if (selection !== undefined)
					{
						const index: number = searchTemplates_quickPickItems.indexOf(selection);
						doRegExpAndShowResult(activeEditor, templates[index]);
					}
				});
			}
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
