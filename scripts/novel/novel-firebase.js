// 初期起動時の呼び出し
function getList() {
    const URL = 'https://asia-northeast1-murumoya-api.cloudfunctions.net/novels';
    let result = '';

    // 一覧を読み込む
    $.ajax({
        url: URL + '?authors',
        type: 'GET',
        dataType: 'json'
    })
    .done(data => {
        data.map(author => {
            result += '<div class="panel">';
            result += '<div class="panelAuthor">' + author.name + 'さん</div>';
            result += '<div class="panelBody">';
            if (author.novels != undefined) {
                result += '【小説】';
                result += '<ul>';
                author.novels.map(novel => {
                    result += '<li><a href="storyList.html?author=' + author.id + '&novel=' +   novel.id + '">' + novel.title + '</a></li>';
                });
                result += '</ul>';
            }
            if (author.fairies != undefined) {
                result += '<hr>';
                result += '【オリフェ】';
                result += '<ul>';
                author.fairies.map(fairy => {
                    result += '<li><a href="fairy.html?author=' + author.id + '&fairy=' + fairy.id + '">' + fairy.name + '</a></li>';
                });
                result += '</ul>';
            }
            result += '</div>';
            result += '</div>';
            result += '<br>';
        });
    })
    .fail(() => {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(() => {
        result = $(result);
        $("#novelBody").html(result);
    });
}

function getStoryList(authorID, novelID) {
    const URL = 'https://asia-northeast1-murumoya-api.cloudfunctions.net/novels';
    let result = '';

    // 各話一覧を読み込む
    $.ajax({
        url: URL + '?stories&authorID=' + authorID + '&novelID=' + novelID,
        type: 'GET',
        dataType: 'json'
    })
    .done(novel => {
        result += '<div class="panel">'
        result += '<div class="panelTitle">' + novel.title + '</div>';
        result += '<div class="panelHeader">もくじ</div>';
        result += '<div class="panelBody">';
        result += '<ul>';
        novel.stories.map(story => {
            result += '<li>';
            result += '<a href="novel.html?author=' + authorID + '&novel=' + novelID + '&number=' + story.number + '">' + story.title + '</a>';
            result += '</li>';

        });
        result += '</ul>';
        result += '</div><!--panelBody-->';
        result += '</div><!--panel-->';
    })
    .fail(() => {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(() => {
        result = $(result);
        $('#novelBody').html(result);
    });
}

function getNovelContent(authorID, novelID, number) {
    const URL = 'https://asia-northeast1-murumoya-api.cloudfunctions.net/novels';
    let result = '';
    var back = "";

    // 小説の本文を読み込む
    $.ajax({
        url: URL + '?story&authorID=' + authorID + '&novelID=' + novelID + '&number=' + number,
        type: 'GET',
        dataType: 'json'
    })
    .done(story => {
        const content = story.content.replace(/\n/g, '<br>');
        result += '<div class="panel">';
        result += '<div class="panelTitle">' + story.novel + '</div>';
        result += '<div class="panelHeader2">' + story.title + '</div>';
        result += '<div class="panelBody">';
        result += '<p>' + content + '</p>';
        if (story.beforeNumber != undefined || story.afterNumber != undefined) {
            result += '<hr>';
            result += '<p>';
            if (story.beforeNumber != undefined) {
                result += '（前のお話）<a href="novel.html?author=' + authorID + '&novel=' + novelID + '&number=' + story.beforeNumber + '">' + story.beforeTitle + '</a><br>';
            }
            if (story.afterNumber != undefined) {
                result += '（次のお話）<a href="novel.html?author=' + authorID + '&novel=' + novelID + '&number=' + story.afterNumber + '">' + story.afterTitle + '</a><br>';
            }
            result += '</p>';
        }
        result += '</div><!--panelBody-->';
        result += '</div><!--panel-->';

        back = '/novel/storyList.html?author=' + authorID + '&novel=' +  novelID;

    })
    .fail(() => {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(() => {
        result = $(result);
        $('#novelBody').html(result);
        $('#back').attr('href', back);
    });
}

function getFairyContent(authorID, fairyID) {
    const URL = 'https://asia-northeast1-murumoya-api.cloudfunctions.net/novels';
    let result = '';

    // 妖精の本文を読み込む
    $.ajax({
        url: URL + '?fairy&authorID=' + authorID + '&fairyID=' + fairyID,
        type: 'GET',
        dataType: 'json'
    })
    .done(fairy => {
        const content = fairy.content.replace(/\n/g, '<br>');
        result += '<div class="panel">';
        result += '<div class="panelTitle">' + fairy.name + '</div>';
        result += '<div class="panelBody">';
        result += '<p>' + content + '</p>';
        result += '</div><!--panelBody-->';
        result += '</div><!--panel-->';
    })
    .fail(() => {
        result = '　小説の読み込みに失敗しました。';
    })
    .always(() => {
        result = $(result);
        $('#novelBody').html(result);
    });
}

function getQueryString()
{
    let result = {};
    
    if (1 < window.location.search.length) {
        
        // 最初の1文字 (?記号) を除いた文字列を取得する
        const query = window.location.search.substring(1);

        // クエリの区切り記号 (&) で文字列を配列に分割する
        query.split('&').map(parameter => {
            // パラメータ名とパラメータ値に分割する
            const element = parameter.split('=');

            const paramName = decodeURIComponent(element[0]);
            const paramValue = decodeURIComponent(element[1]);

            // パラメータ名をキーとして連想配列に追加する
            result[paramName] = paramValue;
        });
    }
    return result;
}
