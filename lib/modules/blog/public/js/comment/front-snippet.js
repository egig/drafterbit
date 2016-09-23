'use strict';

(function (document) {

    var CommentForm = {

        main: document.getElementById('form-comment-0'),
        forms: document.getElementsByClassName('form-comment'),
        dr: document.getElementsByClassName('do-reply'),
        cr: document.getElementsByClassName('cancel-reply'),

        showMainForm: function showMainForm() {
            this.main.style.display = 'block';
        },

        hideAllForms: function hideAllForms() {
            for (var n = 0; n < this.forms.length; n++) {
                this.forms[n].style.display = 'none';
            }
        },

        listenReply: function listenReply() {

            for (var i = 0; i < this.dr.length; i++) {
                var parent = this;
                this.dr[i].addEventListener('click', function (e) {

                    e.preventDefault();

                    parent.hideAllForms();

                    var id = this.dataset.commentId;
                    var el = document.getElementById('form-comment-' + id);
                    el.style.display = 'block';
                });
            }
        },

        listenCancel: function listenCancel() {
            for (var i = 0; i < this.cr.length; i++) {
                var parent = this;
                this.cr[i].addEventListener('click', function (e) {

                    e.preventDefault();
                    // var id = this.dataset.parentId;
                    parent.hideAllForms();
                    parent.showMainForm();
                });
            }
        },

        listen: function listen() {
            this.listenReply();
            this.listenCancel();
        }
    };

    CommentForm.showMainForm();
    CommentForm.listen();
})(document);