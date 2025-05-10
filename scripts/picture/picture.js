// 初期起動時の呼び出し
function initPicture() {
    const URL = "/api/pictures/";
    const imageUrl = "/picture/"
    let result = "";
    let insertText = "";
    const beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    insertText += '<div id="pictureHeader"></div>';
    insertText += '<div id="pictureBody"></div>';
    insertText += '<div id="pictureFooter"><div id="more"><p><a href="/picture/rensai.html">連載もの</a><br><a href="/picture/backnumber.html">もっと見る</a></p></div></div>';
    $('#picture').html(insertText);

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
        className: 'pictureSpinner', // The CSS class to assign to the spinner
        zIndex: 2e6, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    var target = document.getElementById('pictureBody');
    const pictureSpinner = new Spinner(opts).spin($('pictureBody'));
    $('pictureBody').data('pictureSpinner', pictureSpinner);

    // 絵を読み込む
    $.ajax({
        url: URL + '?item=4',
            type: 'GET',
            dataType: 'json'
    })
    .done(data => {
        for (var i = 0; i < 2; i++) {
            result += '<ul class="thumbnail">';
            const pictureMoment1 = moment(data.pictures[i*2].date, "YYYY-MM-DD");
            const newTag1 = pictureMoment1.isAfter(beforeMoment) ? '<img src="/images/a_new.gif"><br>' : '';
            result += '<li>' + newTag1 + '<a class="image" href="'
                + imageUrl + data.pictures[i*2].page
                + '"><img class="'
                + data.pictures[i*2].direction
                + '" src="' + imageUrl + 'images/s/'
                + data.pictures[i*2].thumbnail
                + '" title="'
                + data.pictures[i*2].title
                + '"></a></li>';

            const pictureMoment2 = moment(data.pictures[i*2+1].date, "YYYY-MM-DD");
            const newTag2 = pictureMoment2.isAfter(beforeMoment) ? '<img src="/images/a_new.gif"><br>' : '';
            result += '<li>' + newTag2 + '<a class="image" href="'
                + imageUrl +data.pictures[i*2+1].page
                + '"><img class="'
                + data.pictures[i*2+1].direction
                + '" src="' + imageUrl + 'images/s/'
                + data.pictures[i*2+1].thumbnail
                + '" title="'
                + data.pictures[i*2+1].title
                + '"></a></li>';
            result += '</ul>';
        }
    })
    .fail(() => {
        result = '　絵の読み込みに失敗しました。';
    })
    .always(() => {
        result = $(result);
        $('#pictureBody').html(result);

        if ($('#container') != null) {
            result.ready(() => {
                if (typeof $('#container').isotope == "function") $('#container').isotope('layout');
            });
        }
    });
}
