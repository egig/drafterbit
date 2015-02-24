<?php $this->extend('@system/main-index'); ?>


<?php $this->start('action'); ?>
<a href="<?php echo admin_url('user/roles/edit/new'); ?>" class="btn btn-success btn-sm">
    <i class="fa fa-plus" style=""></i> <?php echo __('New Role') ?>
</a>
<button class="btn btn-default btn-sm uncreate-action" type="submit" name="action" value="delete">
    <i class="fa fa-trash-o"></i> <?php echo __('Delete'); ?>
</button>
<?php $this->end(); ?>

<?php $this->start('table'); ?>
	<table class="table table-hover table-condensed" id="<?php echo $id ?>-data-table">
	    <thead>
	        <tr>
	            <th class="sorting" width="15">
	                <input id="<?php echo $id ?>-checkall" type="checkbox">
	            </th>
	            <th width="30%"><?php echo __('Role') ?></th>
	            <th width="70%"><?php echo __('Description') ?></th>
	        </tr>
	    </thead>
	</table>
<?php $this->end(); ?>

<?php $this->js('@user/js/roles/index.js'); 