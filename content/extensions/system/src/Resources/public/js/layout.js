$(function(){

    var h = $('.page-wrapper').height();
    var hW = $(window).innerHeight();

    if(h+30 < hW) {
        $('.footer').addClass('navbar-fixed-bottom');
    }

    //mobile
    $('.navbar-toggle').click(
        function(){

            leftOffset = $('.dt-off-canvas').css('left');
            if (leftOffset === '0px') {
                $('.dt-off-canvas').animate({left:-200}, 300);
            } else {
                $('.dt-off-canvas').animate({left:0}, 300);
            }
        }
    )

    // stick sticky-toolbar
    if($('#sticky-toolbar') && typeof $.fn.stick_in_parent != 'undefined') {
        $('#sticky-toolbar').stick_in_parent({offset_top:30});
    }
});