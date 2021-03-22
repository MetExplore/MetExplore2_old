/**
 * C_DisplayCytoscapeWebStartWindow
 */
Ext.define('MetExplore.controller.C_DisplayCytoscapeWebStartWindow', {
	extend : 'Ext.app.Controller',
	requires : ['MetExplore.globals.Session'],

//	config : {
//		views : ['button.V_CytoscapeWebStartButton']
//	},

	sifFile : "",
	ids : "",
	idsInBio : "",
	idBioSource : -1,
	metabolite_ids : "",
	attributes : [],
	attributePath : "",
	win_wait : null,

	attributeIdentified : {},
	attributeType : {},
	attributeSbmlName : {},
	attributePathways : {},

	pathways : {},

	/**
	 * init function Checks the changes on the bioSource selection
	 * 
	 */
	init : function() {

		this.control({
					'cytoscapeWebStartButton' : {
						click : this.displayWindow
					}
				});
	},

	displayWindow : function(button) {
		//delete cookies
			MetExplore.globals.Utils.removeGridCookies();

		// Get current idBioSource
		var currentBioSource = MetExplore.globals.Session.idBioSource;

		if (currentBioSource == -1) {
			Ext.MessageBox.alert('Failed', 'Please first load a BioSource');
			return;
		}

		this.idBioSource = MetExplore.globals.Session.idBioSource;

		// Display wait window

		var win_wait = Ext.create("Ext.window.MessageBox");

		win_wait.wait("Loading...", "Please Wait");

		this.win_wait = win_wait;

		// Get cart data
		var cart_store = Ext.getStore("S_Cart");

		var n_records = cart_store.count();

		var idsInBio = "";

		var ids = "";

		for (var i = 0; i < n_records; i++) {
			var record = cart_store.getAt(i);

			var idInBio = record.data.idInBio;

			var id = record.data.id;

			if (i == 0) {
				idsInBio = idInBio;
				ids = id;
			} else {
				idsInBio = idsInBio + "," + idInBio;
				ids = ids + "," + id;
			}
		}

		this.idsInBio = idsInBio;
		this.ids = ids;

		this.createSifFile();

	},

	createSifFile : function() {

		Ext.Ajax.request({
					url : 'resources/src/php/cytoscape/createSifFile.php',
					scope : this,
					method : 'POST',
					params : {
						ids : this.idsInBio
					},
					timeout: 2200000,
					failure : function(response, opts) {
						Ext.MessageBox
								.alert('Ajax error',
										'Creation of the sif file by the server has failed');
						this.win_wait.close();
					},
					beforerequest: function() {
				//supprimer les cookies
						MetExplore.globals.Utils.removeGridCookies();

					},
					success : function(response, opts) {

						var json = null;

						try {
							json = Ext.decode(response.responseText);

							if (json["success"] == false) {
								Ext.MessageBox.alert('Server error',
										'Creation of the sif file by the server has failed. Error : '
												+ json.message);
								this.win_wait.close();
							}

							this.sifFile = json.path;

							// Gets the metabolite ids corresponding to the
							// reaction
							// ids
							this.getMetaboliteIdsFromReactionIds();
						} catch (err) {
							Ext.MessageBox.alert('Ajax error',
									'Error when creating the sif file. Error: '
											+ err);
							this.win_wait.close();

						}

					}
				});

	},

	/**
	 * Gets the metabolite ids corresponding to the reaction ids
	 */
	getMetaboliteIdsFromReactionIds : function() {

		var ids = this.ids;

		Ext.Ajax.request({
			url : 'resources/src/php/metabolitesFromReactions.php',
			scope : this,
			params : {
				ids : ids
			},
			timeout: 2200000,
			failure : function(response, opts) {
				Ext.MessageBox
						.alert(
								'Ajax error',
								'Getting the list of metabolites corresponding to the cart by the server has failed');
				this.win_wait.close();
			},
			success : function(response, opts) {

				var json = null;

				try {

					json = Ext.decode(response.responseText);

					if (json["success"] == false) {
						Ext.MessageBox
								.alert(
										'Ajax error',
										'Problem in getting the list of metabolites corresponding to the cart by the server. <br />Error: '
												+ json["message"]);
						this.win_wait.close();
					} else {

						this.metabolite_ids = json["ids"];

						this.getMetabolitePathways(this.metabolite_ids);

					}

				} catch (err) {
					Ext.MessageBox
							.alert(
									'Ajax error',
									'Error when getting the list of metabolites from the list of reactions. Error: '
											+ err);
					this.win_wait.close();
				}

			}

		});
	},

	/**
	 * 
	 * @param {}
	 *            a_ids
	 */
	getMetabolitePathways : function(ids) {

		Ext.Ajax.request({
			url : 'resources/src/php/pathwaysFromMetabolites.php',
			scope : this,
			params : {
				ids : ids,
				idBioSource : this.idBioSource
			},
			timeout: 2200000,
			failure : function(response, opts) {
				Ext.MessageBox
						.alert(
								'Ajax error',
								'Getting the list of pathways corresponding to the metabolites in the cart by the server has failed');
				this.win_wait.close();
			},
			success : function(response, opts) {

				var json = null;

				try {

					json = Ext.decode(response.responseText);

					if (json["success"] == false) {
						Ext.MessageBox
								.alert(
										'Ajax error',
										'Getting the list of pathways corresponding to the metabolites in the cart by the server has failed<br />Error: '
												+ json["message"]);
						this.win_wait.close();
					} else {

						this.pathways["Metabolite"] = json["results"];

						this.getReactionPathways(this.ids);

					}

				} catch (err) {
					Ext.MessageBox
							.alert(
									'Ajax error',
									'Getting the list of pathways corresponding to the metabolites in the cart by the server has failed. Error: '
											+ err);
					this.win_wait.close();
				}
			}
		});
	},

	/**
	 * 
	 * @param {}
	 *            a_ids
	 */
	getReactionPathways : function(ids) {
		
		Ext.Ajax.request({
			url : 'resources/src/php/pathwaysFromReactions.php',
			scope : this,
			params : {
				ids : ids,
				idBioSource : this.idBioSource
			},
			timeout: 2200000,
			failure : function(response, opts) {
				Ext.MessageBox
						.alert(
								'Ajax error',
								'Getting the list of pathways corresponding to the reactions in the cart by the server has failed');
				this.win_wait.close();
			},
			success : function(response, opts) {

				var json = null;

				try {

					json = Ext.decode(response.responseText);

					if (json["success"] == false) {
						Ext.MessageBox
								.alert(
										'Ajax error',
										'Getting the list of pathways corresponding to the reactions in the cart by the server has failed<br />Error: '
												+ json["message"]);
						this.win_wait.close();
					} else {

						this.pathways["Reaction"] = json["results"];

						this.createAttributes();

					}

				} catch (err) {
					Ext.MessageBox
							.alert(
									'Ajax error',
									'Getting the list of pathways corresponding to the reactions in the cart by the server has failed. Error: '
											+ err);
					this.win_wait.close();
				}

			}

		});
	},

	/**
	 * 
	 */
	createAttributes : function() {
		
		// Inits generic attributes
		// identified attribute
		this.attributeIdentified.name = "identified";
		this.attributeIdentified.type = "String";
		this.attributeIdentified.key_values = [];
		// pathways attribute
		this.attributePathways.name = "pathways";
		this.attributePathways.type = "String";
		this.attributePathways.key_values = [];
		// type attribute
		this.attributeType.name = "sbml type";
		this.attributeType.type = "String";
		this.attributeType.key_values = [];
		// sbml name attribute
		this.attributeSbmlName.name = "sbml name";
		this.attributeSbmlName.type = "String";
		this.attributeSbmlName.key_values = [];

		// metabolite attributes
		var metabolite_ids = this.metabolite_ids;
		var a_metabolite_ids = metabolite_ids.split(",");
		this.setAttributes(a_metabolite_ids, "Metabolite");

		// reaction attributes
		var a_reaction_ids = this.ids.split(",");
		this.setAttributes(a_reaction_ids, "Reaction");

		this.attributes.push(this.attributeType);
		this.attributes.push(this.attributeIdentified);
		this.attributes.push(this.attributePathways);
		// this.attributes.push(this.attributeSbmlName);

		this.createAttributeFile();
	},

	/**
	 * Creates the attribute file in the server and creates the Cytoscape
	 * session in the callback
	 */
	createAttributeFile : function() {
		
		var attributes = this.attributes;

		var str_attributes = Ext.encode(attributes);

		// Create the temporary file
		Ext.Ajax.request({
					url : 'resources/src/php/createFileFromText.php',
					scope : this,
					params : {
						ext : "json",
						pre : "attributes",
						text : str_attributes
					},
					timeout: 2200000,
					failure : function(response, opts) {
						Ext.MessageBox.alert('Ajax error',
								'Creating the attribute file has failed');
						this.win_wait.close();
					},
					success : function(response, opts) {

						var json = null;

						try {

							json = Ext.decode(response.responseText);

							if (json["success"] == false) {
								Ext.MessageBox.alert('Ajax error',
										'Problem in creating the attribute file. Error: '
												+ json["message"]);
								this.win_wait.close();
							} else {

								this.attributePath = json["path"];

								// Creation of the jnlp file
								this.createJnlpFile();
							}
						} catch (err) {
							Ext.MessageBox.alert('Ajax error',
									'Error when creating the attribute file. Error: '
											+ err);
							this.win_wait.close();
						}
					}
				});
	},

	/**
	 * Creates the jnlp file used to launch Cytoscape Web Start
	 */
	createJnlpFile : function() {
		
		var attributePath = this.attributePath;
		var sifPath = this.sifFile;

		Ext.Ajax.request({
					url : 'resources/src/php/cytoscape/createCytoscapeLink.php',
					scope : this,
					params : {
						sif_path : sifPath,
						json_attribute_file : attributePath
					},
					timeout: 2200000,
					failure : function(response, opts) {
						Ext.MessageBox.alert('Ajax error',
								'Creating the jnlp file has failed');
						this.win_wait.close();
					},
					success : function(response, opts) {

						var json = null;

						try {

							json = Ext.decode(response.responseText);

							if (json["success"] == false) {
								Ext.MessageBox.alert('Ajax error',
										'Problem in creating the jnlp file. Error: '
												+ json["message"]);
								this.win_wait.close();
							} else {

								var url = json["url"];
								
								window.location.assign(url);
								
								this.win_wait.close();

							}
						} catch (err) {
							Ext.MessageBox.alert('Ajax error',
									'Error when creating the Cytoscape session file. Error: '
											+ err);
						}
					}
				});

	},

	/**
	 * Internal function used for setting attributes
	 * 
	 * @param {}
	 *            a_object_ids
	 * @param {}
	 *            type : Reaction or metabolite
	 */
	setAttributes : function(a_object_ids, object_type) {
		console.log("attributes ",object_type);
		var object_grid = Ext.getCmp('grid' + object_type);

		var object_grid_store = object_grid.getStore();

		// var object_model = Ext.ModelManager.getModel("MetExplore.model."
		// + object_type);

		var object_model = object_grid_store.getProxy().getModel();

		var object_fields = object_model.getFields();

		var object_Store = Ext.getStore('S_' + object_type);

		var all_pathways = this.pathways[object_type];

		// Create attributes from the column grids
		attributes_from_grid = [];
		var columns = object_grid.columnManager.getColumns();

		Ext.each(columns, function(column, index) {

					if (!column.isHidden()) {

						var field_name = column.dataIndex;

						if (field_name != null && field_name != "") {

							var attribute = {};

							attribute.key_values = [];

							attribute.field_name = field_name;

							if (field_name == "reversible") {
								attribute.name = "reversibility";
							} else if (field_name == "name") {
								attribute.name = "sbml name";
							} else {
								// Test if the text contains only spaces

								if (/^\s*$/.test(column.text)) {
									attribute.name = field_name;
								} else {

									// Check if the column is a sub column
									var supColumn = column.up("gridcolumn");
									console.log(supColumn);

									if (supColumn != undefined) {
										var title= supColumn.text.split("&nbsp")[0];
										title= title.split("<div>")[1];
										attribute.name = title + "__"
												+ column.text;
									} else {
										attribute.name = column.text;
									}
								}
							}

							attributes_from_grid.push(attribute);
						}

					}

				});

		for (var index_object = 0; index_object < a_object_ids.length; index_object++) {
			var object_id = a_object_ids[index_object];

			var object_id = a_object_ids[index_object];

			var object = object_Store.getById(object_id);

			var idToPrint = "M_";

			if (object_type == "Reaction") {
				var idToPrint = "R_"
			}

			idToPrint += object_id;

			if (object != null) {
				var mapInt = object.get('mapped');

				if (mapInt != 0 && !typeof(mapInt) !== "undefined") {
					this.attributeIdentified.key_values.push({
								"id" : idToPrint,
								"value" : "identified"
							});
				}
			}

			if (object_type == "Metabolite") {
				this.attributeType.key_values.push({
							"id" : idToPrint,
							"value" : "species"
						});
			} else {
				this.attributeType.key_values.push({
							"id" : idToPrint,
							"value" : "reaction"
						});
			}

			// Get pathways
			var a_pathways = all_pathways[object_id];

			var pathwayStr = "(";

			var nPathways = 0;

			Ext.Array.each(a_pathways, function(pathway) {

						var pathwayName = pathway["name"];

						// Replace brackets so that Cytoscape does not take
						// into
						// account the attribute as a list

						pathwayName = pathwayName.replace("(", "[");
						pathwayName = pathwayName.replace(")", "]");

						if (nPathways > 0) {
							pathwayStr += "::";
						}

						pathwayStr += pathwayName;
						nPathways++;

					});

			pathwayStr += ")";

			this.attributePathways.key_values.push({
						"id" : idToPrint,
						"value" : pathwayStr
					});

			var record = object_grid_store.getById(object_id);

			if (record != null) {

				// Fills the attributes created from the grid columns
				Ext.Array.each(attributes_from_grid, function(attribute) {

					var field_name = attribute.field_name;

					// C'est ici que ca se passe
					var idx = Ext.Array.indexOf(object_fields, field_name);

					var field = Ext.Array.findBy(object_fields, function(item,
									index) {
								if (item.name == field_name) {
									return true;
								}
								return false;
							});

					var type = "string";

					if (field != null) {
						type = field.type;
					}

					if (type == "float" || type == "number") {
						attribute.type = "Double";
					} else if (type == "int") {
						attribute.type = "Integer";
					} else {
						attribute.type = "String";
					}

					var isNumber = false;
					if (attribute.type == "Double"
							|| attribute.type == "Integer") {
						isNumber = true;
					}

					var value = record.data[field_name];

					if (value != undefined) {

						if (type == "bool") {
							if (value == 1) {
								value = "true";
							} else {
								value = "false";
							}
						}

						// Replace brackets so that Cytoscape does not take into
						// account the attribute as a list
						if (attribute.type == "String") {
							// Replace brackets so that Cytoscape does not take
							// into
							// account the attribute as a list

							value = String(value).replace("(", "[");
							value = String(value).replace(")", "]");

						}

						if (value != "" && !(isNumber == true && isNaN(value))) {

							attribute.key_values.push({
										"id" : idToPrint,
										"value" : value
									});
						}
					}
				}

				);

			}
		}

		/**
		 * We add an attribute from grid only if there are some data inside
		 */
		Ext.Array.each(attributes_from_grid, function(attribute) {
					if (Object.keys(attribute).length > 0) {
						this.attributes.push(attribute);
					}
				}, this);

	}

});
