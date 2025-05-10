// 初期起動時の呼び出し
function initKinenbi() {
    var items;
    var date = "";
    var result = "";
    var url = "/api/kinenbis/";
    var mode = 0;
    var insertText = "";
    insertText += '<div id="kinenbiHeader"></div>';
    insertText += '<div id="kinenbiBody"></div>';
    insertText += '<div id="kinenbiFooter"><div id="kinenbiFooterLeft"></div><div id="kinenbiFooterCenter"></div><div id="kinenbiFooterRight"></div></div></div>';
    $("#kinenbi").html(insertText);
    $("#kinenbiFooterCenter").html('<a href="kinenbiList.html">作成中)ムルモ屋本舗版<br>ミルモでポン！記念日</a>');

    // 記念日を読み込む
    $.ajax({
        url: url+"?item=3",
        type: 'GET',
	    dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        result += "<ul>";
        for (var i = 0, len = data.kinenbis.length; i < len; i++) {
//        for (var i = 0, len = 3; i < len; i++) {
            result += "<li>" + data.kinenbis[i].month + "月" + data.kinenbis[i].day + "日<br>" + data.kinenbis[i].title + "</li>";
        }
        result += "</ul>";
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = "更新履歴情報の読み込みに失敗しました。";
    })
    .always(function( jqXHR, textStatus ) {
        $("#kinenbiBody").html(result);
    });
}
