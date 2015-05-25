<?php _extend('@system/main'); ?>

<div class="container">
    <div class="row">	
    	<div class="col-md-5">
    		<form action="<?= admin_url('system/do_update') ?>" id="dt-update-form" enctype="multipart/form-data" method="POST">
                <div class="form-group">
                    <label class="control-label">FTP Host</label>
                    <input type="text" name="ftp_host" value="<?= value('ftp_host', $ftpHost) ?>"  class="form-control">
                </div>
                <div class="form-group">
                    <label class="control-label">FTP Port</label>
                    <input type="text" name="ftp_port" value="<?= value('ftp_port', $ftpPort) ?>"  class="form-control">
                </div>
                <div class="form-group">
                    <label class="control-label">FTP User</label>
                    <input type="text" name="ftp_user" value="<?= value('ftp_user', $ftpUser) ?>"  class="form-control">
                </div>
                <div class="form-group">
                    <label class="control-label">FTP Password</label>
                    <input type="text" name="ftp_pass" value="<?= value('ftp_pass', $ftpPass) ?>"  class="form-control">
                </div>
                <div class="form-group">
                    <label class="control-label">FTP Path</label>
                    <input type="text" name="ftp_path" value="<?= value('ftp_path', $ftpPath) ?>"  class="form-control">
                </div>
    			<div class="form-group">
	    		    <label class="control-label"><?= __('Update Pack') ?></label>
	    		    <br/>
	    		    <input name="update_pack" type="file" style="display:inline-block" />
	    		    <input type="submit" name="action" value="Install Update" class="btn btn-sm btn-primary"/>
    			</div>
    		</form>
        </div>
    </div>
</div>

<?php _js('@system/js/update.js')  ?>