$(function(){

    var alertScreenSize = function()
    {
        var wW = $(window).innerWidth();
        if(wW <= 800) {
            $("#sticky-toolbar").trigger("sticky_kit:detach");
        }
    }

    var layoutHandler = {

        handleScreenSize: function(){
            alertScreenSize();

            $(window).resize(function(){
                alertScreenSize();
            });
        },

        handleFooter: function(){    
            var h = $('.page-wrapper').height();
            var hW = $(window).innerHeight();
            var wW = $(window).innerWidth();

            if(h+30 < hW && wW >= 746) {
                $('.footer').addClass('navbar-fixed-bottom');
            }
        },

        handleStickyToolbar: function(){
            // stick sticky-toolbar
            var wW = $(window).innerWidth();
            if(wW >= 800) {
                if($('#sticky-toolbar') && typeof $.fn.stick_in_parent != 'undefined') {
                    $('#sticky-toolbar').stick_in_parent({offset_top:50});
                }
            }
        },

        handleNavbar: function() {

            //mobile
            $('.navbar-toggle').click(
                function(){

                    leftOffset = $('.dt-off-canvas').css('left');
                    if (leftOffset === '0px') {
                        $('.dt-off-canvas').animate({left:-200}, 300);
                        $('.page-wrapper').animate({left:0}, 300);
                    } else {
                        $('.dt-off-canvas').animate({left:0}, 300);
                        $('.page-wrapper').animate({left:200}, 300);
                    }
                }
            )
        }
    }

    layoutHandler.handleScreenSize();
    layoutHandler.handleNavbar();
    layoutHandler.handleStickyToolbar();
    layoutHandler.handleFooter();

});