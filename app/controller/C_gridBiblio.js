/**
 * C_gridBiblio
 */
Ext.define('MetExplore.controller.C_gridBiblio', {
	extend: 'Ext.app.Controller',

	config: {
		views: ['grid.V_gridBiblio','grid.V_gridReactionBiblio']
	},
	/*
	 * Definition des evenements
	 * Definition des boutons dans barre tbarBiblio (definie dans view/grid/V_gridBiblio
	 */	
	init: function() {
		this.control({
			'gridBiblio button[action=BiblioDel]':{
				click:this.BiblioDel
			},
			'gridReactionBiblio button[action=addBiblio]' : {
				click : this.addBiblio
			},
			'gridReactionBiblio button[action=PubMedWS]' : {
				click : this.completeWithPubMed
			}		
		});
	},
	
	addBiblio:function(button){

		var val = button.up('form').getForm().getValues();
		if(val['PMID']!=''){

			var Store= button.up("gridReactionBiblio").getStore('S_ReactionBiblio');

			Store.add({
				'pubmedid':val['PMID'],
				'title':val['title'],
				'authors':val['authors'],
				'Journal':val['Journal'],
				'Year':val['Year']
			}); 

			button.up('form').getForm().reset();
		}
	},
	
	
	completeWithPubMed: function(button){

		var form=button.up('form');

		var formValues=form.getValues();

		Ext.Ajax.cors = true;
		Ext.Ajax.useDefaultXhrHeader = false;

		Ext.Ajax.request({
			url:'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+formValues["PMID"],
			waitMsg: 'Saving Data, please wait...',			
			success: function(response, opts) {

				var xmlDoc;

				if (window.DOMParser)
				{
					parser=new DOMParser();
					xmlDoc=parser.parseFromString(response.responseText,"text/xml");
				}
				else // code for IE
				{
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async=false;
					xmlDoc.loadXML(response.responseText);
				}

				var titl,auth='',jour,y;

				var nodelist=xmlDoc.getElementsByTagName('Item');
				for (var i=0;i<nodelist.length;i++){
					if (nodelist[i].getAttribute("Name")=="Title"){
						titl=nodelist[i].childNodes[0].nodeValue;
					}
					if (nodelist[i].getAttribute("Name")=="Author"){
						auth+=nodelist[i].childNodes[0].nodeValue+', ';
					}
					if (nodelist[i].getAttribute("Name")=="FullJournalName"){
						jour=nodelist[i].childNodes[0].nodeValue;
					}
					if (nodelist[i].getAttribute("Name")=="PubDate"){
						y=nodelist[i].childNodes[0].nodeValue.substr(0, 4);
					}
				}
				auth=auth.substring(0, auth.length-2);
				form.getForm().setValues([
				                          {id:'title', value: titl},
				                          {id:'authors', value: auth},
				                          {id:'Journal', value: jour},
				                          {id:'Year', value:y}
				                          ]);
			}, 
			failure: function(response, opts) { 
				console.log(response);
				Ext.MessageBox.alert('Server-side failure with status code ' + response.status); 
			}

		})
	},
	
	completeWithPubMedInStore:function(record){
		
		Ext.Ajax.cors = true;
		Ext.Ajax.useDefaultXhrHeader = false;

		Ext.Ajax.request({
			url:'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+record.get('pubmedid'),
			success: function(response, opts) {

				var xmlDoc;

				if (window.DOMParser)
				{
					parser=new DOMParser();
					xmlDoc=parser.parseFromString(response.responseText,"text/xml");
				}
				else // code for IE
				{
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async=false;
					xmlDoc.loadXML(response.responseText);
				}

				var titl,auth='',jour,y;

				var nodelist=xmlDoc.getElementsByTagName('Item');
				for (var i=0;i<nodelist.length;i++){
					if (nodelist[i].getAttribute("Name")=="Title"){
						titl=nodelist[i].childNodes[0].nodeValue;
					}
					if (nodelist[i].getAttribute("Name")=="Author"){
						auth+=nodelist[i].childNodes[0].nodeValue+', ';
					}
					if (nodelist[i].getAttribute("Name")=="FullJournalName"){
						jour=nodelist[i].childNodes[0].nodeValue;
					}
					if (nodelist[i].getAttribute("Name")=="PubDate"){
						y=nodelist[i].childNodes[0].nodeValue;
					}
				}
				auth=auth.substring(0, auth.length-2);
				record.set( 'title', titl );
				record.set( 'authors', auth );
				record.set( 'Journal', jour );
				record.set( 'Year', y );
			}, 
			failure: function(response, opts) { 
				Ext.MessageBox.alert('Server-side failure with status code ' + response.status); 
			}

		})
	},

	/*
	 * Suppression Biblio
	 */
	BiblioDel: function(grid){
		console.log('DelBiblio');
		/*
		grid.tip = Ext.create('Ext.tip.ToolTip', {
        	target: grid.el,
        	delegate: grid.view.cellSelector,
        	trackMouse: true,
	        renderTo: Ext.getBody(),
    	    listeners: {
        	    beforeshow: function (tip) {
   					record = grid.view.getRecord(tip.triggerElement.parentNode);
   					myToolTipText = "<b>Substrats: </b>"+ record.get('leftR');
   					myToolTipText = myToolTipText + "<br/><b>Products: </b>"+ record.get('rightR');
   					myToolTipText = myToolTipText + "<br/><b>Status: </b>"+ record.get('statusName');
   					myToolTipText = myToolTipText + "<br/><b>Score: </b>"+ record.get('scoreName');
   					tip.update(myToolTipText);
 				}
 			}
    	});		*/
	}



});