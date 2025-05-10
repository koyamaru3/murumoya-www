/* global Spinner, moment */

const voteUrl = "https://asia-northeast1-murumoya-api.cloudfunctions.net/votes/";
let themeID = -1;
let voteMode=0; // 0:投票モード 1:閲覧モード


// テキストボックスのエンター押下での送信を無効にする
$(document).on("keypress", "input:not(.allow_submit)", (event) => {
    return event.which !== 13;
});

// 初期起動時の呼び出し
function initVote(_id, _mode = 0) {

    // グローバル変数として保持する
    themeID = _id;
    voteMode = _mode;

    $('#vote').html('<h1>　</h1>\
<div id="voteTerm"></div>\
<div id="votePanel"></div>');

    drawVotePanel();

}

// 投票画面を描画する
function drawVotePanel() {

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
        className: 'voteSpinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    let spinner = new Spinner(opts).spin(document.getElementById('votePanel'));
    $('#votePanel').data('spinner', spinner);

    // 投票を読み込む
    $.ajax({
        url: voteUrl + '?themeID=' + themeID,
        type: 'GET',
        dataType: 'json'
    })
        .done(theme => {
        const starttime = moment(theme.starttime, 'YYYY-MM-DD HH:mm:ss');
        const endtime = moment(theme.starttime, 'YYYY-MM-DD HH:mm:ss').add(theme.term, 'days');
        $('#vote h1').html(theme.title);
        $('#voteTerm').html("[投票期間] " + starttime.format('YYYY/MM/DD') + ' ～ ' + endtime.format('YYYY/MM/DD'));

        if (voteMode === 1) $("#votePanel").hide();

        let supplement = theme.supplement != undefined ? theme.supplement : '';
        let isOpenVote = true;
        if (starttime > moment()) {
            isOpenVote = false;
            supplement = '投票はまだ始まっていないでしゅ。';
        }
        else if (endtime < moment()) {
            isOpenVote = false;
            supplement = '投票はもう終了しているでしゅ。';
        }

        // 選択肢をラジオボタン付きで描画する
        let insertVoteText = '<form><ol>';
        theme.choices.map((choice, index) => {
            insertVoteText += '<li>';
            insertVoteText += '<input type="radio" name="voteItem" value="' + (index + 1) +'"';
            insertVoteText += index == 0 ? ' checked>' : '>';
            insertVoteText += choice.name + '</li>';
        });

        insertVoteText += '</ol>';
        insertVoteText += '<div id="notice">' + supplement + '</div>';
        if (isOpenVote) {
            insertVoteText += theme.commenttype == 1 ? '<div>コメント（必須）<br>' : '<div>コメント（任意）<br>';
            insertVoteText += '<input type="text" name="comment" size="10" maxlength="100"></div>';
        }
        insertVoteText += '<div id="voteButtonArea">';
        insertVoteText += isOpenVote ? '<input type="button" id="voteButton" class="css3button" value="投票する">　' : '';　
        insertVoteText += '<input type="button" id="voteResultButton" class="css3button" value="見る">';
        insertVoteText += '</div>';
        insertVoteText += '</form>';
        insertVoteText = $(insertVoteText);
        $('#votePanel').html(insertVoteText);

        if ($('#container') != null) {
            insertVoteText.ready(() => {
                if (typeof $('#container').isotope == "function") $('#container').isotope('layout');
            });
        }

        $('#votePanel').css('height', $('#votePanel').innerHeight() + 'px');

        // 投票するボタンを押した場合
        $('#voteButton').click(() => {
            $('#voteButton').attr('disabled', true);
            const choice = $(':radio[name="voteItem"]:checked').val();
            let comment = $(':text[name="comment"]').val();
            comment = htmlentities(comment);

            // 投票を行う
            execVote(theme, choice, comment);
        });

        // 見るボタンを押した場合
        $('#voteResultButton').click(() => {
            $('#voteResultButton').attr('disabled', true);
            drawResultPanel(theme);
        });
        if (voteMode === 1) {
            drawResultPanel(theme);
        }
    })
        .fail(() => drawErrorPanel('アクセスエラーが発生しました。'));
}

