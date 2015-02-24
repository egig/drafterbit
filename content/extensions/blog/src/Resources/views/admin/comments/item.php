<p><?php echo $content ?></p>

<?php if ($deletedAt == '0000-00-00 00:00:00'): ?>
    <div class="comment-action">
        <?php if ($status != 2): ?>
        <a data-status="0" data-id="<?php echo $itemId ?>" style="display:<?php echo $display ?>" class="unapprove status" href="#"><?php echo __('Pending') ?></a>
        <a data-status="1" data-id="<?php echo $itemId ?>" style="display:<?php echo $display2 ?>" class="approve status" href="#"><?php echo __('Approve') ?></a>
        <a data-id="<?php echo $itemId ?>" data-post-id="<?php echo $postId ?>" class="reply" href="#"><?php echo __('Reply') ?></a>
        <a data-status="2" data-id="<?php echo $itemId ?>" class="spam status" href="#"><?php echo __('Spam') ?></a>
        <a data-id="<?php echo $itemId ?>" class="trash" href="#"><?php echo __('Trash') ?></a>
        <?php else: ?>
            <a data-status="0" data-id="<?php echo $itemId ?>" class="unspam status" href="#"><?php echo __('Not Spam') ?></a>
        <?php endif; ?>
    </div>
<?php endif; ?>