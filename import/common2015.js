$(function() {
    // プリロード付きロールオーバーの画像置換処理
    var supfix = "_on";
    $("img.rollover").hover(
        function(){
            $(this).attr("src",$(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1"+supfix+"$2"));
        },
        function(){
            $(this).attr("src",$(this).attr("src").replace(/^(.+)_on(\.[a-z]+)$/, "$1$2"));
        }
    ).each(
        function(){//preload
            $("<img>").attr("src",$(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1"+supfix+"$2"));
        }
    );
});
