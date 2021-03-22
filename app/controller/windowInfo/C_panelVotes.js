/**
 * C_panelVotes
 * Controls panelVotes events.
 */

Ext.define('MetExplore.controller.windowInfo.C_panelVotes', {
    extend: 'Ext.app.Controller',
    voteButtons: ["objectExists", "objectNotExists", "objectNoIdea", "objectHasErrors"],

    init: function() {
        this.control({
            'panelVotes button[action=objectExists]': {
                click: this.toggleButton
            },
            'panelVotes button[action=objectHasErrors]': {
                click: this.toggleButton
            },
            'panelVotes button[action=objectNotExists]': {
                click: this.toggleButton
            },
            'panelVotes button[action=objectNoIdea]': {
                click: this.toggleButton
            },
            'panelVotes button[action=detailsVotes]': {
                click: this.detailsVotes
            }
        });

    },

    /**
     * One vote button is clicked
     * @param {} button: the clicked button
     */
    toggleButton: function(button) {
        if (button.pressed) {
            var typeObj = button.up('panelVotes').typeObj;
            button.setText("<b style=\"font-size: 115%; color: grey;\"><u>" + button.text + "</u></b>"); //Color is grey until the update in BDD is not successfuly updated
            for (var it = 0; it < this.voteButtons.length; it++) {
                var button1 = button.up('window').down('button[action=' + this.voteButtons[it] + ']');
                if (!button1.pressed)
                    button1.setText(button1.text.replace(/<\/?b[^>]*"><\/?u>/, ""));
            }
            this.updateVoteReaction(button.action, button);
        } else {
            button.toggle(true);
        }

    },

    /**
     * Update vote in BDD and then in window
     * @param {} choice
     * @param {} button
     */
    updateVoteReaction: function(choice, button) {
        var idObject = button.up('panelVotes').idObj;
        var typeObject = button.up('panelVotes').typeObj;
        Ext.Ajax.request({
            url: 'resources/src/php/dataNetwork/dataVotePresence.php',
            params: {
                choice: choice,
                idObject: idObject,
                type: typeObject,
                idUser: MetExplore.globals.Session.idUser
            },
            failure: function(response, opts) {
                Ext.MessageBox
                    .alert('Ajax error',
                        'Update vote value failed!');
                button.setText(button.text.replace(/<\/?b[^>]*"><\/?u>/, ""));
                button.toggle(false)
            },
            success: function(response, opts) {
                var repJson = Ext.decode(response.responseText);
                if (repJson["success"]) {
                    button.setText(button.text.replace("color: grey", "color: black")); //As BDD successful, color is back to black
                    //Update results:
                    button.up('panelVotes').query("label[name='voteTotal']")[0].setText(String(repJson['nbTotal']));
                    button.up('panelVotes').query("label[name='voteYes']")[0].setText(String(repJson['nbYes']) + " (" + String(repJson['nbYesPct']) + "%)");
                    button.up('panelVotes').query("label[name='voteNo']")[0].setText(String(repJson['nbNo']) + " (" + String(repJson['nbNoPct']) + "%)");
                    button.up('panelVotes').query("label[name='voteYesNo']")[0].setText(String(repJson['nbHasErrors']) + " (" + String(repJson['nbHasErrorsPct']) + "%)");
                    button.up('panelVotes').up('window').down('panel[name=votePanel]').setTitle("<b>Votes for this " + typeObject + " (" + repJson['nbTotal'] + ")</b>")

                    //Reload grid to update vote
                    var type = button.up('panelVotes').typeObj;
                    var object = type.charAt(0).toUpperCase() + type.slice(1);
                    var store = Ext.getStore("S_" + object);

                    store.load();
                } else {
                    Ext.MessageBox
                        .alert('Ajax error',
                            repJson["message"]);
                    button.setText(button.text.replace(/<\/?b[^>]*"><\/?u>/, ""));
                    button.toggle(false)
                }
            }
        });
    },

    /**
     * See who votes for what
     * @param {} button: button clicked
     */
    detailsVotes: function(button) {
        var idObject = button.up('panelVotes').idObj;
        var typeObject = button.up('panelVotes').typeObj;
        var win_Info = Ext.create('Ext.window.Window', {
            title: 'Details of voters',
            width: 400,
            height: 400,
            layout: 'fit',
            items: [{
                xtype: 'gridDetailsVotes',
                idObject: idObject,
                typeObject: typeObject
            }],
            bbar: ['->', {
                xtype: 'button',
                text: 'Close',
                action: 'close',
                handler: function(button) {
                    button.up('window').close();
                }
            }]
        });
        win_Info.show();
        win_Info.focus();
    }

});