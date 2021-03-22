/**
 * MetExplore.globals.Feature
 */
Ext.define('MetExplore.globals.Feature', {
    singleton: true,
    name:'',
    listidUser:'',
    listidBioSource:'',
    /**
     * une feature peut etre defini sur plusieurs lignes
     * status : 0=hide ; 1=disabled ; 2= visible
     * filtrer store par nom de la feature (parametre de url defini dans app.js param['feature'])
     * pour chaque element de la feature
     *      recuperer nom du composant
     *      trouver composant dans l'interface
     *      selon status mettre hide ou disable
     */
    loadFeature : function(feature){
        //console.log('---loadFeature param----', feature);
        var storeFeature= Ext.getStore('S_Feature');
        storeFeature.removeFilter();
        storeFeature.filter({
            property: 'name',
            value: feature,
            exactMatch: true,
            caseSensitive: true
        });
        var ctrl= this;

        storeFeature.each(function(record){

            var component= record.get('component');

            var idcomponent= Ext.ComponentQuery.query(component)[0];

            if (idcomponent==undefined){
                idcomponent=Ext.getCmp(component);
            }

            if (idcomponent!=undefined) {
                ctrl.componentStatus(idcomponent, record.get('typeComponent'), record.get('specifStatus'));
            }
        })

    },


    /**
     * feature metexplore (=sans parametre url) peut-etre specifique biosource et/ou user
     *
     * */
    loadFeatureMetexplore : function() {
        //console.log('loadFeatureMetexplore');
        var storeFeature= Ext.getStore('S_Feature');
        storeFeature.removeFilter();
        storeFeature.filter({
            property: 'name',
            value: 'metexplore',
            exactMatch: true,
            caseSensitive: true
        });
        var ctrl= this;

        storeFeature.each(function(record) {

            var component= record.get('component');

            var idcomponent = Ext.ComponentQuery.query(component)[0];

            if (idcomponent == undefined) {
                idcomponent = Ext.getCmp(component);
            }

            if (idcomponent != undefined) {
               var specifStatus= ctrl.verif_BioSourceUser(record);
               //console.log(specifStatus);
               if (specifStatus) {
                   //console.log(record.get('status'));
                   ctrl.componentStatus(idcomponent, record.get('typeComponent'),record.get('specifStatus'));
               } else {
                   ctrl.componentStatus(idcomponent, record.get('typeComponent'),record.get('defaultStatus'));
               }
            }

        });

    },

    /**
     * verif_BioSourceUser
     * @param record
     * @returns {boolean}
     */
    verif_BioSourceUser: function(record) {
        var listidB= record.get('listidBioSource');
        var listidU= record.get('listidUser');

        var boolBioSource= false ;
        var boolUser= false ;
        //console.log(MetExplore.globals.Session.idBioSource);
        //console.log(MetExplore.globals.Session.idUser);

        switch (listidB) {
            case 'one':
                if (MetExplore.globals.Session.idBioSource!=-1) boolBioSource= true;
                break;
            case 'all':
                boolBioSource= true;
                break;
            default :
                if (listidB.indexOf(MetExplore.globals.Session.idBioSource)!=-1) boolBioSource= true;
                break;

        }
        switch (listidU) {
            case 'one':
                if (MetExplore.globals.Session.idUser!='-1' || MetExplore.globals.Session.idUser!='') boolUser=true;
                break;
            case 'all':
                boolUser= true;
                break;
            default :
                if (listidU.indexOf(MetExplore.globals.Session.idUser)!=-1) boolUser= true;
                break;

        }
        //console.log('BiosOurce',boolBioSource);
        //console.log('User',boolUser);

        return boolBioSource && boolUser;
    },
    /**
     * componentStatus
     * @param idcomponent
     * @param typeComponent
     * @param status
     */
    componentStatus: function(idcomponent, typeComponent, status) {
        //console.log("component--",typeComponent+"--"+status);
        switch (status) {
            case '0' :
                switch (typeComponent) {

                    case 'tab' :
                        idcomponent.tab.hide();
                        idcomponent.tab.setDisabled(false);
                        break;

                    case 'menu' :
                        idcomponent.hide();
                        idcomponent.setDisabled(false);
                        break;
                    case 'id' :
                        idcomponent.hide();
                        idcomponent.setDisabled(false);
                        break;
                }
                break;
            case '1' :
                switch (typeComponent) {

                    case 'tab' :
                        idcomponent.tab.show();
                        idcomponent.tab.setDisabled(true);
                        break;

                    case 'menu' :
                        idcomponent.show();
                        idcomponent.setDisabled(true);
                        break;
                    case 'id' :
                        idcomponent.show();
                        idcomponent.setDisabled(true);
                        break;
                }
                break;
            case '2' :
                switch (typeComponent) {

                    case 'tab' :
                        idcomponent.tab.show();
                        idcomponent.tab.setDisabled(false);
                        break;

                    case 'menu' :
                        idcomponent.show();
                        idcomponent.setDisabled(false);
                        break;
                    case 'id' :
                        idcomponent.show();
                        idcomponent.setDisabled(false);
                        break;
                }
                break;
        }
    },

});

