$(function(){

    var alertScreenSize = function()
    {
        $('#screen-size-trapper').remove();
        var wW = $(window).innerWidth();
        if(wW <= 800) {
            $('body').append('<div id="screen-size-trapper" style="z-index:1050;background:white;position:fixed; top:0;bottom:0;left:0;right:0">Screen size not supported yet, sorry</div>');
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

            if(h+30 < hW) {
                $('.footer').addClass('navbar-fixed-bottom');
            }
        },

        handleStickyToolbar: function(){
            // stick sticky-toolbar
            if($('#sticky-toolbar') && typeof $.fn.stick_in_parent != 'undefined') {
                $('#sticky-toolbar').stick_in_parent({offset_top:50});
            }
        },

        handleNavbar: function() {

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
        }
    }

    layoutHandler.handleScreenSize();
    layoutHandler.handleNavbar();
    layoutHandler.handleStickyToolbar();
    layoutHandler.handleFooter();

});