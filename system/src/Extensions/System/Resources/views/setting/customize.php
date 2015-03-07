<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= $title ?> | <?= $siteName.' Administrator'; ?></title>
        <!-- Core CSS - Include with every page -->

        <?php $this->css(':fontawesome', ':fontawesome'); ?>
        <?php $this->css(':colorpicker_css', ':colorpicker_css'); ?>
        <?php $this->css('
          :bootstrap_css,
          :notify_css,
          @system/css/overrides-bootstrap.css,
          @system/css/overrides-datatables.css,
          @system/css/style.css,
          @system/css/style-desktop.css,
          @system/css/style-mobile.css,
          @system/css/themes/customizer.css
        ') ?>
        
        <?= $this->block('css'); ?>
    </head>

    <body>
        <div id="dt-widget-availables">
            <div class="header">
                <h3><?= __('Available Widgets') ?></h3>
            </div>
            <ul>
                <?php foreach ($availableWidget as $widget) : ?>
                  <li>
                      <a data-ui="<?= base64_encode($widget->ui); ?>" data-name="<?= ucfirst($widget->getName()); ?>" class="dt-widget-item" href="javascript:;"><?= ucfirst($widget->getName()); ?></a>
                  </li>
                <?php endforeach; ?>
            </ul>
        </div>
        <div id="dt-iframe-container">
            <iframe name="preview" width="100%" height="100%" src="<?= $preview_url ?>" sandbox="allow-same-origin allow-scripts">
            </iframe>
        </div>
        <div id="customizer">
            <div class="col-container">
                <div class="col">
                    <form action="<?= admin_url('setting/themes/custom-preview?csrf='.csrf_token()); ?>" method="post" id="customizer-form" class="customizer-ajax-form">
                    <input type="hidden" name="csrf" value="<?= csrf_token(); ?>"/>
                    <input type="hidden" name="url" value="<?= base_url(); ?>"/>
                    <div class="section">
                        <a href="javascript:close();" class="btn btn-default btn-xs"><?= __('Close') ?></a>
                        <button type="submit" name="action" value="save" class="btn btn-primary btn-xs pull-right"><?= __('Save') ?></button>
                        <button type="submit" name="action" value="update-preview" class="btn btn-primary btn-xs pull-right" style="margin-right:5px;"><?php  echo __('Update Preview') ?></button>
                    </div>

                    <div class="section customizer-input" id="general-section">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <a data-toggle="collapse" data-parent=".customizer-input" href="#collapseOne">
                                      <?= __('Title') ?> &amp; <?= __('Tagline') ?>
                                    </a>
                                </h4>
                            </div>
                            <div id="collapseOne" class="panel-collapse collapse in">
                              <div class="panel-body">
                                <div class="form-group">
                                  <label><?= __('Title') ?></label>
                                  <input class="form-control input-sm" type="text" name="general[title]" value="<?= $siteName; ?>"/>
                                </div>
                                <div class="form-group">
                                  <label><?= __('Tagline') ?></label>
                                  <textarea class="form-control input-sm" type="text" name="general[tagline]"><?= $tagLine; ?></textarea>
                                </div>
                              </div>
                            </div>
                        </div>
                         <div class="panel panel-default">
                            <div class="panel-heading">
                              <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent=".customizer-input" href="#menu-options">
                                  <?= __('Theme Option') ?> </i>
                                </a>
                              </h4>
                            </div>
                            <div id="menu-options" class="panel-collapse collapse">
                              <div class="panel-body">
                                <?php foreach ($optionInputs as $html): ?>
                                  <?= $html; ?>
                                <?php endforeach; ?>
                              </div>
                            </div>
                        </div>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                              <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent=".customizer-input" href="#collapse-two">
                                  <?= __('Navigation') ?>
                                </a>
                              </h4>
                            </div>
                            <div id="collapse-two" class="panel-collapse collapse">
                              <div class="panel-body">
                              <?php foreach ($menuPositions as $pos) : ?>
                                   <div class="panel panel-default">
                                      <div class="panel-heading">
                                        <h4 class="panel-title">
                                          <a data-toggle="collapse" data-parent="#menus-section" href="#<?= $pos ?>-menu-position">
                                              <?= $pos ?>
                                          </a>
                                        </h4>
                                      </div>
                                      <div id="<?= $pos ?>-menu-position" class="panel-collapse collapse">
                                        <div class="sortable panel-body <?= $pos ?>-menu-container">
                                          <div>
                                            <label><?= __('Select Menu') ?></label>
                                            <select data-pos="<?= $pos; ?>" name="menus[<?= $pos ?>]" class="form-control menu-position">
                                              <?php foreach ($menuOptions as $option): ?>
                                                <option <?= selected("menus[$pos]", $option['id'], $menus[$pos] == $option['id']); ?> value="<?= $option['id'] ?>"><?=  $option['name'] ?></option>
                                              <?php endforeach; ?>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                              <?php endforeach ?>
                              </div>
                            </div>
                        </div>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                              <h4 class="panel-title">
                                <a class="widget-section" href="#">
                                  <?= __('Widget') ?> <i class="fa fa-angle-right pull-right"></i>
                                </a>
                              </h4>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
                <div class="col">
                    <div class="section">
                        <a href="#" class="btn btn-default btn-xs widget-section-back"><?= __('Back') ?></a>
                    </div>
                    <div class="section" id="widget-section">
                        <h2>Widgets</h2>
                        <?php foreach ($widgetPositions as $pos) : ?>
                             <div class="panel panel-default">
                                <div class="panel-heading">
                                  <h4 class="panel-title">
                                    <a data-toggle="collapse" data-parent="#widget-section" href="#<?= $pos ?>-widget-position">
                                        <?= $pos ?>
                                    </a>
                                  </h4>
                                </div>
                                <div id="<?= $pos ?>-widget-position" class="panel-collapse collapse widget-position">
                                  <div class="panel-body widget-container <?= $pos ?>-widget-container">
                                    <div class="widget-sortable">
                                        <?php foreach ($widgets[$pos] as $widget) : ?>
                                          <div class="panel panel-default widget-item-container" id="<?= $widget['id'] ?>-widget-item-container">
                                              <div class="panel-heading">
                                                <h4 class="panel-title">
                                                  <a data-toggle="collapse" data-parent=".<?= $pos ?>-widget-container > .widget-sortable" href="#widget-<?= $widget['id']; ?>">
                                                    <?= $widget['name']; ?>
                                                  </a>
                                                </h4>
                                              </div>
                                              <div id="widget-<?= $widget['id'] ?>" class="panel-collapse collapse">
                                                <div class="panel-body">
                                                    <?= $widget['ui']; ?>
                                                </div>
                                              </div>
                                          </div>
                                        <?php endforeach ?>
                                    </div>
                                    <div class="well well-sm" style="margin-top:5px;">
                                        <a class="dt-widget-adder" data-position="<?= $pos; ?>" data-theme="<?= $theme; ?>" href="#available-widget-dialog"><?= __('Add widget') ?></a>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        <?php endforeach ?>
                    </div>
                </div>
            </div>
        </div> <!--/customizer-->

        <!-- script -->
        <script src="<?= asset_url('@vendor/jquery/dist/jquery.min.js'); ?>" /></script>
        <script src="<?= base_url('system/drafterbit.js'); ?>" /></script>
        <?php $this->js(':bootstrap_js, :jquery_ui_js, :notify_js, :jquery_form, :colorpicker_js, @system/js/layout.js, @system/js/customizer.js, :handlebars'); ?>
        <?= $this->block('js'); ?>

        <script>
          <?php if (isset($messages)) : ?>
                  <?php foreach ($messages as $message) : ?>
                      msg = "<?= $this->escape($message['text'], 'js'); ?>";
                      $.notify(msg, "<?= $message['type'] == 'error' ? 'danger' : $message['type']; ?>");
                  <?php endforeach; ?>
          <?php endif;?>
        </script>

        <script id="widget-item-template" type="text/x-handlebars-template">
        <div class="panel panel-default widget-item-container">
            <div class="panel-heading">
              <h4 class="panel-title">
                <a data-toggle="collapse" data-parent=".widget-container" href="#widget-{{widgetId}}">{{widgetName}}</a>
              </h4>
            </div>
            <div id="widget-{{widgetId}}" class="panel-collapse collapse">
              <div class="panel-body">
                {{{widgetUi}}}
              </div>
            </div>
        </div>
        </script>
    </body>
</html>