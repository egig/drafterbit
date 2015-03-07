<p><?= $content ?></p>

<?php if ($deletedAt == '0000-00-00 00:00:00'): ?>
    <div class="comment-action">
        <?php if ($status != 2): ?>
        <a data-status="0" data-id="<?= $itemId ?>" style="display:<?= $display ?>" class="unapprove status" href="#"><?= __('Pending') ?></a>
        <a data-status="1" data-id="<?= $itemId ?>" style="display:<?= $display2 ?>" class="approve status" href="#"><?= __('Approve') ?></a>
        <a data-id="<?= $itemId ?>" data-post-id="<?= $postId ?>" class="reply" href="#"><?= __('Reply') ?></a>
        <a data-status="2" data-id="<?= $itemId ?>" class="spam status" href="#"><?= __('Spam') ?></a>
        <a data-id="<?= $itemId ?>" class="trash" href="#"><?= __('Trash') ?></a>
        <?php else: ?>
            <a data-status="0" data-id="<?= $itemId ?>" class="unspam status" href="#"><?= __('Not Spam') ?></a>
        <?php endif; ?>
    </div>
<?php endif; ?>