// 初期起動時の呼び出し
function initUpdate() {
    let result = '最終更新日：';
    const URL = 'https://storage.googleapis.com/cache-murumoya-api/update.json';
    let newMode = 0;
    const beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    $('#update').html('\
        <div id="updateHeader"></div>\
        <div id="updateBody">\
        <div id="updateNew"></div>\
        <textarea id="updateMessage" name="updateMessage" rows="6" readonly></textarea>\
        </div>\
        <div id="updateFooter"></div>');

    const opts = {
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

    let spinner = new Spinner(opts).spin(document.getElementById('updateBody'));
    $('#updateBody').data('spinner', spinner);

    // 引数用に１年前の日付を取得
    const date = moment().subtract(1, 'years').format('YYYY-MM-DD');

    // 更新履歴を読み込む
    $.ajaxSetup({ cache: false });
    $.getJSON(URL, updates => {})
    .success(updates => {
        let lastDate = "";
        updates.map(update => {
            if (update.date != lastDate) {
                if (moment(update.date, 'YYYY-MM-DD').isAfter(beforeMoment)) newMode = 1;
                const dateFormat = moment(update.date, 'YYYY-MM-DD').format('YYYY/M/D');
                result += dateFormat + '\r\n';
            }
            result += update.content + '\r\n\r\n';
            lastDate = update.date;
        });
    })
    .fail(() => {
        result = '更新履歴情報の読み込みに失敗しました。';
    })
    .always(() => {
        if (newMode == 1) {$('#updateNew').html('<img src="/images/a_new.gif">');}
        $('#updateMessage').val(result);
        spinner.stop();
    });
}
