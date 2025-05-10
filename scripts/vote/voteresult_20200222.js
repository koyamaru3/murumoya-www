// 初期起動時の呼び出し
function initVoteResult() {
    var url = "/api/votes/";
    var result = "";
    var num = 5;
    var insertText = "";
    var beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    insertText += '<div id="voteResultHeader"></div>';
    insertText += '<div id="voteResultBody"></div>';
    insertText += '<div id="voteResultFooter"><p><a href="/vote/backnumber.html">もっと見る</a></p></div>';
    $("#voteResult").html(insertText);

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
        className: 'voteResultSpinner', // The CSS class to assign to the spinner
        zIndex: 2e6, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
	
    var target = document.getElementById('voteResultBody');
    var voteResultspinner = new Spinner(opts).spin(target);
    $(target).data('voteResultSpinner', voteResultspinner);	
    
    // 絵を読み込む
    $.ajax({
        url: url+"?item="+num,
	        type: 'GET',
	        dataType: "json"
    })
    .done(function(data, textStatus, jqXHR) {
        result += '<ul>';
        for (var i = 0; i < num; i++) {
            result += '<li><a href="'
                + '/vote/result' + data.votes[i].id + '.html'
                + '">'
                + data.votes[i].title;

            if (data.votes[i].date != null) {
                result += '　<strong>★集計済み</strong>'
            }
            voteResultMoment = moment(data.votes[i].date, "YYYY-MM-DD");
            if (voteResultMoment.isAfter(beforeMoment)) {
                newTag = '<img src="/images/a_new.gif"><br>';
            } else {
                newTag = '';
            }
            result += newTag + '</a></li>';
        }
        result += '</ul>';
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        result = '　投票結果の読み込みに失敗しました。';
    })
    .always(function(jqXHR, textStatus) {
        $("#voteResultBody").html(result);
    });
}
