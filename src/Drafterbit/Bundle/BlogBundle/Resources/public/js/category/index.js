(function($, drafTerbit) {

    drafTerbit.cats = {};

    drafTerbit.cats.dt =  $("#category-data-table").dataTable({
        ajax: {
            url: drafTerbit.adminUrl+"blog/category/data/all",
        },
        columnDefs: [
            {orderable: false, searchable:false, targets:0, render: function(d,t,f,m) { return '<input type="checkbox" name="posts[]" value="'+d+'">'}},
            {render: function(d,t,f,m){ return '<a href="'+drafTerbit.adminUrl+'blog/category/edit/'+f[0]+'">'+d+'</a>'}, targets:1},
        ]
    });

    drafTerbit.replaceDTSearch(drafTerbit.cats.dt);

    $('#category-checkall').checkAll({showIndeterminate:true});
    
    $('#category-index-form').ajaxForm(
        function(response){
            if (response.error) {
                $.notify(response.error.message, 'error');
            }

            var urlHash2 = window.location.hash.replace('#','');
            drafTerbit.cats.dt.api().ajax.url(drafTerbit.adminUrl+"blog/category/data/all").load();
        }
    );

})(jQuery, drafTerbit);