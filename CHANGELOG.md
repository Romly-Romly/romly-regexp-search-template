# Change Log

## 日本語(Japanese)

[English is here](#english英語)

### [0.1.2] - 2024-06-26

#### 削除
- 検索前に改行コードを`\n`に統一する機能をオンにすると、ヒットした位置に正しくジャンプできていなかったため同機能を削除。

### [0.1.1] - 2024-06-25

#### 修正
- 表示言語がja/en以外の時にエラーになってしまっていた不具合を修正。

### [0.1.0] - 2024-06-21

#### 追加
- 正規表現に名前付きキャプチャグループを使えるようにした。
- 検索結果の description に正規表現でキャプチャした値を表示できるようにした。伴って `descriptionLabel` 設定は廃止。
- 検索前に改行コードを`\n`に統一する機能を追加した。

#### 変更
- ディフォルトテンプレートを更新し、Pythonの関数の description にPydocのコメントが表示されるようにした。

### [0.0.4] - 2021-08-21

#### 修正
- Broken screencapture link in the Readme.md.

### [0.0.3] - 2021-08-21

#### 追加
- 初回実行時など、テンプレートが見つからなかった場合にサンプルとなるテンプレートを設定に書き込めるように。伴って`useDefaultTemplates`設定は廃止。
- サンプルとなるテンプレートにC#, C++, HTMLなどを追加。

#### 修正
- 言語設定が日本語でも英語でもない場合にメッセージが表示されていなかった不具合を修正。

### [0.0.2] - 2020-02-08

- アイコンを追加。
- マーケットプレイスで拡張機能の説明文が正しく表示されていなかったのを修正。

### [0.0.1] - 2020-02-08

- 初回リリース。










-----










## English(英語)

[日本語(Japanese)はこちら](#日本語japanese)

### [0.1.2] - 2024-06-26

#### Removed
- Removed the feature that unifies line breaks to `\n` before searching, as it was causing issues with correctly jumping to the matched positions.

### [0.1.1] - 2024-06-25

#### Fixed
- Fixed an issue where an error occurred when the display language was set to anything other than ja/en.

### [0.1.0] - 2024-06-21

#### Added
- Supported named capture groups in regular expressions.
- Supported displaying captured values in the search results' description using regular expressions. Consequently, the `descriptionLabel` setting has been removed.
- Added a feature to unify line breaks to `\n` before execute the match.

#### Changed
- Updated the default template to display Pydoc comments in the description of Python functions.

### [0.0.4] - 2021-08-21

#### Fixed
- Broken screencapture link in the Readme.md.

### [0.0.3] - 2021-08-21

#### Added
- Now the extension can write sample templates when no template settings were found when such as at the first launch. Accordingly `useDefaultTemplates` setting is removed.
- Added sample templates for C#, C++, HTML, etc.

#### Fixed
- All messages haven't shown when the display language setting is neither Japanese and English.

### [0.0.2] - 2020-02-08

- Add an icon.
- Fixed extension description on Marketplace.

### [0.0.1] - 2020-02-08

- Initial release.