/**
 * ReactionCreation
 */
Ext.define('MetExplore.model.ReactionCreation', {
        extend: 'Ext.data.Model',
        fields: [
        		{name:'coeff',type:'string'},
        		{name:'metabolite',type:'string'},
        		{name:'idMetabolite',type:'string'},
        		{name:'type',type:'string'},
        		{name:'cofactor',type:'boolean'},
        		{name:'side',type:'boolean'},
        		{name:'constantCoeff',type:'boolean'}]
    });
