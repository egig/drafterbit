<?php $this->css('@system/css/dashboard/shortcuts.css'); ?>

<div class="panel panel-default dashboard-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><?php echo __('Shortcuts') ?></h3>
    </div>
    <div class="panel-body row">
        <ul class="shortcuts">
            <?php foreach ($shortcuts as $shortcut) : ?>
                <li class="shortcut"><a href="<?php echo $shortcut['link'] ?>">
                    <i class="<?php echo $shortcut['icon-class'] ?>"></i>
                    <?php echo $shortcut['label'] ?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</div>
