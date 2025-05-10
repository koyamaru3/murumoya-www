// 初期起動時の呼び出し
function initVoteResult() {
    const URL = 'https://storage.googleapis.com/cache-murumoya-api/voteresult.json';
    let result = '';
    const num = 5;
    const beforeMoment = moment().subtract(5, 'days'); // 今日から5日以内ならnew

    let insertText = '<div id="voteResultHeader"></div>';
    insertText += '<div id="voteResultBody"></div>';
    insertText += '<div id="voteResultFooter"><p><a href="/vote/backnumber.html">もっと見る</a></p></div>';
    $('#voteResult').html(insertText);

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
        className: 'voteResultSpinner', // The CSS class to assign to the spinner
        zIndex: 2e6, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    let spinner = new Spinner(opts).spin(document.getElementById('voteResultBody'));
    $('#voteResultBody').data('spinner', spinner);

    // 投票を読み込む
    $.ajaxSetup({ cache: false });
    $.getJSON(URL, data => {})
    .success(data => {
        result += '<ul>';
        data.map(theme => {
            result += '<li><a href="'
                + '/vote/result' + theme.id + '.html'
                + '">'
                + theme.title;

            if (theme.date != null) result += '　<strong>★集計済み</strong>'
            voteResultMoment = moment(theme.date, "YYYY-MM-DD");
            newTag = voteResultMoment.isAfter(beforeMoment) ? '<img src="/images/a_new.gif"><br>' : '';
            result += newTag + '</a></li>';

        });
        result += '</ul>';
    })
    .fail(() => {
        result = '　投票結果の読み込みに失敗しました。';
    })
    .always(() => {
        $('#voteResultBody').html(result);
    });
}
