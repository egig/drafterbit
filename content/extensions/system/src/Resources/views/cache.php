<?php $this->extend('@system/main'); ?>

<div class="container">
	<div class="row">
		<div class="col-md-4">
			<table class="table table-bordered table-condensed">
					<tr>
						<th width="70%">Key</th>
						<th>Size</th>
					</tr>
				<?php foreach ($caches as $cache): ?>
					<tr>
						<td><?php echo $cache['id']; ?></td>
						<td><?php echo $cache['size']; ?></td>
					</tr>
				<?php endforeach ?>
			</table>

			<?php if(has_permission('cache.delete')): ?>
				<form method="POST">
					<button class="btn btn-default btn-sm pull-right" type="submit" name="action" value="clear"> <?php echo __('Clear Cache') ?></button>
				</form>
			<?php endif; ?>
		</div>
	</div>
</div>