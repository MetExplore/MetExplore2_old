/**
 * C_DetailsAttachment
 * Controls all V_DetailsAttachment events.
 */
Ext.define('MetExplore.controller.comments.C_DetailsAttachment', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['window.V_DetailsAttachment']
    },

    /**
     * Components events
     */
    init: function() {
        this.control({
            'detailsAttachment button[action=cancel]': {
                click: this.closeWin
            },
            'detailsAttachment button[action=save]': {
                click: this.checkFilledForm
            },
            'detailsAttachment button[action=open]': {
                click: this.openAttachment
            },
            'detailsAttachment filefield[name=selectFile]': {
                change: this.fileSelected
            },
            'detailsAttachment textfield[name=fileUrl]': {
                change: this.urlSelected
            },
            'detailsAttachment radio[action=upload]': {
                change: this.selectUpload
            },
            'detailsAttachment radio[action=linkUrl]': {
                change: this.selectLinkUrl
            }
        });

    },

    /**
     * Select upload a file
     * @param {} item
     */
    selectUpload: function(item) {
        if (item.checked)
            item.up('form').down('radio[action=linkUrl]').setValue(false);
    },

    /**
     * Select set an url
     * @param {} item
     */
    selectLinkUrl: function(item) {
        if (item.checked)
            item.up('form').down('radio[action=upload]').setValue(false);
    },

    /**
     * When change file url, select upload a file
     * @param {} item
     * @param {} value
     */
    fileSelected: function(item, value) {
        item.up('form').down('radio[action=upload]').setValue(true);
    },

    /**
     * When change url, select set an url
     * @param {} textField
     * @param {} newValue
     * @param {} oldValue
     * @param {} options
     */
    urlSelected: function(textField, newValue, oldValue, options) {
        textField.up('form').down('radio[action=linkUrl]').setValue(true);
    },

    /**
     * Cancel button clicked
     * @param {} button
     */
    closeWin: function(button) {
        var win = button.up('window');
        if (win)
            win.close();
    },

    /**
     * On save button clicked, chek the form is correctly filled
     * @param {} button
     */
    checkFilledForm: function(button) {
        var win = button.up('form');
        var name = win.down('textfield[name=name]').value;
        if (win.down('radio[action=upload]').checked) {
            var uplFile = win.down('fileuploadfield[name=selectFile]').value;
            if (uplFile != null)
                var isFile = true;
            else
                var isFile = false;
        } else {
            var url = win.down('textfield[name=fileUrl]').getValue();
            if (url != "")
                var isFile = true;
            else
                var isFile = false;
        }
        if (name != "" && isFile) {
            this.saveAttachment(button, win);
        } else {
            Ext.MessageBox.alert('Fields required', 'You need give a name and either upload a file or give an Url!')
        }
    },

    /**
     * Do save of the attachement
     * @param {} button
     * @param {} win
     */
    saveAttachment: function(button, win) {
        if (win.addNew) {
            var action = 'add';
        } else {
            var action = 'update';
        }
        if (win.down('radio[action=upload]').checked) {
            var form = win.getForm();
            if (form.isValid()) {
                var me = this;
                MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                    if (!isExpired) {
                        form.submit({
                            url: 'resources/src/php/file-upload.php',
                            waitMsg: 'Uploading your file...',
                            success: function(fp, result) {
                                var json = Ext.decode(result.response.responseText);
                                me.addTmpAttachment(win,
                                    win.down('textfield[name=name]').value,
                                    win.down('textfield[name=author]').value,
                                    win.down('textarea[name=description]').value,
                                    json["url"],
                                    "upload",
                                    action,
                                    json["path"],
                                    win.parent.idTmpAttachment);
                                win.parent.idTmpAttachment--;
                                var pwin = win.up('window');
                                if (pwin) {
                                    pwin.close();
                                }
                            },
                            failure: function(fp, result) {
                                var response = Ext.decode(result.response.responseText);
                                Ext.MessageBox.alert('FAILED', response["message"]);
                            }
                        });
                    }
                });


            } else {
                Ext.MessageBox.alert('FAILED!', 'Form invalid!');
            }
        } else {
            if (action == 'add') {
                this.addTmpAttachment(win,
                    win.down('textfield[name=name]').value,
                    win.down('textfield[name=author]').value,
                    win.down('textarea[name=description]').value,
                    win.down('textfield[name=fileUrl]').getValue(),
                    "link",
                    action,
                    "null",
                    win.parent.idTmpAttachment);
                win.parent.idTmpAttachment--;
            } else {
                this.addTmpAttachment(win,
                    win.down('textfield[name=name]').value,
                    win.down('textfield[name=author]').value,
                    win.down('textarea[name=description]').value,
                    win.down('textfield[name=fileUrl]').getValue(),
                    "link",
                    action,
                    "null",
                    win.data["id"]);
            }
            var pwin = win.up('window');
            if (pwin) {
                pwin.close();
            }
        }
    },

    /**
     * Add an attachment to the comment (temp, before saving)
     * @param {} win: the parent window
     * @param {} name: name of the attachment
     * @param {} author: author of the attachment
     * @param {} description: description of the attachment
     * @param {} url: url of the attachment
     * @param {} type: type of the attachment
     * @param {} action: update or add (new)
     * @param {} path: path of the attachment (for uploaded attachments)
     * @param {} id: MySQL id of the attachment
     */
    addTmpAttachment: function(win, name, author, description, url, type, action, path, id) {
        var attach = {
            'name': name,
            'author': author,
            'description': description,
            'url': url,
            'type': type,
            'action': action,
            'path': path,
            'id': id
        };
        if (action == 'update') {
            var oldAction = 'update';
            for (var it = 0; it < win.parent.tmpAttachments.length; it++) {
                if (win.parent.tmpAttachments[it] != null && win.parent.tmpAttachments[it]["id"] == id) //Left side of && is checked before right side, so it's perfect :-D
                {
                    attach['action'] = win.parent.tmpAttachments[it]['action'];
                    attach['type'] = win.parent.tmpAttachments[it]['type'];
                    if (attach['url'] == win.parent.tmpAttachments[it]['url']) {
                        attach['path'] = win.parent.tmpAttachments[it]['path'];
                    }
                    delete win.parent.tmpAttachments[it]; //NOTICE: item becomes null in the array, not disapears. Keep that in mind ;-)
                }
            }
        }
        win.parent.tmpAttachments.push(attach);
        if (action == 'add') {
            win.storeAtt.add({
                id: id,
                nameDoc: name,
                filePath: url,
                author: author,
                desc: description,
                type: attach['type']
            });
        } else if (action == 'update') {
            var index = win.storeAtt.findExact('id', id);
            var rec = win.storeAtt.getAt(index);
            rec.set('nameDoc', name);
            rec.set('filePath', url);
            rec.set('author', author);
            rec.set('desc', description);
            rec.set('type', attach['type']);
        }
    },

    /**
     * Open attachment in a new tab
     * @param {} button: button clicked
     */
    openAttachment: function(button) {
        var win = button.up('form');
        var url = win.data['filePath'];
        window.open(url, '_blank');
    }

});