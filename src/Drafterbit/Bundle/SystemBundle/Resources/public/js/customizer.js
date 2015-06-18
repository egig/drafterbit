(function($, drafTerbit) {

    var refreshPreview = function() {
        var frames = document.getElementsByTagName('IFRAME');
        frames[0].contentWindow.location.reload(true);
    }

    // delete cusomize session on window close
    $(window).on(
        'beforeunload',
        function(e){
            $.ajax(
                {
                    type: 'post',
                    async: false,
                    url:drafTerbit.adminUrl+'/setting/themes/custom-preview?csrf='+drafTerbit.csrfToken,
                    data:{endSession:1}
                }
            );
        }
    );

    // cutomizer options form
    $('.customizer-ajax-form').ajaxForm(
        {
            dataType: 'json',
            success: function(res){
                if (res.url) {
                    $('iframe').prop('src', res.url);
                    $.notify(res.message, res.status);
                }
            }
        }
    );

    // Helper function to get parameters from the query string.
    function getUrlParam(paramName)
    {
        var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i');
        var match = window.location.search.match(reParam);
     
        return (match && match.length > 1) ? match[1] : '' ;
    }

    $('iframe').contents().find('form').on('submit', function(e){
        e.preventDefault();
    });

    $('iframe').on(
        'load',
        function(e){
            var currentPreviewUrl = e.currentTarget.contentWindow.document.URL
            $('#customizer-form input[name="url"]').val(currentPreviewUrl);
        
            $(this).contents().find('a').on(
                'click',
                function(e){
                    e.preventDefault();
                    
                    if (e.currentTarget.href.indexOf(drafTerbit.baseUrl) == -1) {
                        console.log('Can\'t load external url when customizing');
                        return false;
                    }

                    $('iframe').prop('src', e.currentTarget.href+"?theme="+getUrlParam('theme')+"&_token="+drafTerbit.customThemeCsrfToken);
                }
            );
        }
    );

    // customizer sidebar controller
    $('.widget-section').click(
        function(e){
            e.preventDefault();
            $('#widget-section').show();
            $('.col-container').animate({marginLeft:"-300px"}, 300);
        }
    );

    $('.widget-section-back').click(
        function(e){
            e.preventDefault();
            $('.col-container').animate({marginLeft:"0px"}, 300);

            //collapse opened opened available widget
            if ($('body').data('expanded')) {
                var x = $('html').width();
            
                $('body').animate(
                    {marginLeft:"0px"},
                    300,
                    function(){
                        $('html').width(x-300);
                    }
                );
                $('body').data('expanded', 0);
                $('#dt-widget-availables').data('position', null);
            }

        }
    );

    //iframe container width control
    var x = $(window).width();
    var y = $('#dt-widget-availables').width();
    $('#dt-iframe-container').width(x-y-1);

    //available widget adder/toggler
    $(document).on(
        'click',
        '.dt-widget-adder',
        function() {
            var x = $('html').width();
            var position = $(this).data('position');
            if ($('body').data('expanded')) {
                $('body').animate(
                    {marginLeft:"0px"},
                    300,
                    function(){
                        $('html').width(x-300);
                    }
                );
                $('body').data('expanded', 0);
                $('#dt-widget-availables').data('position', null);
            } else {
                $('html').width(x+300);
                $('body').animate({marginLeft:"300px"}, 300);
                $('body').data('expanded', 1);
                $('#dt-widget-availables').data('position', position);
            }
        }
    );

    // widget addition
    $(document).on(
        'click',
        '.dt-widget-item',
        function(){
            var pos = $(this).closest('#dt-widget-availables').data('position');
            var id = Date.now();
            var name = $(this).data('name');
            var ui = atob($(this).data('ui'));

            var source   = $("#widget-item-template").html();
            var template = Handlebars.compile(source);
            var html    = template(
                {
                    position:pos,
                    widgetId: id,
                    widgetName: name,
                    widgetUi: ui,
                }
            );

            $('.widget-position.in > .widget-container > .widget-sortable').prepend(html);
        }
    );

    // widget edit form
    $(document).on(
        'submit',
        '.widget-edit-form',
        function(e){
            e.preventDefault();
            var theme = $(this).closest('.widget-container').find('a.dt-widget-adder').data('theme');
            var position = $(this).closest('.widget-container').find('a.dt-widget-adder').data('position');

            console.log(theme);

            $(this).ajaxSubmit(
                {
                    dataType: 'json',
                    data: {
                        theme: theme,
                        position: position,
                    },
                    success: function(res, a, b, form){
                
                        if (!res.error) {
                            $(form).find('input[name="id"]').val(res.id);
                            $(form).find('.dt-widget-remover').data('id', res.id);
                            $(form).closest('.widget-item-container').prop('id', res.id+'-widget-item-container');
                    
                            $.notify(res.message, 'success');
                    
                            refreshPreview();
                        }

                    }
                }
            );
        }
    );

    //delete widget
     $(document).on(
         'click',
         '.dt-widget-remover',
            function(e){
                e.preventDefault();
                var id = $(this).data('id');
                $.post(drafTerbit.adminUrl+'setting/widget/delete', {id:id});
                $(this).closest('.panel').remove();
                refreshPreview();
            }
     );

     // sort widgets
     $('.widget-sortable').sortable(
         {
            update: function(e, ui) {

                var parent = ui.item.parent();

                var ids = parent.sortable('toArray');

                var orders = ids.join(',');

                $.ajax(
                    {
                        url: drafTerbit.adminUrl+"setting/widget/sort",
                        global: false,
                        type: "POST",
                        async: false,
                        dataType: "html",
                        data: "order="+orders,
                        success: function(html){
                            refreshPreview();
                        }
                    }
                );
            }
         }
     );

    // color picker
    $('.dt-color-picker').colorpicker();
    $('.dt-image-add').on('click', function(e){
        e.preventDefault();
        var fallback = $(this).data('fallback');
        window.open(drafTerbit.adminUrl+'file/browser?DTCustomizer=1&fallback='+fallback, '_blank', "height=400,width=800");
    });
    $('.dt-image-remove').on('click', function(e){
        var fallback = $(this).data('fallback');
        $('#'+fallback).attr('src', '');
        $('#input-'+fallback).val('');
    });

})(jQuery,drafTerbit);