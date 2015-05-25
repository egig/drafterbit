<?php _extend('@system/main-index'); ?>

<?php _start('action'); ?>
<a href="<?= admin_url('posts/categories/edit/new') ?>" class="btn btn-success btn-sm">
    <i class="fa fa-plus" style=""></i> <?= __('New Category') ?>
</a>
<button class="btn btn-default btn-sm uncreate-action" type="submit" name="action" value="delete">
    <i class="fa fa-trash-o"></i> <?= __('Delete') ?>
</button>
<?php _end(); ?>

<?php _start('table'); ?>
    <table class="table table-hover table-condensed" id="<?= $id ?>-data-table">
        <thead>
            <tr>
                <th class="sorting" width="15">
                    <input id="<?= $id ?>-checkall" type="checkbox">
                </th>
                <th width="30%"><?= __('Label') ?></th>
                <th width="70%"><?= __('Description') ?></th>
            </tr>
        </thead>
    </table>
<?php _end(); ?>

<?php _js('@blog/js/categories/index.js'); ?>