// 投票結果画面を描画する
function execVote(theme, choice, comment) {
    var jsonData = {
        theme: themeID,
        choice: choice,
        comment: comment
    };
    $.ajax({
        url: voteUrl,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({ vote: jsonData }),
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
    })
        .done(() => {
        // 投票を再取得する
        $.ajax({
            url: voteUrl + '?themeID=' + themeID,
            type: 'GET',
            dataType: 'json'
        })
            .done(theme => drawResultPanel(theme))
            .fail(() => drawErrorPanel('アクセスエラーが発生しました。'));
    })
        .fail(jqXHR => {
        var data = JSON.parse(jqXHR.responseText);
        drawErrorPanel(data.result);
    });
}

// 投票結果画面を描画する
function drawResultPanel(theme) {
    // 各項目の票数の棒グラフを表示する
    let insertText = '<ol>';
    const total = theme.choices.reduce((prev, choice) => prev + choice.count, 0);
    theme.choices.map((choice, index) => {
        const percent = total == 0 ? 0 : Math.floor((choice.count / total) * 100);
        insertText += '<li><span class="voteSubTitle">■' + choice.name+ '</span>';
        insertText += '<div class="graph"><span class="bar' + (index % 6 + 1)
            +'" style="width: ' + percent + '%;">'
            + choice.count
            + '/' + percent + '%</span></div></li>';
    });
    insertText += '</ol>';

    // ボタン類を表示する
    insertText += '<div id="voteButtonArea">';
    insertText += '<input type="button" id="voteCommentButton" class="css3button" value="コメントを見る">　';
    insertText += voteMode == 0 ? '<input type="button" id="voteBackButton" class="css3button" value="戻る">' : '';
    insertText += '</div>';
    $('#votePanel').html(insertText);
    $('#votePanel').show();

    // コメントを見るボタンを押した場合
    $('#voteCommentButton').click(() => {
        $('#voteCommentButton').attr('disabled', true);
        drawCommentPanel(theme);
    });

    // 戻るボタンを押した場合
    $('#voteBackButton').click(function() {
        $('#voteBackButton').attr('disabled', true);
        drawVotePanel();
    });
}

// コメント表示画面を描画する
function drawCommentPanel(theme) {

    // コメン トを読み込む
    $.ajax({
        url: voteUrl + '?themeID=' + theme.id + '&withComments',
        type: 'GET',
        dataType: 'json'
    })
        .done(data => {
        let insertText = '<ol>';

        data.choices.map(choice => {
            insertText += '<li><span class="voteSubTitle">■' + choice.name + '</span>';
            insertText += '<ul>';

            choice.comments != undefined && choice.comments.map(comment => {
                const date = moment(comment.date, "YYYY-MM-DD HH:mm:ss");
                insertText += '<li>' + comment.comment;
                insertText += date.add(24, "hours").isAfter(moment()) ? '<img src="images/a_new.gif">' : '';
                insertText += '</li>'
            });
            insertText += '</ul></li>';
        });

        insertText += '</ol>';
        insertText += '<div id="voteButtonArea">';
        insertText += '<input type="button" id="voteBackButton" class="css3button" value="戻る">';
        insertText += '</div>';
        $('#votePanel').html(insertText);

        // 戻るボタンを押した場合
        $('#voteBackButton').click(() => {
            $('#voteBackButton').attr('disabled', true);
            drawResultPanel(theme);
        });
    })
        .fail(() => drawErrorPanel('アクセスエラーが発生しました。'));
}

function drawErrorPanel(message, isBack) {
    if (message == '') {
        message = '読み込みエラーが発生しました。';
    }
    let insertText = '<p>　</p>';
    insertText += '<p>＜エラー＞</p>';
    insertText += '<p>' + message + '</p>';
    insertText += '<p>　</p>';
    if (isBack != true) {
        insertText += '<div id="voteButtonArea">';
        insertText += '<input type="button" id="voteBackButton" class="css3button" value="戻る">';
        insertText += '</div>';
    }
    $('#votePanel').html(insertText);

    // 戻るボタンを押した場合
    $('#voteBackButton').click(() => {
        $('#voteBackButton').attr('disabled', true);
        drawVotePanel();
    });
}

function htmlentities(str) {
    return str.replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
