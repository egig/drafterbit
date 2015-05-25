<?php _extend('@system/main-index'); ?>

<?php _start('filter'); ?>
<div style="display:inline-block; float:right;margin-left:5px;">
    <select name="filter" class="form-control input-sm users-status-filter">
        <option value="all" selected >- <?= __('Status') ?> -</option>
        <option value="active" ><?= __('Active') ?></option>
        <option value="banned" ><?= __('Banned') ?></option>
    </select>
</div>
<?php _end(); ?>

<?php _start('action'); ?>
<a href="<?= admin_url('user/edit/new'); ?>" class="btn btn-success btn-sm">
    <i class="fa fa-plus" style=""></i> <?= __('New User') ?>
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
                <th width="60%"> <?= __('Name') ?></th>
                <th width="30%"> <?= __('Email') ?></th>
                <th width="10%"> <?= __('Status') ?></th>
            </tr>
        </thead>
    </table>
<?php _end(); ?>

<?php _js('@user/js/index.js'); 