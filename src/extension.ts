// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// 自前の言語設定の読み込み
import i18n from "./i18n";
import i18nTexts from "./i18nTexts";

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
	matchedTexts: Array<string> = [];

	// 名前付きキャプチャのコピー
	namedCaptures: Map<string, string> = new Map();

	// QuickPickItem の description の上書き。
	description: string | undefined = undefined;

	/**
	 * コンストラクタ。
	 * @param m マッチした正規表現の結果
	 * @param aLabel ラベル
	 * @param aLineNumber 行番号
	 */
	constructor(m: RegExpExecArray, aLabel: string, aLineNumber: number)
	{
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
 * descriptionLabel2 の設定に従って description 用の文字列を作る。
 * @param matchedResult
 * @returns
 */
function makeDescription(matchedResult: MyMatchRecord): string
{
	const descriptionLabel = vscode.workspace.getConfiguration(CONFIG_SECTION).get(CONFIG_KEY_DESCRIPTION_LABEL) as string;

	let s = descriptionLabel;

	// 数字（${0}～${9}）を置き換える
	for (let i = 0; i <= 9; i++)
	{
		if (matchedResult.matchedTexts[i] !== undefined)
		{
			s = s.replaceAll('${' + i.toString() + '}', flattenTabs(matchedResult.matchedTexts[i]));
		}
	}

	// 行番号
	s = s.replaceAll('${lineNumber}', matchedResult.lineNumber.toString());

	// 名前付きキャプチャの置き換え
	for (const [name, value] of matchedResult.namedCaptures)
	{
		s = s.replaceAll('${' + name + '}', flattenTabs(value));
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
	const quickPickItemsForMatchResults: Array<vscode.QuickPickItem> = [];
	const matchResults: Array<MyMatchRecord> = [];
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
			const matchResult = new MyMatchRecord(m, label, line);

			if (element.hasOwnProperty('description'))
			{
				matchResult.description = replaceWithMatchedTexts(element.description, m);
			}

			matchResults.push(matchResult);
		}
	});

	// 検索結果を行番号順に並び替える
	MyMatchRecord.sort(matchResults);

	matchResults.forEach(matchResult =>
	{
		const item = {
			label: matchResult.label,
			// matchResult.description があればそちらを優先
			description: matchResult.description ?? makeDescription(matchResult)
		}
		quickPickItemsForMatchResults.push(item);
	});

	if (quickPickItemsForMatchResults.length > 0)
	{
		vscode.window.showQuickPick(quickPickItemsForMatchResults, {
			placeHolder: i18n(i18nTexts, 'select_result')
		}).then(selection => {
			if (selection !== undefined)
			{
				// 選択した項目を取得
				let index: number = quickPickItemsForMatchResults.indexOf(selection);
				const selectedResult = matchResults[index];

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
		});
	}
	else
	{
		// マッチングしなかった場合はメッセージを表示
		vscode.window.showWarningMessage(i18n(i18nTexts, 'no_match', { label: template.label }));
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
			vscode.window.showErrorMessage(i18n(i18nTexts, 'no_active_editor'));
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
			vscode.window.showInformationMessage(i18n(i18nTexts, 'templatesNotFound'), i18n(i18nTexts, 'yes')).then(value =>
			{
				if (value !== undefined)
				{
					// 設定にサンプルを書き込む
					vscode.workspace.getConfiguration(CONFIG_SECTION).update('templates', defaultTemplateList(), true);

					// 書き込んだ旨表示
					vscode.window.showInformationMessage(i18n(i18nTexts, 'defaultSettingsWritten'));
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
				var placeHolderText: string;
				// 対応するテンプレートが見つからなかった場合、複数見つかった場合はQuickPickを表示して選んでもらう
				if (theTemplates.length > 0)
				{
					placeHolderText = i18n(i18nTexts, 'multiple_template_found', { ext: ext, numMatches: String(theTemplates.length) });
					templates.length = 0;
					theTemplates.forEach(element => {
						templates.push(element);
					});
				}
				else
				{
					placeHolderText = i18n(i18nTexts, 'template_is_not_found', { ext: ext });
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
