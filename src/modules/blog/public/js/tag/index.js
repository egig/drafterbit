(function($, drafTerbit) {

    drafTerbit.cats = {};

    drafTerbit.cats.dt =  $("#tag-data-table").dataTable({
        ajax: {
            url: drafTerbit.deskUrl+"blog/tag/data",
        },
        columns: [
          {data:'id',orderable: false, searchable:false, render: function(d,t,f,m) { return '<input type="checkbox" name="tags[]" value="'+d+'">'}},
          {data:'label', render: function(d,t,f,m){ return '<a href="'+drafTerbit.deskUrl+'blog/tag/edit/'+f.id+'">'+d+'</a>'} },
          {data:'description'}
        ]
    });

    drafTerbit.replaceDTSearch(drafTerbit.cats.dt);

    $('#tag-checkall').checkAll({showIndeterminate:true});

    $('#tag-index-form').ajaxForm({
        success: function(response){

           $.notify(response.message, response.status);
            drafTerbit.cats.dt.api().ajax.reload();
        }
    });

})(jQuery, drafTerbit);
