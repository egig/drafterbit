<?php _extend('@system/main'); ?>

<?php $this->css('@blog/css/revision.css'); ?>

<div class="revisions">
<?php foreach ($revs as $rev): ?>
<div class="revision" id="rev-<?= $rev['id'] ?>">
    <div class="container-fluid revision-head sticky">
        <div class="container">
            <div class="row row-sticky-toolbar" style="margin:10px 0;">
                <div class="revision-author">
                    <span class="label label-default"> <?= __('Rev.').' '.$rev['pos'].'/'.$count; ?></span> <?= __('by')?> <a href="<?= $rev['authorUrl']; ?>"><?= $rev['authorName'] ?></a>
                    <br/><span class="revision-time"><?= $rev['timeHumans'] ?> ( <?= $rev['time'] ?> )</span>
                </div>
                <div class="revision-toolbar">
                    <form class="ajax-form" action="<?= admin_url('posts/revision/revert') ?>" method="post">
                        <input type="hidden" name="id" value="<?= $rev['id'] ?>">
                        <input type="hidden" name="post-id" value="<?= $postId ?>">
                        <button  class="btn btn-sm btn-default pull-right" type="submit" name="action" value="revert"> <i class="fa fa-refresh"></i> <?= __('Revert') ?> </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h2><code><?= $rev['diff_title']; ?></code></h2>
                <code> <?= $rev['diff_content'];  ?></code>
            </div>
        </div>
    </div>
</div>
<?php endforeach; ?>
</div>

<?php $this->js(':sticky_kit, @blog/js/revision.js'); ?>