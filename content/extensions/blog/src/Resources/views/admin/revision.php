<?php $this->extend('@system/main'); ?>

<?php $this->css('@blog/css/revision.css'); ?>

<div class="container">
	<div class="row">
		<div class="col-md-9">
			<?php echo $diff;  ?>
		</div>
	</div>
</div>