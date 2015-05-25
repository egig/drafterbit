<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title"><?= __('Recent Activity'); ?></h3>
    </div>
    <div class="panel-body">
        <?php if ($logs) : ?>
        <table width="100%" class="table table-condensed">
        <thead>
            <tr>
                <th><?= __('Time') ?></th>
                <th><?= __('Activity') ?></th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($logs as $log) : ?>
            <tr>
                <td width="40%;"><?= $log->time ?></td>
                <td><?= $log->formattedMsg; ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
        </table>
        <?php else : ?>
            <p><?= __('No recent activity') ?></p>
        <?php endif; ?>
        <div>
            <a href="<?= admin_url('system/log') ?>" class="btn btn-sm pull-right"><?= __('View more') ?></a>
        </div>
    </div>
</div>