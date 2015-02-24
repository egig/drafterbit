$(
    function(){

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

        // sticky-sticky-toolbar
        if (document.getElementById('sticky-toolbar')) {
            tlOff = $('#sticky-toolbar').offset().top - 30;
            $(window).on(
                'scroll',
                function(e){
                    //console.log();
                    var wSc = $(this).scrollTop();

                    if (wSc > (tlOff)) {
                        if (!$('#sticky-toolbar').data('replaced')) {
                            var el = $('<div>',{id:'sticky-toolbar-replacer'})
                            .height($('#sticky-toolbar').height());
                            $('#sticky-toolbar').after(el);
                            $('#sticky-toolbar').data('replaced', true);
                        }
            
                        $('#sticky-toolbar').css(
                            {
                                'position': 'fixed',
                                'top': 30,
                                'right': 0,
                                'left': 0,
                                'background': '#fff',
                                'box-shadow': '1px 1px 5px #e5e5e5',
                                'z-index': 1000
                            }
                        )
                    } else if (wSc < (tlOff)) {
                        $('#sticky-toolbar').removeAttr('style');
                        $('#sticky-toolbar').siblings('#sticky-toolbar-replacer').remove();
                        $('#sticky-toolbar').data('replaced', false);

                    }

                }
            );
        }

    }
);