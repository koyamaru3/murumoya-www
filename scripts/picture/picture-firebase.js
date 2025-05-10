// 初期起動時の呼び出し
function initPicture() {
    const URL = 'https://storage.googleapis.com/cache-murumoya-api/picture.json';
    const imageUrl = '/picture/';
    var result = '';
    var pictureMoment = null;
    var beforeMoment = moment().subtract(5, 'days'); // 今日から5日以内ならnew

    let insertText = '<div id="pictureHeader"></div>';
    insertText += '<div id="pictureBody"></div>';
    insertText += '<div id="pictureFooter"><div id="more"><p><a href="/picture/rensai.html">連載もの</a><br><a href="/picture/backnumber.html">もっと見る</a></p></div></div>';
    $('#picture').html(insertText);

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
        className: 'pictureSpinner', // The CSS class to assign to the spinner
        zIndex: 2e6, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    let spinner = new Spinner(opts).spin(document.getElementById('pictureBody'));
    $('#pictureBody').data('spinner', spinner);

    // 絵を読み込む
    $.ajaxSetup({ cache: false });
    $.getJSON(URL, pictures => {})
    .success(pictures => {
        for (var i = 0; i < 2; i++) {
            result += '<ul class="thumbnail">';
            pictureMoment = moment(pictures[i*2].date, 'YYYY-MM-DD');
            if (pictureMoment.isAfter(beforeMoment)) {
                newTag = '<img src="/images/a_new.gif"><br>';
            } else {
                newTag = '';
            }
            result += '<li>' + newTag + '<a class="image" href="'
                + imageUrl + pictures[i*2].page
                + '"><img class="'
                + pictures[i*2].direction
                + '" src="' + imageUrl + 'images/s/'
                + pictures[i*2].thumbnail
                + '" title="'
                + pictures[i*2].title
                + '"></a></li>';

            pictureMoment = moment(pictures[i*2+1].date, 'YYYY-MM-DD');
            if (pictureMoment.isAfter(beforeMoment)) {
                newTag = '<img src="/images/a_new.gif"><br>';
            } else {
                newTag = '';
            }
            result += '<li>' + newTag + '<a class="image" href="'
                + imageUrl +pictures[i*2+1].page
                + '"><img class="'
                + pictures[i*2+1].direction
                + '" src="' + imageUrl + 'images/s/'
                + pictures[i*2+1].thumbnail
                + '" title="'
                + pictures[i*2+1].title
                + '"></a></li>';
            result += '</ul>';
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = '　絵の読み込みに失敗しました。';
    })
    .always(() => {
        spinner.stop();
        $('#pictureBody').html(result).load();
    });
}
