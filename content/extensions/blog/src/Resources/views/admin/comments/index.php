<?php _extend('@system/main-index'); ?>

<?php _css('@blog/css/comment/index.css'); ?>

<?php _start('filter'); ?>
<div style="display:inline-block; float:right;margin-left:5px;">
    <select name="filter" class="form-control input-sm comments-status-filter">
        <option value="active" <?= selected('status-filter', 'active', $status == 'active'); ?> >- <?= __('Status') ?> -</option>
        <option value="approved" <?= selected('status-filter', 'approved', $status == 'approved'); ?> ><?= __('Approved') ?></option>
        <option value="pending" <?= selected('status-filter', 'pending', $status == 'pending'); ?> ><?= __('Pending') ?></option>
        <option value="spam" <?= selected('status-filter', 'spam', $status == 'spam'); ?> ><?= __('Spam') ?></option>
        <option value="trashed" <?= selected('status-filter', 'trashed', $status == 'trashed'); ?> ><?= __('Trashed') ?></option>
    </select>
</div>
<?php _end(); ?>

<?php _start('action'); ?>
<button class="btn btn-default btn-sm uncreate-action" type="submit" name="action" value="trash">
    <i class="fa fa-trash-o"></i> <?= __('Trash') ?>
</button>
<?php _end(); ?>

<?php _start('table'); ?>
    <table class="table table-hover table-condensed" id="<?= $id ?>-data-table">
        <thead>
            <tr>
                <th class="sorting" width="15">
                    <input id="<?= $id ?>-checkall" type="checkbox">
                </th>
                <th width="25%"><?= __('Author') ?></th>
                <th width="55%"><?= __('Content') ?></th>
                <th width="20%"><?= __('In Response to') ?></th>
            </tr>
        </thead>
    </table>
<?php _end(); ?>

<?php _js('@blog/js/comment/index.js'); 