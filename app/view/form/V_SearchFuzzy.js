Ext.define('MetExplore.view.form.V_SearchFuzzy', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.searchfuzzytrigger',
    emptyText:'fuzzy search',
    triggerCls: 'x-form-clear-trigger',
    //trigger1Cls: '',
    trigger2Cls: 'x-form-search-trigger',
    //trigger3Cls: 'searchexact',
    //triggerBaseCls: 'x-form-search-trigger',
    search:'fuzzy',
    //trigger3Cls: 'x-form-search-trigger',

    onTriggerClick: function() {
        if (this.search=='fuzzy') this.emptyText= 'fuzzy search';
        else this.emptyText= 'exact sub-string search';
        this.applyEmptyText();
        this.setValue('');

    },

    //fuzzy search
    onTrigger2Click: function() {
        var me= this;
        if (me.search=='fuzzy') {
            me.emptyText= 'exact sub-string search';
            me.applyEmptyText();
            me.search='exact';
            me.triggerEl.elements[1].dom.setAttribute('data-qtip', 'exact sub-string search TO fuzzy search');
        } else {
            me.emptyText= 'fuzzy search';
            me.applyEmptyText();
            me.search='fuzzy';
            me.triggerEl.elements[1].dom.setAttribute('data-qtip', 'fuzzy search TO exact sub-string search');
        }
        me.fireEvent('change');

    },


    setFilterFuzzy: function(filterId, value){
        var store = this.up('grid').getStore();
        if(value){
            store.removeFilter(filterId, false)
            var filter = {id: filterId, property: filterId, value: value};
            if(this.anyMatch) filter.anyMatch = this.anyMatch
            if(this.caseSensitive) filter.caseSensitive = this.caseSensitive
            if(this.exactMatch) filter.exactMatch = this.exactMatch
            if(this.operator) filter.operator = this.operator
            //console.log(this.anyMatch, filter)
            store.addFilter(filter)
        } else {
            var me= this;
            var p= me.SearchDelFuzzy();
            p.then(me.up('grid').getView().refresh());        }
    },

    SearchDelFuzzy : function(){
        console.log('del fuzzy');
        var me= this;
        return new Promise(function(resolve, reject) {
            var storeM= Ext.getStore('S_Metabolite');
            storeM.clearFilter(true);

            var storeFilter= Ext.getStore('S_Filter');
            var ctrl= MetExplore.app.getController('C_GenericGrid');
            storeFilter.each(function(rec) {
                ctrl.filterStore('S_Metabolite',rec.get("Metabolite"));
            });

            //remettre les search
            var grid= me.up('grid');
            var gridCol= grid.columns;
            for (j=0 ; j<gridCol.length; j++){
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
            resolve();
        });
    },


    listeners: {
        render: function(c){
            var me = this;
            me.ownerCt.on('resize', function(){
                me.setWidth(this.getEl().getWidth())
            });
            me.triggerEl.elements[1].dom.setAttribute('data-qtip', 'fuzzy search TO exact sub-string search');
            //me.triggerEl.elements[2].dom.setAttribute('data-qtip', 'exact sub-string search');
        },

        change: function() {
            if (this.getValue()!='') {
                if (this.search=='fuzzy') {
                    MetExplore.globals.StoreUtils.fuzzysearch(this.getValue());
                } else {
                    if (this.search=='exact') {
                        this.setFilterFuzzy(this.up().dataIndex, this.getValue())
                    }
                }
            } else {
                var me= this;
                var p= me.SearchDelFuzzy();
                p.then(me.up('grid').getView().refresh());
            }
        }
    }
})