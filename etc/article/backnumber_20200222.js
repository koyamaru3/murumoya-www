/* global Spinner */

var records = 0;		// 合計レコード数
var items = 10;		// 1回に読み込むレコード数

var opts = {
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
var target;
var spinner;

// 初期起動時の呼び出し
function initArticle() {
    var url = "/api/articles/count/";
    var result = "";

    // レコード数を取得する
    $.ajax({
        url: url,
        type: 'GET',
        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
		records = data.count;
		loadArticle(0);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = "レコード数の読み込みに失敗しました。";
    })
    .always(function(jqXHR, textStatus) {
        $("#article").html(result);
    });
}

function loadArticle(_page) {
    var url = "/api/articles/";
    var pageUrl = "/etc/";
    var result = "";
    var insertText = "";
    var newTag = "";
    var articleMoment = null;
    var beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew
	var page = _page;
    
    target = document.getElementById('article');
    spinner = new Spinner(opts);
	spinner.spin(target);
	
	// 記事を読み込む
    $.ajax({
        url: url+'?item='+items+'&page='+page,
        type: 'GET',
        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        for (var i = 0, len = data.articles.length; i < len; i++) {
//            result += '<div class="articleLine">';
            result += '<p class="'
                + data.articles[i].direction
                + '"><a href="'
                + pageUrl + data.articles[i].page
                + '" title="'
                + data.articles[i].title
                + '"><img src="' + pageUrl + 'images/s/'
                + data.articles[i].thumbnail
                + '" title="'
                + data.articles[i].title
                + '"></a></p>';
            result += '<p class="content">';
            articleMoment = moment(data.articles[i].date, "YYYY-MM-DD");
            if (articleMoment.isAfter(beforeMoment)) {
                newTag = '<img src="/images/a_new.gif"><br>';
            } else {
                newTag = '';
            }
            result += newTag;
            result += '<a href="'
                + pageUrl + data.articles[i].page
                + '" title="'
                + data.articles[i].title
                + '">'
                + data.articles[i].title
                + '</a>'
                + '</p><hr>';
        }

		// 続きのレコードがあれば「続きを表示する」ボタンを表示する
		if ((page+1)*items < records) {
			result += '<div class="nextButton">続きを表示する</div>';
		} else {
			result += '<br>';
		}
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = "記事の読み込みに失敗しました。";
    })
    .always(function(jqXHR, textStatus) {
		spinner.stop();
//        result += "<br>";
        $("#article").append(result);
		$(".nextButton").bind("click", function(){
			$(".nextButton").unbind();
			$(".nextButton").remove();
			loadArticle(page+1);
		});
    });
}
