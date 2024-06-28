# Romly RegExp Search Template

## 日本語(Japanese)

[English is here](#english英語)

予め定義しておいた正規表現による検索をクイックコマンドパレット内で実行、その検索結果を選択してジャンプできるようにする拡張機能です。言語の拡張機能がアウトラインをサポートしていない場合や、言語という程ではない独自の目次のようなものをリストアップしたい場合、文章内でよく使うキーワードの箇所に頻繁にジャンプする必要がある場合などに使えます。

![Screencast](screencast.gif)

### 機能

- 事前に定義しておいた正規表現検索をコマンドパレットから実行する。
- その検索結果をコマンドパレットに表示し、文章の該当箇所にジャンプする。

### 拡張機能の設定

* `Romly-RegexpSearchTemplate.templates`<br>実行する正規表現のリストを定義します。これは下記のような定義を持つJSONの配列です。ひとつのアイテムには一度に実行する複数の正規表現と、それらの正規表現をどの拡張子で実行するかを指定できます。

	* `label`<br>このアイテムの名前です。通常は表示されませんが、対応する拡張子が見つからなかった場合や、単一の拡張子に対し複数のアイテムが該当した時に選択する為に使用されます。
	* `extensions`<br>編集中のファイルの拡張子がこの拡張子リストに存在する場合、このアイテムに定義されている正規表現による検索が実行されます。複数のアイテムで同じ拡張子が定義されていた場合、実行時に選択肢が表示されます。
	* `templates`<br>このアイテムで実行する一つ以上の正規表現です。下記の3つの値を持つJSONオブジェクトの配列です。

		* `name`
		* `pattern`<br>実行する正規表現です。バックスラッシュ（ `\` ）を `\\` にエスケープする必要がことに注意して下さい。
		* `flag`<br>正規表現のフラグ（gmsなど）を設定します。このプロパティを省略した場合、フラグには `gm` が指定されます。
		* `label`<br>検索結果をコマンドパレットに表示する時のテキストです。 `$0` ～ `$9` で正規表現のキャプチャ、 `${<group_name>}` という形式で名前付きキャプチャ、またVS Codeで定義されているアイコン（ `$(<symbol-method>)` など）も使えます。
		* `description`<br>検索結果がコマンドパレットに表示される時にdescriptionとして右に表示されます。省略した場合は拡張機能全体の設定の "Description Label 2" が使用されます。<br>`{$0}` ～ `${9}` で正規表現のキャプチャ、 `${<group_name>}` で名前付きキャプチャ、 `${lineNumber}` で行番号を使えます。
		* `searchText`<br>検索結果右に表示される検索ボタンをクリックした時にファイル検索に渡される検索テキストです。 `description` 同様の変数が使えます。省略した場合はマッチした全体が渡されます（ `${0}` と同等）。

	記述例は [default_templates.ts](src/default_templates.ts) を参照して下さい。なお default_templates.ts の内容は、初回実行時など設定が見つからなかった場合に表示される確認で「はい」を選択すると初期設定として追加されます。

* その他の設定は拡張機能の設定画面の説明をご覧下さい。

### リリースノート

[`CHANGELOG.md`](CHANGELOG.md)をご覧ください。









-----










## English(英語)

[日本語(Japanese)はこちら](#日本語japanese)

This extension gives you pre-defined regular expression search, shows the results and also enables you to jump, within the VS Code Quick Command Palette. Would be fit when the language extension for your file doesn't support outline, when you want to list up some kind of custom indices in your document, when you need to jump to the keywords in your document frequently.

![Screencast](screencast.gif)

### Features

- Execute the predefined regular expression search from the command palette.
- Show its result in the command palette and enables you to jump matched location.

### Extension Settings

* `Romly-RegexpSearchTemplate.templates`<br>Defines regular expressions list that will be executed. This will be an array contains JSON objects which have definition like below. A single item can hold multiple regular expressions which are executed at once, as well as the file extensions for which these regular expressions should be executed.

	* `label`<br>Name of this item. It's usually not displayed, but is used to select when a corresponding extension cannot be found or when multiple items correspond to a single extension.
	* `extensions`<br>If the extension of the file being edited exists in this list of extensions, the search defined by the regular expressions in this item will be executed. If the same extension is defined in multiple items, a selection will be displayed at runtime.
	* `templates`<br>One or more regular expressions that will be executed at once by this item. It's a JSON array, and each object has the three properties listed below.

		* `name`
		* `pattern`<br>The regular expression which will be executed. Note that backslashes (`\`) must be escaped as `\\`.
		* `flag`<br>Specify the regular expression flags (e.g., `gms`). If this property is omitted, `gm` will be specified as the default flags.
		* `label`<br>The text label when its result is shown in the command palette. You can use regular expression captures like `$0`..`$9` or named captures liek `${name}`. Also you can use icons that is defined by VS Code such as `$(symbol-method)`.
		* `description`<br>This is displayed on the right as a description when search results appear in the command palette. If omitted, the "Description Label 2" from the extension settings is used. You can use `${0}` .. `${9}` for regex captures, `${<group_name>}` for named captures, and `${lineNumber}` for the line number.
		* `searchText`<br>This is the search text passed to the file search when the search button displayed on the right of the search results is clicked. Variables similar to `description` can be used. If omitted, the entire matched text is passed (equivalent to `${0}`).

	Please refer to [default_templates.ts](src/default_templates.ts) for an example. Note that the contents of templates_sample.json will be added as default settings if you select 'Yes' in the prompt displayed when settings are not found, such as during the initial execution.

* See VS Code extension settings screen for the other settings for this extension.

### Release Notes

Please see [`CHANGELOG.md`](CHANGELOG.md) for details.