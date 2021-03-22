/**
 * ToDolist
 */
Ext.define('MetExplore.model.TodoList', {
        extend: 'Ext.data.Model',
        fields: [{name: 'id', type: 'string'}, 'idUser','todo', 'idProject', 'project','user', 'limitDate', 'dateAjout', 'status', 'priority']
    });