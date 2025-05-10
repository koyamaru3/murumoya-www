////////////////////////////////////////////////////
//
//　SlideMove
//
////////////////////////////////////////////////////
$(function(){
	$('#container:not(body#index #container)').css({display:'block',marginLeft:$(window).width(),opacity:'0'});
	$('#container:not(body#index #container)').animate({marginLeft:'0px',opacity:'1'},500);

	$('body#index #container').css({display:'block',opacity:'0'});
	$('body#index #container').animate({opacity:'1'},500);

	$('a').click(function(){
		var pass = $(this).attr("href");
		$('#container').animate({marginLeft:'-=' + $(window).width() + 'px',opacity:'0'},500,function(){
			location.href = pass;
			setTimeout(function(){
				$('#container').css({marginLeft:'0',opacity:'1'})
			},1000);
		});
	    return false;
	});
});
