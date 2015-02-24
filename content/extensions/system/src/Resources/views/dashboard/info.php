<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Info</h3>
    </div>
    <div class="panel-body row">
        <?php foreach ($stat as $k => $v) : ?>
        <div class="col-md-6">
            <div><strong><?php echo __($k); ?> : </strong> <?php echo $v; ?></div>
        </div>
        <?php endforeach; ?>
    </div>
</div>