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
                        url: drafTerbit.adminUrl+"/system/dashboard/sort",
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

})(jQuery);