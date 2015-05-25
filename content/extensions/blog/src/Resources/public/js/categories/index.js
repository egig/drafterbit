(function($, drafTerbit) {

    drafTerbit.cats = {};

    drafTerbit.cats.dt =  $("#categories-data-table").dataTable({
        ajax: {
            url: drafTerbit.adminUrl+"/posts/categories/data/all",
        },
        columnDefs: [
            {orderable: false, searchable:false, targets:0, render: function(d,t,f,m) { return '<input type="checkbox" name="posts[]" value="'+d+'">'}},
            {render: function(d,t,f,m){ return '<a href="'+drafTerbit.adminUrl+'/posts/categories/edit/'+f[0]+'">'+d+'</a>'}, targets:1},
        ]
    });

    drafTerbit.replaceDTSearch(drafTerbit.cats.dt);

    $('#categories-checkall').checkAll({showIndeterminate:true});
    
    $('#categories-index-form').ajaxForm(
        function(response){
            if (response.error) {
                $.notify(response.error.message, 'error');
            }

            var urlHash2 = window.location.hash.replace('#','');
            drafTerbit.blog.dt.api().ajax.url(drafTerbit.adminUrl+"/posts/categories/data/all").load();
        }
    );

})(jQuery, drafTerbit);