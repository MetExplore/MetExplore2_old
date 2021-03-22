/**
 * genericGrid
 * definition des grid panel pour chaque store
 * colonne action (ex: Del/Add)
 * plugin edition / drag&drop
 * barre action (ex: commit)
 */
Ext.define('MetExplore.view.grid.V_GenericGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.genericGrid',
	config: {
		hiddenColumns: []
	},

	features : [{
		menuFilterText  : 'Search',
		ftype : 'filters',
		local : true,
		autoReload: false,
		listeners: {
			change : function() {
				console.log('filter');

			},
			activate :function() {
                console.log('activate');

            },
			onFilterRemove:function() {
                console.log('onFilterRemove');

            },
		}
	}],
	// autoScroll: true,
	//stateful permet de ne pas avoir les cookies grid
	stateful : true,
	multiSelect : true,
	viewConfig : {
		stripeRows : true,
		enableTextSelection : true,
		plugins: {

			ptype: 'gridviewdragdrop',
			ddGroup :'genericDDgroup',
			enableDrop: false
		},
		copy:true
	},
	
	nColumnsToAdd : 0,
	nColumnsAdded : 0,
	rowsIndex : [],

/**
 * indexCol : search index of dataIndex column 
 * @param {} dataIndex
 */
	indexCol : function(dataIndex) {
		var columnNames = Ext.Array.pluck(this.headerCt.getGridColumns(), 'dataIndex');
		return columnNames.indexOf(dataIndex);
	},
	indexColHeader : function(header) {
		var columnNames = Ext.Array.pluck(this.headerCt.getGridColumns(), 'header');
		return columnNames.indexOf(header);
	},

	fieldCol : function(index) {
		var columnFields= Ext.Array.pluck(this.headerCt.getGridColumns(), 'dataIndex');
        var columnHidden= Ext.Array.pluck(this.headerCt.getGridColumns(), 'hidden');
		cols= new Array();
		for (var i=0; i<columnFields.length ; i++) {
			if (columnHidden[i]==false) {
				cols.push(columnFields[i]);
            }
		}
		//console.log(cols);
        //console.log(columnHidden);
		return cols[index];
	},


	/**
     * createCol : create a column in the grid
	 * @param {String} header		nom du header
	 * @param {String} dataIndex	field's store of the grid (1 store in 1 grid)
	 * @param {Boolean} hide		true column is added but hide
	 * @param {Integer} indice		where you insert column
	 * @param {String} id 			id in dom
	 *
	 */
	createCol: function(header, dataIndex, hide, indice, id, idsqlData) {
	    var col = Ext.create('Ext.grid.column.Column', {
    	    header : header,
            dataIndex : dataIndex,
            //filterable : true,
            sortable : true,
			tag_new: true,
			tag_id: idsqlData,
            headerId : id,
            hidden : hide
        });

        this.addCol(col, dataIndex, indice);
            //reconfigure la grid pour eviter les decalage d'affichage
	    this.reconfigure(this.store, this.initialConfig.columns);
	    //remove ext-grid cookie
		MetExplore.globals.Utils.removeGridCookies();
		//Ext.util.Cookies.clear('ext-gridMetabolite');
            //Ext.resumeLayouts(true);
    },

	createIdentifiersCol: function(header, dataIndex, listnewid) {
		var col = Ext.create('Ext.grid.column.Column', {
			header : header,
			dataIndex : dataIndex,
			//filterable : true,
			sortable : true,
			tag_new: true,
			hidden : true,
			//tdCls: 'id-column',
			renderer: function (value, meta, record, rowIndex, colIndex, store) {
				var id= record.get('id');
				if (listnewid.includes(id)) {
			 		meta.tdCls = 'x-grid-id-cell';
				}
			 	return value;
			}
		});

		this.addCol(col, dataIndex, 0);
		//reconfigure la grid pour eviter les decalage d'affichage
		this.reconfigure(this.store, this.initialConfig.columns);
		//remove ext-grid cookie
		MetExplore.globals.Utils.removeGridCookies();
		//Ext.util.Cookies.clear('ext-gridMetabolite');
		//Ext.resumeLayouts(true);
	},

	createCoverCol: function(header, dataIndex) {
		//console.log("create gridcol");
		var col = Ext.create('Ext.grid.column.Column', {
			header : header,
			dataIndex : dataIndex,
			//filterable : true,
			sortable : true,
			tag_new: true,
			hidden : true,
			renderer: function(value) {
				if (value < 25) {
					return '<span class="veryLowCompletude">' + value + ' %</span>';
				} else if (value < 50) {
					return '<span class="lowCompletude">' + value + ' %</span>';
				} else if (value < 75) {
					return '<span class="mediumCompletude">' + value + ' %</span>';
				} else {
					return '<span class="highCompletude">' + value + ' %</span>';
				}
			}
		});

		this.addCol(col, dataIndex, 0);
		//reconfigure la grid pour eviter les decalage d'affichage
		this.reconfigure(this.store, this.initialConfig.columns);
		//remove ext-grid cookie
		MetExplore.globals.Utils.removeGridCookies();
		//Ext.util.Cookies.clear('ext-gridMetabolite');
		//Ext.resumeLayouts(true);
	},


/**
 * createCol : create a column in the grid
 * @param {String} header		nom du header
 * @param {String} dataIndex	field's store of the grid (1 store in 1 grid)
 * @param {Boolean} hide		true column is added but hide
 * @param {Integer} indice		where you insert column
 * @param {String} id 			id in dom
 *
 */
	createEditableCol: function(header, dataIndex, hide, indice, id, idsqlData) {

    	//Ext.suspendLayouts();

		var col = Ext.create('Ext.grid.column.Column', {
			header : header,
			dataIndex : dataIndex,
			//filterable : true,
			sortable : true,
            tag_new: true,
            tag_id: idsqlData,
            editor: {
                allowBlank: false
            },
            headerId : id,
			hidden : hide
		});

		this.addCol(col, dataIndex, indice);
		//reconfigure la grid pour eviter les decalage d'affichage
    	this.reconfigure(this.store, this.initialConfig.columns);
    	//Ext.resumeLayouts(true);
		MetExplore.globals.Utils.removeGridCookies();
	},

	addCol: function(col, dataIndex, indice) {
		var columnNames = Ext.Array.pluck(this.headerCt.getGridColumns(), 'dataIndex');

		if (indice == undefined || indice ==0) {
			indice= this.columns.length;
		}
		/**
		 * controle que le dataIndex de la colonne a inserer n'existe pas
		 */
		if (columnNames.indexOf(dataIndex) == -1) {
			this.headerCt.insert(indice, col);
            this.columns.length= this.columns.length+1;
		}
	},



/**
 * createGroupCol : create Group column in the grid
 * @param {string} 	groupHeader
 * @param {array} 	header
 * @param {array} 	dataIndex	field's store of the grid (1 store in 1 grid)
 * @param {bool} 	hide		true column is added but hide
 * @param {integer} indice		where you insert column indefined= insert at the end
 */
	createGroupCol: function(groupHeader, header, dataIndex, hide, indice,id) {
		//console.log(id);
		var columns = new Array();
		var nbCol= header.length;
		//console.log('createCol dataindex :',dataIndex);
		var pathEnrichment= false;

		for (var i=0; i< nbCol; i++) {
			var col = Ext.create('Ext.grid.column.Column', {
									header : header[i],
									dataIndex : dataIndex[i],
									tag_new :true,
									//xtype : number,
									//renderer: Ext.util.Format.numberRenderer('0.0000000000'),
									//filterable : true,
									hideable : false,
									sortable : true
								});
			if (dataIndex[i].indexOf('pathEnrich')>-1) {
                pathEnrichment= true;
                col.tooltip= "Right tailed fisher test";
				col.renderer= function(value) {
					if (value===Number.POSITIVE_INFINITY)
						return ' ';
					else
                        return value.toExponential(2);
				}
			}

			if (dataIndex[i].indexOf('pathSignif')>-1 || dataIndex[i].indexOf('pathSignifBenjaminiHochberg')>-1) {
				var tip= "*** value<0.001<br>**&nbsp&nbsp  value<0.01<br>*&nbsp&nbsp&nbsp   value<0.05";
				if (dataIndex[i].indexOf('pathSignifBenjaminiHochberg')>-1) {
					tip= "Benjamini-Hochberg corrected p-value<br>"+tip;

				} else {
                    tip= "Bonferroni corrected p-value<br>"+tip;
				}
				col.tooltip= tip;
				col.renderer= function(value){
					var myValue= parseFloat(value);

					if (myValue<0.001) {
						return '***&nbsp('+myValue.toExponential(2)+')';
					} else {
						if (value<0.01) {
							return '**&nbsp&nbsp('+myValue.toExponential(2)+')';
						} else {
							if (value<0.05) {
								return '*&nbsp&nbsp&nbsp('+myValue.toExponential(2)+')';
							} else {
								if (value===Number.POSITIVE_INFINITY) {
									return ' ';
								} else {
									return '&nbsp&nbsp&nbsp&nbsp('+myValue.toExponential(2)+')';
								}
							}
							
						}
					}
				}
			}
			columns.push(col);	
		}
		if (pathEnrichment)		 {
            groupHeader= groupHeader+"&nbsp;&nbsp;<a href='https://metexplore.toulouse.inra.fr/metexplore-doc//mapping.php#mappingResults' target='_blank' class= 'button-help-grid' ><img src='./resources/icons/help.svg' width='15' height='15' /></a>";
            //OnMouseOver='this.width: 100px;' OnMouseOut='this.width: 80px;'
		}

		    groupHeader= '<div>'+groupHeader+"&nbsp;&nbsp;<img src='./resources/icons/delete.svg' width='15' height='15' class='icon-delete' style=\"cursor: pointer;\"  />"+'</div>';
		var me= this;
		var colGroup =
			Ext.create('Ext.grid.column.Column', {
				header : groupHeader,
				sortable : true,
				hidden : hide,
				headerId : id,
				tag_new: true,
				hideable : false,
				columns : columns,
				listeners: {
					'afterrender': function(el1) {
                        var grid= this.up();
						var el= el1.getEl().select('.icon-delete');
						if (el) { el.swallowEvent('click', true) }
						grid.mon(el, 'click', function () {
                            var ctrlMap=  MetExplore.app.getController('C_Map');
                            ctrlMap.removeMapping(el1.headerId);
						})
					}
				}
			});
		this.headerCt.insert(this.columns.length, colGroup);
		this.columns.length= this.columns.length+nbCol;

	MetExplore.globals.Utils.removeGridCookies();
				
	},

/**
 * colorRowMapped 
 */	
	colorRowMapped : function () {

		this.getView().getRowClass = function(record, index) {
			if (record.get('mapped') == 0)
				return 'colorTransparent';
			else
				return 'colorMapped';

			};
	},


        /**
		 *
         */
        removeCol: function(indice) {
            //if (indice>-1)
            this.headerCt.remove(indice);
            //console.log('indice:', indice);
        },

		removeColTag: function() {
        	console.log(this.getColumns());
		}
});
