<?php $this->extend('@system/main'); ?>

<?php $this->css('@system/css/dashboard.css'); ?>

<div class="container">
	<div class="row panel-container">
	    <div class="panel-row col-md-6" id="panel-row-left" data-pos="left">
        <?php foreach ($left as $id => $widget) : ?>
		    <div class="panel-item" id="dashboard-widget-<?php echo $id ?>">
	            <?php echo $widget; ?>
		    </div>
        <?php endforeach; ?>
	    </div>
	    <div class="panel-row col-md-6" id="panel-row-right" data-pos="right">
        <?php foreach ($right as $id => $widget) : ?>
		    <div class="panel-item" id="dashboard-widget-<?php echo $id ?>">
    	        <?php echo $widget; ?>
	    	</div>
        <?php endforeach; ?>
	    </div>
	</div>
</div>

<?php $this->js(':jquery_ui_js, @system/js/dashboard.js'); ?>