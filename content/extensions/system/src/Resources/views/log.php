<?php $this->extend('@system/main-index'); ?>

<?php $this->start('action'); ?>
	<?php if(has_permission('log.delete')): ?>
		<button class="btn btn-default btn-sm uncreate" type="submit" name="action" value="delete">
		    <?php echo __('Delete') ?>
		</button>
		<button class="btn btn-default btn-sm uncreate" type="submit" name="action" value="clear">
		    <?php echo __('Clear') ?>
		</button>
	<?php endif; ?>
<?php $this->end(); ?>

s
<?php $this->start('table'); ?>
	<table class="table table-hover table-condensed" id="<?php echo $id ?>-data-table">
	    <thead>
	        <tr>
	            <th class="sorting" width="15">
	                <input id="<?php echo $id ?>-checkall" type="checkbox">
	            </th>
	            <th width="30%"><?php echo __('Time') ?></th>
	            <th width="70%"><?php echo __('Activity') ?></th>
	        </tr>
	    </thead>
	</table>
<?php $this->end(); ?>

<?php $this->js('@system/js/log.js'); 