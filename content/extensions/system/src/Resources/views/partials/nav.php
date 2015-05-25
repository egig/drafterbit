<nav class="navbar navbar-default navbar-fixed-top" role="navigation" style="margin-bottom: 0">
    <div class="container nav-container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="<?= admin_url(); ?>"><i class="fa fa-home"></i></a>
            </div>
            <!-- /.navbar-header -->
            <div class="dt-off-canvas">
            <ul class="nav navbar-top-links navbar-left">
                <?php foreach ($menus as $menu) : ?>
                    
                    <?php if ($menu->hasChildren()) : ?>
                        <li class="dropdown">
                            <a class="navbar-link dropdown-toggle" data-toggle="dropdown" href="#">
                                <?= $menu->label; ?>
                            </a>
                            <ul class="dropdown-menu">
                                <div class="dropdown-caret">
                                  <span class="caret-outer"></span>
                                  <span class="caret-inner"></span>
                                </div>

                                <?php foreach ($menu->children as $childMenu) : ?>
                                    <li><a id="nav-<?= $childMenu->id ?>" class="<?= $childMenu->class ?>" href="<?= admin_url($childMenu->href); ?>"><?= $childMenu->label; ?></a></li>
                                <?php endforeach;?>
                            </ul>
                            <!-- /.dropdown -->
                        </li>
                    
                    <?php else : ?>
                         <li>
                            <a id="nav-<?= $menu->id ?>" class="navbar-link <?= $menu->class ?>"  href="<?= admin_url($menu->href); ?>">
                                <?= $menu->label; ?>
                            </a>
                        </li>
                    <?php endif; ?>

                <?php endforeach ?>
            </ul>
            </div>

            <ul class="nav navbar-top-links navbar-right user-preferences">
                <!-- /.dropdown -->
                <li class="dropdown">
                    <a class=" navbar-link dropdown-toggle" data-toggle="dropdown" href="#">
                        <img width="20px;" class="profile-avatar" src="<?= $userGravatar; ?>" alt="<?= $userName ?>"/>
                        <!--<i class="fa fa-caret-down"></i>-->
                    </a>
                    <ul class="dropdown-menu dropdown-menu-right dropdown-user">
                        <div class="dropdown-caret">
                            <span class="caret-outer"></span>
                            <span class="caret-inner"></span>
                        </div>
                        <li> <a href="<?= base_url(); ?>" target="_blank"><?= __('Visit Site') ?> <i class="fa fa-external-link"></i> </a> </li>
                        <!--<li><a href="#" class="soon">My Profile</a> </li>
                        <li><a href="#" class="soon">Preferences</a> </li>-->
                        <li><a href="<?= admin_url('logout'); ?>"><?= __('Logout') ?></a> </li>
                    </ul>
                    <!-- /.dropdown-user -->
                </li>
                <!-- /.dropdown -->
            </ul>
            <!-- /.navbar-top-links -->
    </div>
</nav>