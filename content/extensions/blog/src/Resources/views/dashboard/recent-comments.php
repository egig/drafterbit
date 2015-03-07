<div class="">
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><?= __('Recent Comments'); ?></h3>
        </div>
        <div class="panel-body">
            <?php if ($comments) : ?>
            <ul style="list-style:none;margin:0;padding:0;">
                <?php foreach ($comments as $comment) : ?>
                    <li>
                        <div style="width:40px;height:40px;float:left;margin-right:10px;">
                            <img alt="" src="<?= gravatar_url($comment['email'], 40); ?>">
                        </div>
                        <div style="text-overflow: ellipsis;">
                            <?= $comment['name'] ?> <?= __('On'); ?>
                            <a href="<?= admin_url('posts/edit/'.$comment['post_id']) ?>"><?= $comment['title'] ?></a>
                            <p><?= $comment['content']; ?></p>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
            <div>
                <a href="<?= admin_url('posts/comments'); ?>" class="btn btn-sm pull-right"><?= __('View more') ?></a>
            </div>
            <?php else : ?>
            <?= __('No Recent Comment'); ?>.
            <?php endif ?>
        </div>
    </div>
</div>
