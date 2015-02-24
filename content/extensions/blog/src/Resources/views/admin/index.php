<?php $this->extend('@system/main-index'); ?>

<?php $this->start('filter'); ?>
<div style="display:inline-block; float:right;margin-left:5px;">
    <select name="filter" class="form-control input-sm blog-status-filter">
        <option value="all" <?php echo selected('status-filter', 'all', $status == 'all'); ?> >- <?php echo __('Status') ?> -</option>
        <option value="unpublished" <?php echo selected('status-filter', 'unpublished', $status == 'unpublished'); ?> >  <?php echo __('Unpublished') ?></option>
        <option value="published" <?php echo selected('status-filter', 'published', $status == 'published'); ?> >  <?php echo __('Published') ?></option>
        <option value="trashed" <?php echo selected('status-filter', 'trashed', $status == 'trashed'); ?> >  <?php echo __('Trashed') ?></option>
    </select>
</div>
<?php $this->end(); ?>

<?php $this->start('action'); ?>
<a href="<?php echo admin_url('blog/edit/new') ?>" class="btn btn-success btn-sm">
    <i class="fa fa-plus" style=""></i> <?php echo __('New Post') ?>
</a>
<button class="btn btn-default btn-sm uncreate-action" type="submit" name="action" value="trash">
    <i class="fa fa-trash-o"></i> <?php echo __('Trash') ?>
</button>
<?php $this->end(); ?>

<?php $this->start('table'); ?>
	<table class="table table-hover table-condensed" id="<?php echo $id ?>-data-table">
	    <thead>
	        <tr>
	            <th class="sorting" width="15">
	                <input id="<?php echo $id ?>-checkall" type="checkbox">
	            </th>
	            <th width="40%"><?php echo __('Title') ?></th>
	            <th width="20%"><?php echo __('Author') ?></th>
	            <th width="20%"><?php echo __('Status') ?></th>
	            <th width="20%"><?php echo __('Created') ?></th>
	        </tr>
	    </thead>
	</table>
<?php $this->end(); ?>

<?php $this->js('@blog/js/index.js'); 