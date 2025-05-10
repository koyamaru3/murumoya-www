/* global Spinner */

const URL = 'https://asia-northeast1-murumoya-api.cloudfunctions.net/articles';
const ITEMS = 10;		// 1回に読み込むレコード数
let lastArticle = '2999-99-99';
let page = 0;
let records = 0;		// 合計レコード数
let tagList = [];

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
function initArticle() {
    let result = "";

    // レコード数を取得する
    $.ajax({
        url: URL + '?count',
        type: 'GET',
        dataType: 'json'
    })
    .done(data => {
        records = data.count;
        loadArticle();
    })
    .fail(() => {
        result = "レコード数の読み込みに失敗しました。";
        $("#articleBody").html(result);
    })

    // タグ一覧を取得する
    $.ajax({
        url: URL + '?tagList',
        type: 'GET',
        dataType: 'json'
    })
    .done(tags => {
        tagList = tags;
        result = '<div class="select-wrapper"><select id="tagList">';
        result += '<option value="all">すべて表示</option>'
        tagList.map(tag => result += '<option value="' + tag.tag + '">' + tag.tag + '</option>');
        result += '</select></div>';
    })
    .fail(() => {
        result = "レコード数の読み込みに失敗しました。";
    })
    .always(() => {
        $("#articleHeader").html(result);
        $("#tagList").change(() => {
            const tag = $('option:selected').val();
            $("#articleBody").empty();
            lastArticle = '2999-99-99';
            console.log(tag);
            if (tag == 'all') {
                loadArticle();
            } else {
                loadArticleWithTag(tag);
            }
        });
    });
}

function loadArticle() {
    let result = "";

    const spinner = new Spinner(opts).spin(document.getElementById('article'));
    $('#article').data('spinner', spinner);

    // 記事を読み込む
    $.ajax({
        url: URL,
        data: {
            num: 10,
            endBefore: lastArticle
        },
        type: 'GET',
        dataType: 'json'
    })
    .done(articles => {
        articles.map(article => {
            result += makeArticleText(article);

            // 最後に表示した記事の日付を覚えておく
            lastArticle = article.date;
        });

        // 続きのレコードがあれば「続きを表示する」ボタンを表示する
        if (++page*ITEMS < records) {
            result += '<div class="nextButton">続きを表示する</div>';
        } else {
            result += '<br>';
        }
    })
    .fail(() => {
        result = "記事の読み込みに失敗しました。";
    })
    .always(() => {
        spinner.stop();
        $("#articleBody").append(result);
        $(".nextButton").bind("click", () => {
            $(".nextButton").unbind();
            $(".nextButton").remove();
            loadArticle();
        });
        $(".tag").bind("click", (obj) => {
            $("#articleBody").empty();
            lastArticle = '2999-99-99';
            loadArticleWithTag(obj.currentTarget.innerText);
        });
    });
}

function loadArticleWithTag(tag) {
    let result = "";

    const spinner = new Spinner(opts).spin(document.getElementById('article'));
    $('#article').data('spinner', spinner);

    // 記事を読み込む
    $.ajax({
        url: URL,
        data: {
            tags: tag,
        },
        type: 'GET',
        dataType: 'json'
    })
    .done(articles => {
        if (articles.length > 0) {
            articles.map(article => result += makeArticleText(article));
            result += '<br>'
            $("#tagList").val(tag);
        } else {
            result = "記事の読み込みに失敗しました。";
        }
    })
    .fail(() => {
        result = "記事の読み込みに失敗しました。";
    })
    .always(() => {
        spinner.stop();
        $("#articleBody").append(result);
        $(".tag").bind("click", (obj) => {
            $("#articleBody").empty();
            lastArticle = '2999-99-99';
            loadArticleWithTag(obj.currentTarget.innerText);
        });
    });
}

function makeArticleText(article) {
    let result = "";
    const pageUrl = "/etc/";
    const beforeMoment = moment().subtract(5, "days"); // 今日から5日以内ならnew

    // 記事に含まれるタグを抽出
    const tags = article.tags.split(" ");
    let tagStr = ""
    tags.map(tag => {
        tagStr += '<span class="tag">' + tag + '</span>';
    });

    result += '<p class="'
        + article.direction
        + '"><a href="'
        + pageUrl + article.page
        + '" title="'
        + article.title
        + '">'
        + '<img src="' + pageUrl + 'images/s/'
        + article.thumbnail
        + '" title="'
        + article.title
        + '"></a>'
        + '</p>';
    result += '<p class="content">';
    const articleMoment = moment(article.date, "YYYY-MM-DD");
    const newTag = articleMoment.isAfter(beforeMoment) ? '<img src="/images/a_new.gif"><br>' : '';
    result += newTag;
    result += '<a href="'
        + pageUrl + article.page
        + '" title="'
        + article.title
        + '">'
        + article.title
        + '</a><br>'
        + tagStr
        + '</p><hr>';

    return result;
}