/**
 * MetExplore.override.form.field.VTypes
 */
Ext.define('MetExplore.override.form.field.VTypes', {
   override: 'Ext.form.field.VTypes',

       /**
        * validation function
        */
   dbIdentifier: function(value, field ){
       
       if(field.up("addGenericForm").passedRecord && field.up("addGenericForm").passedRecord.get('dbIdentifier')===value){
           return true;
       }

       return this.dbIdentifierRe.test(value);
   },
   dbIdentifierRe: /^[a-zA-Z_][a-zA-Z0-9_]*$/,

   dbIdentifierText:'Entity identifiers cannot start by a number and must only contain letters numbers and "_".',
   dbIdentifierMask:/[a-z0-9_]/i
});