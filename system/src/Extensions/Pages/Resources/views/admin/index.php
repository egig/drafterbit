<?php _extend('@system/main-index'); ?>

<?php $this->css('@pages/css/index.css'); ?>

<?php _start('filter'); ?>
<div style="display:inline-block; float:right;margin-left:5px;">
    <select name="filter" class="form-control input-sm pages-status-filter">
        <option value="all" <?= selected('status-filter', 'all', $status == 'all'); ?> >- <?= __('Status'); ?> -</option>
        <option value="published" <?= selected('status-filter', 'published', $status == 'published'); ?> ><?= __('Published') ?></option>
        <option value="unpublished" <?= selected('status-filter', 'pending', $status == 'pending'); ?> ><?= __('Pending Review') ?></option>
        <option value="trashed" <?= selected('status-filter', 'trashed', $status == 'trashed'); ?> ><?= __('Trashed') ?></option>
    </select>
</div>
<?php _end(); ?>

<?php _start('action'); ?>
<a href="<?= admin_url('pages/edit/new'); ?>" class="btn btn-success btn-sm">
    <i class="fa fa-plus" style=""></i> <?= __('New Page') ?>
</a>

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
	            <th width="80%"><?= __('Title'); ?></th>
	            <th width="20%"> <?= __('Last Modified') ?></th>
	        </tr>
	    </thead>
	</table>
<?php _end(); ?>

<?php $this->js('@pages/js/index.js'); ?>