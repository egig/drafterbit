"use strict";

(function ($, drafTerbit) {

    drafTerbit.cats = {};

    drafTerbit.cats.dt = $("#category-data-table").dataTable({
        ajax: {
            url: drafTerbit.deskUrl + "blog/category/data"
        },
        columns: [{ data: 'id', orderable: false, searchable: false, render: function render(d, t, f, m) {
                return '<input type="checkbox" name="categories[]" value="' + d + '">';
            } }, { data: 'label', render: function render(d, t, f, m) {
                return '<a href="' + drafTerbit.deskUrl + 'blog/category/edit/' + f.id + '">' + d + '</a>';
            } }, { data: 'description' }]
    });

    drafTerbit.replaceDTSearch(drafTerbit.cats.dt);

    $('#category-checkall').checkAll({ showIndeterminate: true });

    $('#category-index-form').ajaxForm({
        success: function success(response) {

            $.notify(response.message, response.status);
            drafTerbit.cats.dt.api().ajax.reload();
        }
    });
})(jQuery, drafTerbit);