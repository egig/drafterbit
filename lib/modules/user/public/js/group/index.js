"use strict";

(function ($, drafTerbit) {

    drafTerbit.group = function () {

        return {
            handleIndexTable: function handleIndexTable(token) {
                drafTerbit.group.dt = $("#group-data-table").dataTable({
                    serverSide: true,
                    responsive: true,
                    ajax: {
                        url: drafTerbit.deskUrl + "user/group/data?token=" + token
                    },
                    columns: [{ data: 'id', orderable: false, searchable: false, render: function render(d, t, f, m) {
                            return '<input type="checkbox" name="group[]" value="' + d + '">';
                        } }, { data: 'name', render: function render(d, t, f, m) {
                            return '<a class="role-edit-link" href="' + drafTerbit.deskUrl + 'user/group/edit/' + f.id + '">' + d + '</a>';
                        } }, { data: 'description' }]
                });
                drafTerbit.replaceDTSearch(drafTerbit.group.dt);
                $('#group-checkall').checkAll({ showIndeterminate: true });
            },

            handleIndexForm: function handleIndexForm() {
                $('#group-index-form').ajaxForm({
                    dataType: 'json',
                    beforeSend: function beforeSend() {
                        if (confirm(__('Are you sure you want to delete those group, this con not be undone ?'))) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    success: function success(res) {
                        $.notify(res.message, res.status);
                        drafTerbit.group.dt.api().ajax.url(drafTerbit.deskUrl + "user/group/data/all").load();
                    }
                });
            }
        };
    }();
})(jQuery, drafTerbit);