(function($){
     // sort widgets
     $('#panel-row-left, #panel-row-right').sortable(
         {
            items: "div.panel-item:not(.placeholder)",
            connectWith:'.panel-row',
            placeholder: 'placeholder',
            forcePlaceholderSize: true,
            update: function(e, ui) {
                    
                //var parent = ui.item.parent();
                var pos = $(e.target).data('pos');

                var ids = $(e.target).sortable('toArray');

                var orders = ids.join(',');

                $.ajax(
                    {
                        url: drafTerbit.adminUrl+"system/dashboard/sort",
                        global: false,
                        type: "POST",
                        async: false,
                        dataType: "html",
                        data: {
                            order:orders,
                            pos: pos
                        },
                        success: function(html){}
                    }
                );
            }
         }
     );

    $('.panel-manager-toggle').on('click', function(e){
        e.preventDefault();
        $('.panel-manager').slideToggle(100)
    });

    $('.panel-toggler').change(function(e){
        var panel = $(e.target).data('panel');

        $('#dashboard-panel-'+panel).toggle();

        $.ajax({
            type: 'POST',
            data: {panel:panel},
            url: drafTerbit.adminUrl+'system/dashboard/toggle_panel'
        });
    });

})(jQuery);