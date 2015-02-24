<?php $this->extend('@system/main-index'); ?>

<?php $this->start('filter'); ?>
<div style="display:inline-block; float:right;margin-left:5px;">
    <select name="filter" class="form-control input-sm users-status-filter">
        <option value="all" selected >- <?php echo __('Status') ?> -</option>
        <option value="active" ><?php echo __('Active') ?></option>
        <option value="banned" ><?php echo __('Banned') ?></option>
    </select>
</div>
<?php $this->end(); ?>

<?php $this->start('action'); ?>
<a href="<?php echo admin_url('user/edit/new'); ?>" class="btn btn-success btn-sm">
    <i class="fa fa-plus" style=""></i> <?php echo __('New User') ?>
</a>
<button class="btn btn-default btn-sm uncreate-action" type="submit" name="action" value="delete">
    <i class="fa fa-trash-o"></i> <?php echo __('Delete') ?>
</button>
<?php $this->end(); ?>

<?php $this->start('table'); ?>
	<table class="table table-hover table-condensed" id="<?php echo $id ?>-data-table">
	    <thead>
	        <tr>
	            <th class="sorting" width="15">
	                <input id="<?php echo $id ?>-checkall" type="checkbox">
	            </th>
	            <th width="60%"> <?php echo __('Name') ?></th>
	            <th width="30%"> <?php echo __('Email') ?></th>
	            <th width="10%"> <?php echo __('Status') ?></th>
	        </tr>
	    </thead>
	</table>
<?php $this->end(); ?>

<?php $this->js('@user/js/index.js'); 