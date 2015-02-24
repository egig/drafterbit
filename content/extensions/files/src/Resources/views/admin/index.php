<?php $this->extend('@system/main'); ?>

<?php $this->css(':notify_css, :finder_css'); ?>

<div class="container">
    <div id="finder-container"></div>
</div>

<?php $this->js(':bootstrap_contextmenu, :jquery_form, :notify_js, :finder_js, @files/js/index.js'); 