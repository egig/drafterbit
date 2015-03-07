<?php _extend('@system/main-edit'); ?>

<?php _start('action'); ?>
<button class="btn btn-sm btn-success" type="submit" name="action" value="save">
    <i class="fa fa-check"></i> <?= __('Save') ?>
</button>
<?php _end(); ?>

<div role="tabpanel">

  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#general-setting" aria-controls="general" role="tab" data-toggle="tab"><?= __('General') ?></a></li>
    <li role="presentation"><a href="#mail-server" aria-controls="mail-server" role="tab" data-toggle="tab"><?= __('Mail Server') ?></a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content" style="padding:20px 10px;">
    <div role="tabpanel" class="tab-pane active" id="general-setting">
      <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="site-name" class="control-label"><?= __('Sitename') ?></label>
                <input name="site-name" type="text" class="form-control" placeholder="Site Name" value="<?= value('site-name', $siteName); ?>">
             </div>
             <div class="form-group">
                <label for="site-tagline" class="control-label"><?=  __('Tagline') ?></label>
                  <input name="site-tagline" type="text" class="form-control" placeholder="Tag Line" value="<?= value('site-tagline', $tagLine); ?>">
                  <span class="help-block"><?= __('In a few words, explain what this site is about') ?>.</span>
             </div>
             <div class="form-group">
                <label for="format-time" class="control-label"><?= __('Front Page') ?></label>
                  <select class="form-control" name="homepage">
                      <?php foreach ($pageOptions as $value => $label) : ?>
                        <option <?= selected('homepage', $value, $homepage == $value); ?> value="<?= $value ?>"><?= $label ?></option>
                      <?php endforeach; ?>
                  </select>
             </div>
            <div class="form-group">
                <label for="email" class="control-label"><?= __('Email') ?></label>
                  <input type="text" name="email" class="form-control" placeholder="Email" value="<?= value('email', $adminEmail); ?>">
                  <span class="help-block"><?= __('This address is used for admin purposes, like new user notification') ?>.</span>
             </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="language" class="control-label"><?= __('Language') ?></label>
                <select name="language" class="form-control">
                  <?php foreach($languageList as $lang): ?>
                    <option <?= selected('language', $lang, $language == $lang); ?> value="<?= $lang ?>"> <?= $lang; ?></option>
                  <?php endforeach; ?>
                </select>
             </div>
             <div class="form-group">
                <label for="timezone" class="control-label"><?= __('Timezone') ?></label>
                  <select name="timezone" class="form-control">
                    <?php foreach ($timezoneIdList as $key) : ?>
                      <option <?= selected('timezone', $key, $timezone == $key); ?> value="<?= $key ?>"><?= $key ?></option>
                    <?php endforeach; ?>
                  </select>
             </div>
             <div class="form-group">
                <label for="format-date" class="control-label"><?= __('Date Format') ?></label>
                  <input type="text" class="form-control" name="format-date" value="<?= value('format-date', $dateFormat) ?>">
             </div>
             <div class="form-group">
                <label for="format-time" class="control-label"><?= __('Time Format') ?></label>
                <input type="text" class="form-control" name="format-time" value="<?= value('format-time', $timeFormat) ?>">
             </div>
        </div>
      </div>

    </div>
    <div role="tabpanel" class="tab-pane" id="mail-server">
         <div class="col-md-4 content-full">
            <div class="form-group">
                <label for="smtp-host" class="control-label"><?= __('SMTP Host') ?></label>
                  <input name="smtp-host" type="text" class="form-control" value="<?= $smtpHost ?>">
             </div>
             <div class="form-group">
                <label for="smtp-port" class="control-label"><?= __('SMTP Port') ?></label>
                  <input name="smtp-port" type="text" class="form-control" value="<?= $smtpPort ?>">
             </div>
             <div class="form-group">
                <label for="smtp-user" class="control-label"><?= __('SMTP User') ?></label>
                  <input type="text" class="form-control" name="smtp-user" value="<?= $smtpUser ?>">
             </div>
             <div class="form-group">
                <label for="smtp-pass" class="control-label"><?= __('SMTP Password') ?></label>
                  <input type="password" class="form-control" name="smtp-pass" value="<?= $smtpPass ?>">
             </div>
        </div>
      </div>

    </div>
  </div>

</div>