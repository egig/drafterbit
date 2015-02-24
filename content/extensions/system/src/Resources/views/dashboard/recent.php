<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title"><?php echo __('Recent Activity'); ?></h3>
    </div>
    <div class="panel-body">
        <?php if ($logs) : ?>
        <table width="100%" class="table table-condensed">
        <thead>
            <tr>
                <th><?php echo __('Time') ?></th>
                <th><?php echo __('Activity') ?></th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($logs as $log) : ?>
            <tr>
                <td width="40%;"><?php echo $log->time ?></td>
                <td><?php echo $log->formattedMsg; ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
        </table>
        <?php else : ?>
            <p><?php echo __('No recent activity') ?></p>
        <?php endif; ?>
        <div>
            <a href="<?php echo admin_url('system/log') ?>" class="btn btn-sm pull-right"><?php echo __('View more') ?></a>
        </div>
    </div>
</div>