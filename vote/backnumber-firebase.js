/* global Spinner */

const URL = 'https://asia-northeast1-murumoya-api.cloudfunctions.net/votes';
const ITEMS = 10;		// 1回に読み込むレコード数
let lastVote = '2999-99-99';
let page = 0;
let records = 0;		// 合計レコード数

// 初期起動時の呼び出し
function initVoteResult() {
    let result = '';

    // レコード数を取得する
    $.ajax({
        url: URL + '?themes&count',
        type: 'GET',
        dataType: 'json'
    })
    .done(data => {
        records = data.count;
        loadVoteResult();
    })
    .fail(() => {
        result = 'レコード数の読み込みに失敗しました。';
    })
    .always(() => {
        $('#newVoteResult').html(result);
    });
}

function loadVoteResult(_page) {
    let result = '';
    const beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    const opts = {
        lines: 13, // The number of lines to draw
        length: 5, // The length of each line
        width: 2, // The line thickness
        radius:5, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 58, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#00b377', // #rgb or #rrggbb or array of colors
        speed: 0.9, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e8, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    let spinner = new Spinner(opts).spin(document.getElementById('newVoteResult'));
    $('newVoteResult').data('spinner', spinner);

    // 絵を読み込む
    $.ajax({
        url: URL + '?themes&num=10&endBefore=' + lastVote,
        type: 'GET',
        dataType: 'json'
    })
    .done(votes => {
        votes.map(vote => {
            if (vote.date == null) {
                result += '<p class="yoko"><a class="image"  href="/vote/result'
                    + vote.id + '.html'
                    + '"><img src="images/nowPrinting.png"></a></p>';
                result += '<p class="content">';
                result += '<a href="/vote/result'
                    + vote.id + '.html">'
                    + vote.title
                    + '</a>'
                    + '</p></div><hr>';
            } else {
                result += '<p class="'
                    + vote.direction
                    + '"><a class="image" href="/vote/result'
                    + vote.id + '.html'
                    + '"><img src="images/s/'
                    + vote.thumbnail
                    + '"></a></p>'
                result += '<p class="content">';
                const voteResultMoment = moment(vote.date, "YYYY-MM-DD");
                const newTag = voteResultMoment.isAfter(beforeMoment) ? '<img src="/images/a_new.gif"><br>' : '';
                result += newTag;
                result += '<a href="/vote/result'
                    + vote.id + '.html">'
                    + vote.title
                    + '</a>'
                    + '</p><hr>';

                // 最後に表示した記事の日付を覚えておく
                lastVote = vote.starttime;
            }
        });

        // 続きのレコードがあれば「続きを表示する」ボタンを表示する
        if (++page*ITEMS < records) {
            result += '<div class="nextButton">続きを表示する</div>';
        } else {
            result += '<br>';
        }
    })
    .fail(() => {
        result = "絵の読み込みに失敗しました。";
    })
    .always(() => {
        spinner.stop();
        $('#newVoteResult').append(result);
        $('.nextButton').bind('click', () => {
            $('.nextButton').unbind();
            $('.nextButton').remove();
            loadVoteResult();
        });
    });
}
