/* Font */
@font-face {
    font-family: 'Lobster Two';
    /* temporary */
    src: url("<?= base_url(app('dir.system').'/src/Base/Resources/public/assets/Lobster_Two/LobsterTwo-Regular.ttf') ?>") format('truetype');
}

.dt-brand {font-family: "Lobster Two";margin-right: 10px;}

.preloader {
  position: fixed;
  background: #ffffff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1024;
  text-align: center;
  padding-top: 20%;
}