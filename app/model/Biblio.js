/**
 * Data biblio
 */

    Ext.define('MetExplore.model.Biblio', {
        extend: 'Ext.data.Model',
        fields: [{name:'idReaction',type:'string'},
        		 {name:'idBiblio',type:'string'},
        		 {name:'pubmedid',type:'string'},
        		 {name:'title',type:'string'},
        		 {name:'authors',type:'string'},
        		 {name:'Journal',type:'string'},
        		 {name:'Year',type:'string'}
        		]
    });
