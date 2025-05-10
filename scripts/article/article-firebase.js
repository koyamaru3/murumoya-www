// 初期起動時の呼び出し
function initArticle() {
    const URL = 'https://storage.googleapis.com/cache-murumoya-api/article.json';
    const pageUrl = '/etc/';
    let result = '';
    let insertText = '';
    const num = 3;
    const beforeMoment = moment().subtract(5, 'days'); // 今日から5日以内ならnew

    insertText += '<div id="articleHeader"></div>';
    insertText += '<div id="articleBody"></div>';
    insertText += '<div id="articleFooter"><div id="more"><p><a href="/etc/article/backnumber.html">もっと見る</a></p></div></div>';
    $('#article').html(insertText);

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
        className: 'articleSpinner', // The CSS class to assign to the spinner
        zIndex: 2e6, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    let spinner = new Spinner(opts).spin(document.getElementById('articleBody'));
    $('#articleBody').data('spinner', spinner);

    // 記事を読み込む
    $.ajaxSetup({ cache: false });
    $.getJSON(URL, articles => {})
    .success(articles => {
        result += '<ul>';
        for (let i = 0; i < num; i++) {
            articleMoment = moment(articles[i].date, 'YYYY-MM-DD');
            const newTag = articleMoment.isAfter(beforeMoment) ? '<img src="/images/a_new.gif">' : '';
            result += '<li><a href="'
                + pageUrl + articles[i].page
                + '"><img class="'
                + articles[i].direction
                + '" src="' + pageUrl + 'images/s/'
                + articles[i].thumbnail
                + '" title="'
                + articles[i].title
                + '"></a><p><a href="'
                + pageUrl + articles[i].page
                + '">' + newTag
                + articles[i].title
                + '</a></p></li>';
        }
        result += '</ul>';
    })
    .complete(() => {
        spinner.stop();
        $('#articleBody').html(result).load();
    });
}
