<!DOCTYPE html >
<html>
<head>
    <title>Drafterbit Installation</title>

        <?php $this->css(':bootstrap_css, :notify_css'); ?>
        <?php echo $this->block('css');?>

    <style>
        input, button, .btn, textarea {
            border-radius: 2px !important;
        }

        /* Font */
        @font-face {
          font-family: 'Lobster Two';
          /* temporary */
          src: url("<?php echo base_url('system/Resources/public/assets/Lobster_Two/LobsterTwo-Regular.ttf')?>") format('truetype');
        }

        .title {
          margin-top:10px;
          font-family: "Lobster Two",cursive;
          font-size: 38px;
          color:#444;
          font-weight: 200px;
        }

        .install-trapper {
            padding-top: 100px;
            position: fixed;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            background: #fff;
            text-align: center;
            display: none;
        }

    </style>
    <script>
        drafTerbit = {
            baseUrl: '<?php echo base_url(); ?>',
        }
    </script>
</head>
<body>
    <div class="container" style="margin-top:100px">        
        <div class="row install-section" id="start">
            <div style="text-align:center">
                <h2 class="title">Drafterbit</h2>
                <span class="help-block">Web software you can use to create a wabsite.</span>
                <br/>
                <br/>
                <a href="<?php echo $start == 2 ? '#step-2' : '#step-1' ?>" class="btn btn-default begin-button"/> Install </a>
            </div>
        </div>
        
        <div class="row install-section" style="display:none;" id="step-1">
            <div class="header" style="text-align:center">
                <h2>Database Connection</h2>
                <span class="help-block">Please Enter Your Database Conection Detail</span>
            </div>
            <form data-next="#step-2" method="post" class="static-form" id="database-form" action="<?php echo base_url('install/check')?>">
                <div class="col-md-3 col-md-offset-3">
                    <div class="form-group">
                        <label class="control-label">Driver</label>
                        <select name="database[driver]" class="form-control">
                            <option value="pdo_mysql">MySQL</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Hostname</label>
                        <input type="text" name="database[host]" class="form-control" value="localhost">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Database</label>
                        <input type="text" name="database[dbname]" class="form-control"/>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">User</label>
                        <input type="text" name="database[user]" class="form-control" autocomplete="off"/>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Password</label>
                            <input type="password" name="database[password]" class="form-control" autocomplete="off"/>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Table Prefix</label>
                            <input type="text" name="database[prefix]" class="form-control" value="dt_"/>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary pull-right"> NEXT </button>
                    </div>
                </div>
            </form>
        </div>

        <div class="row install-section" style="display:none;" id="step-2">
            <div class="header" style="text-align:center">
                <h2>Administrator Account</h2>
                <span class="help-block">Create Administrator Account</span>
            </div>
            <div class="col-md-4 col-md-offset-4">
                <form action="<?php echo base_url('install/admin') ?>" data-next="#step-3" class="static-form" method="post">
                    <div class="form-group">
                        <label class="control-label">Email</label>
                        <input required type="email" name="admin[email]" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Password</label>
                        <input type="password" name="admin[password]" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary pull-right"> NEXT </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="row install-section" style="display:none;" id="step-3">
            <div class="header" style="text-align:center">
                <h2>Name Your Site</h2>
                <span class="help-block">You always can change this later.</span>
            </div>
            <div class="col-md-4 col-md-offset-4">
                <form class="install-form" method="post" action="<?php echo base_url('install/install') ?>">
                    <div class="form-group">
                        <label class="control-label">Name</label>
                            <input required type="text" name="site[name]" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Description</label>
                            <textarea type="text" name="site[desc]" class="form-control"/></textarea>
                    </div>
                    <div class="form-group">
                            <button type="submit" name="submit" class="btn btn-primary pull-right"> Install</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="row install-section" style="display:none" id="success">
            <div class="header" style="text-align:center">
                <h2>Installation success !!</h2>
                <span class="help-block">Choose what to do now</span>
            </div>
            <div class="col-md-4 col-md-offset-4" style="text-align:center">
                <a class="btn btn-default col-md-6s" href="<?php echo base_url() ?>">View my website</a>
                <a class="btn btn-default col-md-6s" href="<?php echo base_url('admin/login') ?>">Go to admin</a>
            </div>
        </div>

    </div>
    <div class="modal fade config-textarea">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">Can't Write Config file</h4>
                  </div>
                  <div class="modal-body">
                      <p>You need to create config file manually. Create file named 'config.php' in installation directory with following content then refresh this page.</p>
                    <textarea readonly rows="10" class="form-control"></textarea>
                  </div>
                  <div class="modal-footer">
                    <a href="<?php echo base_url(); ?>" class="btn btn-default">Done, Please Refresh</a>
                  </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div class="install-trapper">
        <img alt="Installing&hellip;" src="<?php echo $preloader; ?>" />
    </div>

    <?php $this->js(':jquery, :bootstrap_js, :jquery_form, :notify_js, @install/js/install.js'); ?>
    <?php echo $this->block('js') ?>

</body>
</html>