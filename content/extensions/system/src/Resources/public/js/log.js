(function($, drafTerbit) {
    
    var dt = $("#log-data-table").dataTable(
        {
            ajax: {
                url: drafTerbit.adminUrl+'/system/log-data.json'
            },
            columnDefs: [
                {orderable: false, searchabl:false, targets:0, render: function(d,t,f,m) { return '<input type="checkbox" name="log[]" value="'+d+'">' } }
            ]
        }
    );

    drafTerbit.replaceDTSearch(dt);

    $('#log-checkall').checkAll({showIndeterminate:true});
    
})(jQuery,drafTerbit);