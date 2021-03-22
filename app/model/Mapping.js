/**
 * Model to handle List of Mappings liste des mappings effectues
 * id : M<num>	<num> = numero du mapping
 * object : objet sur leque a ete fait le mapping (par defaut : Metabolite)
 * element : element sur lequel a ete fait le mapping (par defaut : dbIdentifier)
 * ListId : liste des id mysql qui ont ete mappes
 */

Ext.define('MetExplore.model.Mapping', {
		extend : 'Ext.data.Model',
		fields : [ 
			{name : 'id'},
			{name : 'name'},
			{name : 'object'},
			{name : 'element'},
			{name : 'numero'},
			{name : 'idBioSource'},
			{name : 'Listid', type:'auto'}
		]
    });