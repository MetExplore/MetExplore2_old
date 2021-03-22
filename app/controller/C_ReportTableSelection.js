/**
 * C_ReportTableSelection
 */

Ext.define('MetExplore.controller.C_ReportTableSelection', {
			extend : 'Ext.app.Controller',

			config : {
				views : ['form.V_JavaApplicationParametersForm',
						'form.V_SelectGenes']
			},

			/**
			 * init function Checks the changes on the bioSource selection
			 * 
			 */
			init : function() {

				this.control({
							'button[action=reportGeneSelection]' : {
								click : this.reportSelection
							},
							'button[action=reportReactionSelection]' : {
								click : this.reportSelection
							},
							'button[action=reportEnzymeSelection]' : {
								click : this.reportSelection
							},
							'button[action=reportProteinSelection]' : {
								click : this.reportSelection
							},
							'button[action=reportMetaboliteSelection]' : {
								click : this.reportSelection
							}
						});
			},
			
			reportSelection : function(button) {
				var fieldset = button.up("fieldset");

				var selectCombo = null;
				
				var panel = null;
				
				var network_data_panel = Ext.getCmp('networkData');
				
				if(button.action == "reportReactionSelection") {
					panel = network_data_panel.down("gridReaction");
					selectCombo = fieldset.down("selectReactions");
				}
				else if(button.action == "reportGeneSelection") {
					panel = network_data_panel.down("gridGene");
					selectCombo = fieldset.down("selectGenes");
				}
				else if (button.action == "reportEnzymeSelection") {
					panel = network_data_panel.down("gridEnzyme");
					selectCombo = fieldset.down("selectEnzymes");
				}
				else if (button.action == "reportProteinSelection") {
					panel = network_data_panel.down("gridProtein");
					selectCombo = fieldset.down("selectProteins");
				}
				else if (button.action == "reportMetaboliteSelection") {
					panel = network_data_panel.down("gridMetabolite");
					selectCombo = fieldset.down("selectMetabolites");
				}

				var valueField = selectCombo["valueField"];
				
				var nb = panel.getSelectionModel().getSelection().length;

				var a_values = [];

				for (var i = 0; i < nb; i++) {
					var rec = panel.getSelectionModel().getSelection()[i].get(valueField);
					a_values.push(rec);
				}

				selectCombo.setValue(a_values, false);
			},
			
			

			/**
			 * 
			 */
			reportGeneSelection : function(button) {

				var fieldset = button.up("fieldset");

				var selectGeneCombo = fieldset.down("selectGenes");

				var network_data_panel = Ext.getCmp('networkData');

				var gene_panel = network_data_panel.down("gridGene");

				var nb = gene_panel.getSelectionModel().getSelection().length;

				var a_values = [];

				for (var i = 0; i < nb; i++) {
					var rec = gene_panel.getSelectionModel().getSelection()[i].get("dbIdentifier");
					a_values.push(rec);
				}

				selectGeneCombo.setValue(a_values, false);

			},
			reportReactionSelection : function(button) {

				var fieldset = button.up("fieldset");

				var selectCombo = fieldset.down("selectReactions");
				
				var valueField = selectCombo["valueField"];

				var network_data_panel = Ext.getCmp('networkData');

				var panel = network_data_panel.down("gridReaction");

				var nb = panel.getSelectionModel().getSelection().length;

				var a_values = [];

				for (var i = 0; i < nb; i++) {
					var rec = panel.getSelectionModel().getSelection()[i].get(valueField);
					a_values.push(rec);
				}

				selectCombo.setValue(a_values, false);

			}

		});