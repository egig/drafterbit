$(function(){


    var Screen = (function(){

        var SCREEN_SM = 720;
        var SCREEN_MD = 940;
        var SCREEN_LG = 1140;

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
            var h = $('body').height();
            var hW = $(window).height();
            var wW = $(window).innerWidth();

            if(h+30 < hW && wW >= 746) {
                $('.dt-footer').addClass('navbar-fixed-bottom');
            }
        },

        handleStickyToolbar: function(){

            var mainMenu = $('#dt-main-menu');
            var stickyToolbar = $('#sticky-toolbar');

            mainMenu.stick_in_parent({offset_top:0});

            if(Screen.isDesktop()) {
                if(stickyToolbar && typeof $.fn.stick_in_parent != 'undefined') {
                    stickyToolbar.stick_in_parent({offset_top:50});
                }
            } else {
                stickyToolbar.trigger("sticky_kit:detach");
            }
        },

        handleNavbar: function() {

            //mobile
            $('.navbar-toggle').click(
                function(){

                    leftOffset = $('.dt-off-canvas').css('right');
                    if (leftOffset === '0px') {
                        $('.dt-off-canvas').animate({right:-240}, 300);
                        $('body').animate({right:0}, 300);
                    } else {
                        $('.dt-off-canvas').animate({right:0}, 300);
                        $('body').animate({right:240}, 300);
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
