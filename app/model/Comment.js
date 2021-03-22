/**
 * Comment
 */
    Ext.define('MetExplore.model.Comment', {
        extend: 'Ext.data.Model',
        fields: [{name:'idObj',type:'string'},
        		 {name:'typeObj',type:'string'},
        		 {name:'idComment',type:'string'},
        		 {name:'idUser', type:'int'},
        		 {name:'nameUser',type:'string'},
        		 {name:'text',type:'string'},
        		 {name:'title',type:'string'},
        		 {name:'type',type:'string'},
        		 {name:'attachments',type:'auto'}
        		]
    });
