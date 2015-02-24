<div class="">
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><?php echo __('Recent Comments'); ?></h3>
        </div>
        <div class="panel-body">
            <?php if ($comments) : ?>
            <ul style="list-style:none;margin:0;padding:0;">
                <?php foreach ($comments as $comment) : ?>
                    <li>
                        <div style="width:40px;height:40px;float:left;margin-right:10px;">
                            <img alt="" src="<?php echo gravatar_url($comment['email'], 40); ?>">
                        </div>
                        <div style="text-overflow: ellipsis;">
                            <?php echo $comment['name'] ?> <?php echo __('On'); ?>
                            <a href="<?php echo admin_url('blog/edit/'.$comment['post_id']) ?>"><?php echo $comment['title'] ?></a>
                            <p><?php echo $comment['content']; ?></p>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
            <div>
                <a href="<?php echo admin_url('blog/comments'); ?>" class="btn btn-sm pull-right"><?php echo __('View more') ?></a>
            </div>
            <?php else : ?>
            <?php echo __('No Recent Comment'); ?>.
            <?php endif ?>
        </div>
    </div>
</div>
