function initMuruTweet() {
    let insertText = '';
    let imageFile = '';

    $.ajaxSetup({ cache: false });
    $.getJSON("https://storage.googleapis.com/murutweet/NEW.json", data => {})
    .success(data => {
        imageFile = data.imageFile;
        insertText += '<div id="twpanel">';
        insertText += '<p id="twheader"><img src="/murutweet/images/murutweetL.png" width="150" height="30"></p>';
        insertText += '<div class="twpicture">';
        insertText += '<a href="' + data.tweetUrl + '" target="_blank">';
        insertText += '<img id="twimg" style="width: 100%;">';
        insertText += '</a>';
        insertText += '<p id="twtext">' + data.tweet +'</p>';
        insertText += '</div>';
        insertText += '</div>';
    })
    .complete(() => {
        $('#muruTweet').html(insertText).load();
        $('#twimg').attr('src', 'https://storage.googleapis.com/murutweet/images/' + imageFile);
    });
}
