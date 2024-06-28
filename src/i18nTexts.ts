import { LocalizedMessages } from "./i18n";

const messages: LocalizedMessages =
{
	"select_result":
	{
		en: "Select a result to jump.",
		ja: "ジャンプ先となる検索結果を選択して下さい。",
	},
	"no_match":
	{
		en: "No match for {label} in this file.",
		ja: "このファイルに {label} にマッチする箇所はありませんでした。",
	},
	"no_active_editor":
	{
		en: 'Please execute while a text editor is active.',
		ja: 'テキストエディタがアクティブな時に呼び出して下さい。',
	},
	"template_is_not_found":
	{
		en: "Template for {ext} is not found. Select one to execute.",
		ja: "拡張子 {ext} に対応するテンプレートは見つかりませんでした。実行するテンプレートを選択して下さい。",
	},
	"multiple_template_found":
	{
		en: "{ext} matches {numMatches} templates. Select one to execute.",
		ja: "拡張子 {ext} に対応するテンプレートは {numMatches} 個見つかりました。実行するテンプレートを選択して下さい。",
	},
	'templatesNotFound':
	{
		en: 'No templates are found. Shall I put sample templates in the settings JSON?',
		ja: 'テンプレートが見つかりません。サンプルとなるテンプレート設定を書き込みますか？',
	},
	'defaultSettingsWritten':
	{
		ja: 'ディフォルト設定を書き込みました。もう一度実行して下さい。',
		en: 'Default settings were written. Please execute the command again.'
	}
};

export default messages;