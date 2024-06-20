const i18n =
{
	"select_result":
	{
		'en': "Select a result to jump.",
		'ja': "ジャンプ先となる検索結果を選択して下さい。",
	},
	"no_match":
	{
		'en': "No match for {0} in this file.",
		'ja': "このファイルに {0} にマッチする箇所はありませんでした。",
	},
	"no_active_editor":
	{
		'en': 'Please execute while a text editor is active.',
		'ja': 'テキストエディタがアクティブな時に呼び出して下さい。',
	},
	"template_is_not_found":
	{
		'en': "Template for {0} is not found. Select one to execute.",
		'ja': "拡張子 {0} に対応するテンプレートは見つかりませんでした。実行するテンプレートを選択して下さい。",
	},
	"multiple_template_found":
	{
		'en': "{0} matches {1} templates. Select one to execute.",
		'ja': "拡張子 {0} に対応するテンプレートは {1} 個見つかりました。実行するテンプレートを選択して下さい。",
	},
	'templatesNotFound':
	{
		'en': 'No templates are found. Shall I put sample templates in the settings JSON?',
		'ja': 'テンプレートが見つかりません。サンプルとなるテンプレート設定を書き込みますか？',
	},
	'yes':
	{
		'en': 'Yes',
		'ja': 'はい'
	},
	'defaultSettingsWritten':
	{
		'ja': 'ディフォルト設定を書き込みました。もう一度実行して下さい。',
		'en': 'Default settings are written. Please execute again.'
	}
};

/**
 * 現在の言語設定に従って指定されたキーに対応するテキストを取得する。
 * @param key 取得するテキストのキー。
 * @param val テキストの中に任意の値を表示する場合はそれらを指定。省略可。
 * @returns キーに対応するテキストの文字列。
 */
function i18nText(key: string, ...val: string[]): string
{
	const localeKey = <string>JSON.parse(<string>process.env.VSCODE_NLS_CONFIG).locale;
	const text = i18n[key as keyof typeof i18n];
	let s = text[localeKey as keyof typeof text];

	// 見つからない場合は最初に書かれている言語を使う
	if (s === undefined)
	{
		if (Object.keys(text).length > 0)
		{
			s = text[Object.keys(text)[0] as keyof typeof text];
		}
		else
		{
			s = '';
		}
	}

	for (let i = 0; i < val.length; i++)
	{
		s = s.replace(`{${i}}`, val[i]);
	}
	return s;
}

export default i18nText;