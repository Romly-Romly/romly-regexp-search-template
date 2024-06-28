/**
 * 入力文字列をJSON用にエスケープする
 * @param {string} str エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
function escapeForJSON(str)
{
	return str
		.replace(/\\/g, '\\\\')	// \ -> \\
		.replace(/"/g, '\\"')	// " -> \"
		// テキストエリアは改行のキー入力を受け付けないようにしてあるが、貼り付ける事は可能なので、その場合は\nなどに変換。
		.replace(/\n/g, '\\n')	// \n -> \\n
		.replace(/\r/g, '\\r');	// \r -> \\r
}










/**
 * エスケープされた文字列を元に戻す
 * @param {string} str - エスケープ解除する文字列
 * @returns {string} - 元の文字列
 */
function unescapeFromJSON(str)
{
	return str
		.replace(/\\n/g, '\\n')
		.replace(/\\r/g, '\\r')
		.replace(/\\"/g, '"')
		.replace(/\\\\/g, '\\');
}










/**
 * テキストエリアの内容をエスケープして結果を別のテキストエリアに表示する
 */
function escapeString(fromId, toId)
{
	const input = document.getElementById(fromId).value;
	const escaped = escapeForJSON(input);
	document.getElementById(toId).value = escaped;
}










/**
 * テキストエリアの内容をエスケープ解除して結果を別のテキストエリアに表示する
 */
function unescapeString(fromId, toId)
{
	const output = document.getElementById(fromId).value;
	const unescaped = unescapeFromJSON(output);
	document.getElementById(toId).value = unescaped;
}










async function copyTextArea(textAreaId)
{
	const textarea = document.getElementById(textAreaId);
	try
	{
		await navigator.clipboard.writeText(textarea.value);
		textarea.select();
	}
	catch (err)
	{
		console.error('コピーに失敗しました:', err);
		console.log("引き続きexecCommand('copy')を試します。");

		// 古い、またはセキュリティの低い方法を試す。
		// Live Serverを使ってる時なんかはnavigator.clipboardが使えないみたい。
		textarea.select();
		document.execCommand('copy');
	}
}










/**
 * テキストエリア用の改行の入力を無効にする処理。
 * @param event
 */
function onTextareaKeyDown(event)
{
	if (event.keyCode === 13)
		event.preventDefault();
}










window.document.getElementById('raw_regexp').addEventListener('keydown', onTextareaKeyDown);
window.document.getElementById('escaped_regexp').addEventListener('keydown', onTextareaKeyDown);