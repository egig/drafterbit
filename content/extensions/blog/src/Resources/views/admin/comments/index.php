<?php $this->extend('@system/main-index'); ?>

<?php $this->css('@blog/css/comment/index.css'); ?>

<?php $this->start('filter'); ?>
<div style="display:inline-block; float:right;margin-left:5px;">
    <select name="filter" class="form-control input-sm comments-status-filter">
        <option value="active" <?php echo selected('status-filter', 'active', $status == 'active'); ?> >- <?php echo __('Status') ?> -</option>
        <option value="approved" <?php echo selected('status-filter', 'approved', $status == 'approved'); ?> ><?php echo __('Approved') ?></option>
        <option value="pending" <?php echo selected('status-filter', 'pending', $status == 'pending'); ?> ><?php echo __('Pending') ?></option>
        <option value="spam" <?php echo selected('status-filter', 'spam', $status == 'spam'); ?> ><?php echo __('Spam') ?></option>
        <option value="trashed" <?php echo selected('status-filter', 'trashed', $status == 'trashed'); ?> ><?php echo __('Trashed') ?></option>
    </select>
</div>
<?php $this->end(); ?>

<?php $this->start('action'); ?>
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
	            <th width="25%"><?php echo __('Author') ?></th>
	            <th width="55%"><?php echo __('Content') ?></th>
	            <th width="20%"><?php echo __('In Response to') ?></th>
	        </tr>
	    </thead>
	</table>
<?php $this->end(); ?>

<?php $this->js('@blog/js/comment/index.js'); 