<?php _extend('@system/main-index'); ?>

<?php _start('action'); ?>
	<?php if(has_permission('log.delete')): ?>
		<button class="btn btn-default btn-sm uncreate" type="submit" name="action" value="delete"><?= __('Delete') ?></button>
		<button class="btn btn-default btn-sm uncreate" type="submit" name="action" value="clear"><?= __('Clear') ?></button>
	<?php endif; ?>
<?php _end(); ?>

<?php _start('table'); ?>
	<table class="table table-hover table-condensed" id="<?= $id ?>-data-table">
	    <thead>
	        <tr>
	            <th class="sorting" width="15">
	                <input id="<?= $id ?>-checkall" type="checkbox">
	            </th>
	            <th width="30%"><?= __('Time') ?></th>
	            <th width="70%"><?= __('Activity') ?></th>
	        </tr>
	    </thead>
	</table>
<?php _end(); ?>

<?php $this->js('@system/js/log.js'); ?>