<?php _extend('@system/main'); ?>

<?php _css(':notify_css, :finder_css'); ?>

<div class="container">
    <div id="finder-container"></div>
</div>

<?php _js(':bootstrap_contextmenu, :jquery_form, :notify_js, :finder_js, @files/js/index.js'); 