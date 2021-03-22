/**
 * C_ShareBioSource
 */
Ext.define('MetExplore.controller.C_ShareBioSource', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['form.V_ShareBioSource']
    },
    init: function() {
        this.control({
            'treeUsers': {
                itemcontextmenu: this.editMenu
            }
        });

    },


    editMenu: function(tree, record, item, index, e, eOpts) {
        // devalide le menu contextuel du navigateur
        e.preventDefault();
        // si grid panel est Reaction mettre visible le menu copy to cart

        treeUsers.CtxMenu = new Ext.menu.Menu({
            items: [{
                text: 'Delete',
                //hidden : copy,
                handler: function() {
                    console.log('del');
                    //					var reaction = Ext.getStore('S_Reaction');
                    //					nb = reaction.getCount();
                    //					var liste = reaction.getRange(0, nb);
                    //					var cart = Ext.getStore('S_Cart');
                    //					cart.add(liste);
                }
            }]
        });
        // positionner le menu au niveau de la souris
        treeUsers.CtxMenu.showAt(e.getXY());
    }
});