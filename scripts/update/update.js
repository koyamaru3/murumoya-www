// 初期起動時の呼び出し
function initUpdate() {
    var items;
    var date = "";
    var result = "最終更新日：";
    var url = "/api/updates/";
    var mode = 0;
    var newMode = 0;
    var beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    var insertText = "";
    insertText += '<div id="updateHeader"></div>';
    insertText += '<div id="updateBody">';
    insertText += '<div id="updateNew"></div>';
    insertText += '<textarea id="updateMessage" name="updateMessage" rows="6" readonly></textarea>';
    insertText += '</div>';
    insertText += '<div id="updateFooter"></div>';
    $("#update").html(insertText);

    var opts = {
        lines: 13, // The number of lines to draw
        length: 5, // The length of each line
        width: 2, // The line thickness
        radius:5, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 58, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#fff', // #rgb or #rrggbb or array of colors
        speed: 0.9, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'updateSpinner', // The CSS class to assign to the spinner
        zIndex: 2e6, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    var target = document.getElementById('updateBody');
    var updateSpinner = new Spinner(opts).spin(target);
    $(target).data('updateSpinner', updateSpinner);

    // 引数用に１年前の日付を取得
    date = moment().subtract(1, "years").format("YYYY-MM-DD");

    // 更新履歴を読み込む
    $.ajax({
        url: url+"?date="+date,
            type: 'GET',
            dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        for (var i = 0, len = data.updates.length; i < len; i++) {
            if (mode == 0) {
                var updateMoment = moment(data.updates[i].date, "YYYY-MM-DD");
                if (updateMoment.isAfter(beforeMoment)) {
                    newMode = 1;
                }
                dateFormat = moment(data.updates[i].date, "YYYY-MM-DD").format("YYYY/M/D");
                result += dateFormat + "\r\n";
            }
            result += data.updates[i].content + "\r\n";

            if (i+1 < len && data.updates[i].date == data.updates[i+1].date) {
                // 次のデータも同じ日付の更新情報の場合
                mode = 1;
            } else {
                // 次のデータは違う日付の更新情報の場合
                mode = 0;
                result += "\r\n";
            }
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = "更新履歴情報の読み込みに失敗しました。";
    })
    .always(function( jqXHR, textStatus ) {
        if (newMode == 1) {$("#updateNew").html('<img src="/images/a_new.gif">');}
        $("#updateMessage").val(result);
        updateSpinner.stop();
    });
}
