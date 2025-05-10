function initMuruTweet() {
    let insertText = "";
    $.ajaxSetup({ cache: false });
    $.getJSON("/murutweet/NEW.json", data => {})
    .success(data => {
        insertText += '<div id="twpanel">';
        insertText += '<p id="twheader"><img src="/murutweet/images/murutweetL.png" width="150" height="30"></p>';
        insertText += '<div class="twpicture">';
        insertText += '<a href="' + data.url + '" target="_blank">';
        insertText += '<img src="/murutweet/images/' + data.image_filename + '" style="width: 100%;">';
        insertText += '</a>';
        insertText += '<p id="twtext"></p>';
        insertText += '</div>';
        insertText += '</div>';
    })
    .complete(() => {
        $('#muruTweet').html(insertText).load();
        $("#twtext").load("/murutweet/NEW.txt");
    });
}
