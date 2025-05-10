// 初期起動時の呼び出し
function initArticle() {
    var url = "/api/articles/";
    var pageUrl = "/etc/";
    var result = "";
    var insertText = "";
    var newTag = "";
    var pictureMoment = null;
    var num = 3;
    var beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    insertText += '<div id="articleHeader"></div>';
    insertText += '<div id="articleBody"></div>';
    insertText += '<div id="articleFooter"><div id="more"><p><a href="/etc/article/backnumber.html">もっと見る</a></p></div></div>';
    $("#article").html(insertText);
    
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
        className: 'articleSpinner', // The CSS class to assign to the spinner
        zIndex: 2e6, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
	
    var target = document.getElementById('articleBody');
    var articleSpinner = new Spinner(opts).spin(target);
    $(target).data('articleSpinner', articleSpinner);	
	
    // 記事を読み込む
    $.ajax({
        url: url+"?item="+num,
	        type: 'GET',
	        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        result += '<ul>';
        for (var i = 0; i < num; i++) {
            articleMoment = moment(data.articles[i].date, "YYYY-MM-DD");
            if (articleMoment.isAfter(beforeMoment)) {
                newTag = '<img src="/images/a_new.gif">';
            } else {
                newTag = '';
            }
            result += '<li><a href="'
                + pageUrl + data.articles[i].page
                + '"><img class="'
                + data.articles[i].direction
                + '" src="' + pageUrl + 'images/s/'
                + data.articles[i].thumbnail
                + '" title="'
                + data.articles[i].title
                + '"></a><p><a href="'
                + pageUrl + data.articles[i].page
                + '">' + newTag
                + data.articles[i].title
                + '</a></p></li>';
        }
        result += '</ul>';
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = '　絵の読み込みに失敗しました。';
    })
    .always(function(jqXHR, textStatus) {
		result = $(result);
        $("#articleBody").html(result);
		
		if ($('#container') != null) {
			result.ready(function() {
				if (typeof $('#container').isotope == "function") $('#container').isotope('layout');
			});
		}
    });
}
