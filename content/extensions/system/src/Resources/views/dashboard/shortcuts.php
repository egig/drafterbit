<?php _css('@system/css/dashboard/shortcuts.css'); ?>

<div class="panel panel-default dashboard-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><?= __('Shortcuts') ?></h3>
    </div>
    <div class="panel-body row">
        <ul class="shortcuts">
            <?php foreach ($shortcuts as $shortcut) : ?>
                <li class="shortcut">
                    <a class="btn btn-default btn-lg" target="<?= $shortcut['window']; ?>" href="<?= $shortcut['link'] ?>">
                        <i class="shortcut-icon <?= $shortcut['icon-class'] ?>"></i>
                        <div class="shortcut-label"><?= $shortcut['label'] ?></div>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</div>
