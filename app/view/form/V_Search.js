Ext.define('MetExplore.view.form.V_Search', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.searchtrigger',
    emptyText:'exact sub-string search',
    triggerCls: 'x-form-clear-trigger',
    //trigger2Cls: 'x-form-search-trigger',
    //trigger3Cls: 'x-form-search-trigger',
    onTriggerClick: function() {
        this.setValue('');
        //this.setFilter(this.up().dataIndex, '');
    },

    setFilter: function(filterId, value){
        //console.log(storeId);
        var store = this.up('grid').getStore();
        if(value){
            //console.log(this);
            //store.removeFilter(filterId, false);
            var filter = {id: filterId, property: filterId, value: value};
            if(this.anyMatch) filter.anyMatch = this.anyMatch;
            if(this.caseSensitive) filter.caseSensitive = this.caseSensitive;
            if(this.exactMatch) filter.exactMatch = this.exactMatch;
            if(this.operator) filter.operator = this.operator;
            //console.log(this.anyMatch, filter)
            //console.log('filter',filter);
            store.addFilter(filter);
        }
    },

    SearchDel : function(){
        var me= this;
        return new Promise(function(resolve, reject) {
            var store = me.up('grid').getStore();
            var object = me.up('grid').config.typeObject;
            if (object == "Compartment") object = "CompartmentInBioSource";

            //remettre filtre contenu dans le storeFilter
            store.clearFilter(true);
            var storeFilter = Ext.getStore('S_Filter');

            storeFilter.each(function (rec) {
                var ids = rec.get(object).replace(/,/g, "|");
                var res = "/".concat(ids, "/");
                store.filter("id", eval(res));
            });

            //remettre search des autres colonnes
            //remettre les search
            var grid= me.up('grid');
            var gridCol= grid.columns;
            for (var j=0 ;j<gridCol.length; j++){
                //console.log('j',gridCol[j]);
                if (gridCol[j].items.items != undefined && gridCol[j].items.items[0] != undefined && gridCol[j].items.items[0].value != undefined && gridCol[j].items.items[0].value !='')
                {
                    if (gridCol[j].items.items[0].search == "fuzzy") {
                        MetExplore.globals.StoreUtils.fuzzysearch(gridCol[j].items.items[0].value);
                    } else {
                        var filter = {id: gridCol[j].dataIndex,  property: gridCol[j].dataIndex, value: gridCol[j].items.items[0].value, anyMatch:true};
                        grid.getStore().addFilter(filter);
                    }
                }
            }
            if (j==gridCol.length) resolve();
            //console.log('resolve');
        });
    },

    listeners: {
        render: function(){
            var me = this;
            me.ownerCt.on('resize', function(){
                me.setWidth(this.getEl().getWidth())
            })
        },
        change: function() {
            console.log('val:',this.getValue());
            if (this.getValue()!='') {
                if(this.autoSearch) this.setFilter(this.up().dataIndex, this.getValue())
            } else {
                var me= this;
                //console.log('del');
                var p= me.SearchDel();
                //console.log('refresh');
                p.then(me.up('grid').getView().refresh());
            }

        }
    }
})