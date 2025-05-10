// 初期起動時の呼び出し
function getList() {
    var url = "/api/novels/view/";
    var result = "";
    var insertText = "";
    var newTag = "";
    var pictureMoment = null;

/*
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
	
    var target = document.getElementById('novelBody');
    var pictureSpinner = new Spinner(opts).spin(target);
    $(target).data('pictureSpinner', pictureSpinner);	
*/

/*
<div class="panel">
<p class="author">夏田みかんさん</p>
<div>
<ul>
<li><a href="titleList.html">1番目のタイトル</a></li>
<li><a href="titleList.html">2番目のタイトル</a></li>
<li><a href="titleList.html">3番目のタイトル</a></li>
<li><a href="titleList.html">4番目のタイトル</a></li>
</ul>
</div>
</div><!--panel-->
<br>
*/


    // 一覧を読み込む
    $.ajax({
        url: url,
	        type: 'GET',
	        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        for (var i = 0, len1 = data.authors.length; i < len1; i++) {
            result += '<div class="panel">';
            result += '<div class="panelAuthor">' + data.authors[i].name + 'さん</div>';
            result += '<div class="panelBody">';
            if (data.authors[i].novels != undefined) {
                result += '【小説】';
                result += '<ul>';
                for (var j = 0, len2 = data.authors[i].novels.length; j < len2; j++) {
                    result += '<li><a href="storyList.html?author=' + data.authors[i].name + '&novel=' +   data.authors[i].novels[j].title + '">' + data.authors[i].novels[j].title + '</a></li>';
                }
                result += '</ul>';
            }
            if (data.authors[i].fairies != undefined) {
                result += '<hr>';
                result += '【オリフェ】';
                result += '<ul>';
                for (var j = 0, len2 = data.authors[i].fairies.length; j < len2; j++) {
                    result += '<li><a href="fairy.html?author=' + data.authors[i].name + '&fairy=' + data.authors[i].fairies[j].name + '">' + data.authors[i].fairies[j].name + '</a></li>';
                }
                result += '</ul>';
            }
            result += '</div>';
            result += '</div>';
            result += '<br>';
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(function(jqXHR, textStatus) {
		result = $(result);
        $("#novelBody").html(result);
    });
}

function getStoryList(author, novel) {
    var url = "/api/novels/view/stories/";
    var result = "";
    var insertText = "";
    var newTag = "";
    var pictureMoment = null;
    
    // 各話一覧を読み込む
    $.ajax({
        url: url+"?author="+author+"&noveltitle="+novel,
	        type: 'GET',
	        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
//        result += '<p>' + data.author.name + 'さん</p>';
        result += '<div class="panel">'
        result += '<div class="panelTitle">' + data.novel.title + '</div>';
        result += '<div class="panelHeader">もくじ</div>';
        result += '<div class="panelBody">';
        result += '<ul>';
        for (var i = 0, len1 = data.novel.stories.length; i < len1; i++) {
            result += '<li>';
            result += '<a href="novel.html?author=' + data.author.name + '&novel=' + data.novel.title + '&number=' + data.novel.stories[i].number + '">' + data.novel.stories[i].title + '</a>';
            result += '</li>';
        }
        result += '</ul>';
        result += '</div><!--panelBody-->';
        result += '</div><!--panel-->';
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(function(jqXHR, textStatus) {
		result = $(result);
        $("#novelBody").html(result);
    });    
}

function getNovelContent(author, novel, number) {
    var url = "/api/novels/view/novel/";
    var result = "";
    var back = "";
    var insertText = "";
    var newTag = "";
    var pictureMoment = null;
    
    // 小説の本文を読み込む
    $.ajax({
        url: url+"?author="+author+"&noveltitle="+novel+"&number="+number,
	        type: 'GET',
	        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        var content = data.novel.story.content.replace(/\n/g, "<br>");
        result += '<div class="panel">';
        result += '<div class="panelTitle">' + data.novel.title + '</div>';
        result += '<div class="panelHeader2">' + data.novel.story.title + '</div>';
        result += '<div class="panelBody">';
        result += '<p>' + content + '</p>';
        if (data.novel.before != undefined || data.novel.after != undefined) {
            result += '<hr>';
            result += '<p>';
            if (data.novel.before != undefined) {
                result += '（前のお話）<a href="novel.html?author=' + data.author.name + '&novel=' + data.novel.title + '&number=' + data.novel.before.number + '">' + data.novel.before.title + '</a><br>';
            }
            if (data.novel.after != undefined) {
                result += '（次のお話）<a href="novel.html?author=' + data.author.name + '&novel=' + data.novel.title + '&number=' + data.novel.after.number + '">' + data.novel.after.title + '</a><br>';
            }
            result += '</p>';
        }
        result += '</div><!--panelBody-->';
        result += '</div><!--panel-->';
                
        back = '/novel/storyList.html?author=' + data.author.name + '&novel=' +  data.novel.title;
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(function(jqXHR, textStatus) {
		result = $(result);
        $("#novelBody").html(result);
        $("#back").attr("href", back);
    });
}

function getFairyContent(author, fairy) {
    var url = "/api/novels/view/fairy/";
    var result = "";
    var insertText = "";
    var newTag = "";
    var pictureMoment = null;
    
    // 妖精の本文を読み込む
    $.ajax({
        url: url+"?author="+author+"&fairy="+fairy,
	        type: 'GET',
	        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        var content = data.fairy.content.replace(/\n/g, "<br>");
        result += '<div class="panel">';
        result += '<div class="panelTitle">' + data.fairy.name + '</div>';
        result += '<div class="panelBody">';
        result += '<p>' + content + '</p>';
        result += '</div><!--panelBody-->';
        result += '</div><!--panel-->';
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(function(jqXHR, textStatus) {
		result = $(result);
        $("#novelBody").html(result);
    });    
}


function getQueryString()
{
    var result = {};
    if( 1 < window.location.search.length )
    {
        // 最初の1文字 (?記号) を除いた文字列を取得する
        var query = window.location.search.substring( 1 );

        // クエリの区切り記号 (&) で文字列を配列に分割する
        var parameters = query.split( '&' );

        for( var i = 0; i < parameters.length; i++ )
        {
            // パラメータ名とパラメータ値に分割する
            var element = parameters[ i ].split( '=' );

            var paramName = decodeURIComponent( element[ 0 ] );
            var paramValue = decodeURIComponent( element[ 1 ] );

            // パラメータ名をキーとして連想配列に追加する
            result[ paramName ] = paramValue;
        }
    }
    return result;
}
