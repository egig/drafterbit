<?php $this->extend('@system/main'); ?>

<div class="container">
    <div class="row row-content">
        <div class="col-md-12">
            <?php foreach ($themes as $theme => $prop) :?>
                <div class="col-md-3">
                    <div class="well well-sm clearfix">
                        <div style="height:160px;overflow:hidden;"><img width="100%;" src="<?php echo base_url(app('dir.content').'/themes/'.$prop['id'].'/screenshot.png') ?>">
                        </div>
                        <div style="height:70px;overflow:hidden;" class="theme-property">
                            <h4><?php echo $prop['name'] ?></h4>

                            <a href="<?php echo admin_url('setting/themes/customize?theme='.$prop['id'].'&csrf='.csrf_token()); ?>" target="_blank" class="btn btn-xs btn-primary pull-right" style="margin-left:5px;"><?php echo __('Customize') ?></a>
                            <?php  if ($currentTheme == $prop['id']) : ?>
                            <a disabled class="btn btn-xs btn-default pull-right"><?php echo __('Active') ?></a>
                            <?php else : ?>
                            <form method="POST">
                                <input type="hidden" name="theme" value="<?php echo $prop['id']; ?>">
                                <input type="submit" value="Activate" class="btn btn-xs btn-success pull-right">
                           </form>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>