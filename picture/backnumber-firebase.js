/* global Spinner */

const URL = 'https://asia-northeast1-murumoya-api.cloudfunctions.net/pictures';
const ITEMS = 10;		// 1回に読み込むレコード数
let lastPicture = '2999-99-99';
let page = 0;
let records = 0;		// 合計レコード数

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

// 初期起動時の呼び出し
function initPicture() {
    let result = "";

    // レコード数を取得する
    $.ajax({
        url: URL + '?count',
        type: 'GET',
        dataType: 'json'
    })
    .done(data => {
        records = data.count;
        loadPicture();
    })
    .fail(() => {
        result = "レコード数の読み込みに失敗しました。";
    })
    .always(() => {
        $("#article").html(result);
    });
}


// 初期起動時の呼び出し
function loadPicture() {
    const imageUrl = ""
    let result = "";
    const beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    let spinner = new Spinner(opts).spin($('picture'));
    $('#picture').data('spinner', spinner);

    // 絵を読み込む
    $.ajax({
        url: URL+'?num=10&endBefore=' + lastPicture,
        type: 'GET',
        dataType: 'json'
    })
    .done(pictures => {
        pictures.map(picture => {

            result += '<p class="'
                + picture.direction
                + '"><a href="'
                + picture.page
                + '" title="'
                + picture.title
                + '"><img src="' + imageUrl + 'images/s/'
                + picture.thumbnail
                + '" title="'
                + picture.title
                + '"></a></p>';
            result += '<p class="content">';
            const pictureMoment = moment(picture.date, "YYYY-MM-DD");
            const newTag = pictureMoment.isAfter(beforeMoment) ? '<img src="/images/a_new.gif"><br>' : '';
            result += newTag;
            result += '<a href="'
                + picture.page
                + '" title="'
                + picture.title
                + '">'
                + picture.title
                + '</a><br>'
                + picture.content
                + '</p><hr>';

            // 最後に表示した記事の日付を覚えておく
            lastPicture = picture.date;
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
        $("#article").append(result);
        $(".nextButton").bind("click", function(){
            $(".nextButton").unbind();
            $(".nextButton").remove();
            loadPicture();
        });
    });
}
