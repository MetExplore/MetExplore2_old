/**
 * Allows to model the MetExplore external applications
 */

Ext.define('MetExplore.model.Application', {
            extend : 'Ext.data.Model',
            requires : ['MetExplore.model.ApplicationVariable'],

            fields : [{
                        name : 'name',
                        type : 'string'
                    }, {
                        name : 'description',
                        type : 'string'
                    }, {
                        name : 'package',
                        type : 'string'
                    }, {
                        name : 'java_class',
                        type : 'string'
                    }, {
                        name : 'require_login',
                        type : 'boolean'
                    },
                    {
                        name : 'require_bioSource',
                        type : 'boolean'
                    },
                    {
                        name : 'require_admin',
                        type : 'boolean'
                    },
                    {
                        name : 'send_mail',
                        type : 'boolean'
                    },
                    {
                        name : 'long_job',
                        type : 'boolean'
                    }

                    ],
            hasMany : [{
                        model : 'MetExplore.model.ApplicationVariable',
                        name : 'parameters',
                        associationKey : 'parameters',
                        primaryKey : 'name'
                    }]
        }); 