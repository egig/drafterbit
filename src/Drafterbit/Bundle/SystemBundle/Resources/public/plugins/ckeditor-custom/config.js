/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here. For example:
    // config.uiColor = '#AADC6E';
    
    config.language = drafTerbit.language;
    config.toolbar = 'Basic';
 
    config.toolbar_MyToolbar =
    [
        { name: 'document', items : [ 'NewPage','Preview','Source' ] },
        { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
        { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','Scayt' ] },
        { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'
                 ,'Iframe' ] },
                '/',
        { name: 'styles', items : [ 'Styles','Format' ] },
        { name: 'basicstyles', items : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
        { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote' ] },
        { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
        { name: 'tools', items : [ 'Maximize','-','About', 'WPMore'] }
    ];
    
    config.toolbar_Basic =
    [
        ['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-',
        'Link', 'Unlink','-','Image', 'Styles', 'Format', 'Source', 'WPMore', 'Maximize']
    ];

    //config.skin = 'bootstrap';
};

      // Use <br> as break and not enclose text in <p> when pressing <Enter> or <Shift+Enter>
      //CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
      //CKEDITOR.config.shiftEnterMode = CKEDITOR.ENTER_BR;
      CKEDITOR.config.fillEmptyBlocks = false;    // Prevent filler nodes in all empty blocks

      // Remove all formatting when pasting text copied from websites or Microsoft Word
      CKEDITOR.config.forcePasteAsPlainText = true;
      CKEDITOR.config.pasteFromWordRemoveFontStyles = true;
      CKEDITOR.config.pasteFromWordRemoveStyles = true;