/**
 * panel Details Votes
 * Show informations of who votes for what
 */
Ext.define('MetExplore.view.grid.V_GridDetailsVotes', {

    extend: 'Ext.grid.Panel',
    alias: 'widget.gridDetailsVotes',

    cls: 'detailsVotes',

    autoScroll: true,

    columns: [{
        text: '',
        sortable: false,
        filterable: false,
        dataIndex: 'vote',
        tdCls: 'imgDetailsVotes',
        width: 25,
        renderer: function(value) {
            switch (value) {
                case 2:
                    return '<img src="resources/images/valid.png" width="20px" height="20px" alt="yes"/>';
                    break;
                case 0:
                    return '<img src="resources/images/error.png" width="20px" height="20px" alt="no"/>';
                    break;
                case 1:
                    return '<img src="resources/images/warning.png" width="20px" height="20px" alt="hasErrors"/>';
                    break;
                default:
                    return 'noneVoteDetail';
            }
        }
    }, {
        text: 'Vote',
        sortable: true,
        filterable: true,
        dataIndex: 'vote',
        renderer: function(value) {
            switch (value) {
                case 2:
                    return 'Exists';
                    break;
                case 0:
                    return 'Not exists';
                    break;
                case 1:
                    return 'Has errors';
                    break;
                default:
                    return 'Don\'t know';
            }
        }
    }, {
        text: 'Name of the voter',
        flex: 1,
        dataIndex: 'name'
    }],

    /**
     * Constructor
     * Get params given to the window and laod store S_DetailsVotes with given parameters
     */
    constructor: function(params) {
        var config = this.config;

        config.store = Ext.getStore('S_DetailsVotes');
        config.store.load({
            params: {
                idObject: params.idObject,
                typeObject: params.typeObject
            }
        });

        this.callParent([config]);
    },

    viewConfig: {
        stripeRows: false,
        getRowClass: function(record) {
            switch (record.get('vote')) {
                case 2:
                    return 'yesVoteDetail';
                    break;
                case 0:
                    return 'noVoteDetail';
                    break;
                case 1:
                    return 'yesnoVoteDetail';
                    break;
                default:
                    return 'noneVoteDetail';
            }
        }
    }
});