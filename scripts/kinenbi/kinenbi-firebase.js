// 初期起動時の呼び出し
function initKinenbi() {
    let result = '';
    const URL = 'https://storage.googleapis.com/cache-murumoya-api/kinenbi.json';

    const insertText = '<div id="kinenbiHeader"></div>'
    + '<div id="kinenbiBody"></div>'
    + '<div id="kinenbiFooter"><div id="kinenbiFooterLeft"></div><div id="kinenbiFooterCenter"></div><div id="kinenbiFooterRight"></div></div></div>';
    $('#kinenbi').html(insertText);
    $('#kinenbiFooterCenter').html('<a href="kinenbiList.html">作成中)ムルモ屋本舗版<br>ミルモでポン！記念日</a>');

    // 記念日を読み込む
    $.ajaxSetup({ cache: false });
    $.getJSON(URL, data => {})
    .success(data => {
        result += '<ul>';
        data.map(kinenbi => {
            result += '<li>' + kinenbi.month + '月' + kinenbi.day + '日<br>' + kinenbi.title + '</li>';

        });
        result += "</ul>";
    })
    .fail(() => {
        result = '記念日情報の読み込みに失敗しました。';
    })
    .always(() => {
        $('#kinenbiBody').html(result);
    });
}
