$(function(){


    var Screen = (function(){

        var SCREEN_SM = 768;
        var SCREEN_MD = 992;
        var SCREEN_LG = 1200;

        return {
            getInnerWidth: function(){
                return $(window).innerWidth();
            },

            isExtraSmall: function() {
                return this.getInnerWidth() < SCREEN_SM;
            },

            isSmall: function() {
                var width = this.getInnerWidth();
                return (width >= SCREEN_SM) && (width < SCREEN_MD);
            },

            isMiddle: function() {
                var width = this.getInnerWidth();
                return (width >= SCREEN_MD) && (width < SCREEN_LG);
            },

            isLarge: function(){
                return this.getInnerWidth() >= SCREEN_LG;
            },

            isTabletOrPhone: function() {
                return this.isExtraSmall() || this.isSmall();
            },

            isDesktop: function() {
                return this.isMiddle() || this.isLarge();
            }
        }

    })();


    var layoutHandler = {

        handleFooter: function(){
            var h = $('.dt-main').height();
            var hW = $(window).innerHeight();
            var wW = $(window).innerWidth();

            if(h+30 < hW && wW >= 746) {
                $('.dt-footer').addClass('navbar-fixed-bottom');
            }
        },

        handleStickyToolbar: function(){

            $('#dt-main-menu').stick_in_parent({offset_top:0});

            // @todo decouple toolbar selector
            var stickyToolbar = $('#sticky-toolbar');
            if(Screen.isDesktop()) {
                if(stickyToolbar && typeof $.fn.stick_in_parent != 'undefined') {
                    stickyToolbar.stick_in_parent({offset_top:50});
                }
                $('#dt-main-menu').removeClass('navbar-fixed-top');
            } else {
                $('#dt-main-menu').addClass('navbar-fixed-top');
                stickyToolbar.trigger("sticky_kit:detach");
            }
        },

        handleNavbar: function() {

            //mobile
            $('.navbar-toggle').click(
                function(){

                    leftOffset = $('.dt-off-canvas').css('left');
                    if (leftOffset === '0px') {
                        $('.dt-off-canvas').animate({left:-200}, 300);
                        $('.dt-main, .dt-footer').animate({left:0}, 300);
                    } else {
                        $('.dt-off-canvas').animate({left:0}, 300);
                        $('.dt-main, .dt-footer').animate({left:200}, 300);
                    }
                }
            )
        }
    }

    layoutHandler.handleNavbar();
    layoutHandler.handleStickyToolbar();
    layoutHandler.handleFooter();

    $(window).resize(function(){
        layoutHandler.handleStickyToolbar();
    });

});
