/**
 * MetExplore.override.view.Table
 */
Ext.define('MetExplore.override.view.Table', {
	override:'Ext.view.Table',
	getRecord: function (node) {
		//console.log('getRecord');
        node = this.getNode(node);
        if (node) {
            return this.dataSource.data.get(node.getAttribute('data-recordId'));
        }
		
    },

    /**
     *
     * @param node
     * @returns {number|*}
     */
    indexInStore: function (node) {
        node = this.getNode(node, true);
        //.log('indexInStore');
		if (!node && node !== 0) {
            return -1;
        }
        return this.dataSource.indexOf(this.getRecord(node));
		
    }
});