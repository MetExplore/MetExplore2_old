/**
 * MetExplore.globals.GraphObjects
 */
Ext.define('MetExplore.globals.GraphObjects', {

    singleton: true,
    /**
     * protein
     * @param node
     * @param translate
     * @param secondary
     * @returns {*}
     */
    protein: function(node, translate, secondary) {
        node
            .append("polygon")
            .attr("points", "10,0 20,10 10,20 0,10")
            .attr("fill", !secondary ? "#0404B4" : "#819FF7")
            .attr("transform", "translate" + translate);;
        return this.genericNode(node);
    },
    /**
     * enzymaticComplex
     * @param node
     * @param tHoz
     * @param tVec
     * @param secondary
     * @returns {*}
     */
    enzymaticComplex: function(node, tHoz, tVec, secondary) {
        node
            .append("polygon")
            .attr("points", "10,0 20,10 10,20 0,10")
            .attr("fill", !secondary ? "#4C0B5F" : "#D0A9F5")
            .attr("transform", "translate(" + (tHoz + 7.5).toString() + "," + tVec.toString() + ")");
        node
            .append("polygon")
            .attr("points", "10,0 20,10 10,20 0,10")
            .attr("fill", !secondary ? "#4C0B5F" : "#D0A9F5")
            .attr("transform", "translate(" + tHoz.toString() + "," + tVec.toString() + ")");
        return this.genericNode(node);
    },

    /**
     * gene
     * @param node
     * @param translate
     * @param secondary
     * @returns {*}
     */
    gene: function(node, translate, secondary) {
        node
            .append("polygon")
            .attr("points", "0,10 5,0 15,0 20,10 15,20 5,20")
            .attr("fill", !secondary ? "#0B610B" : "#BCF5A9")
            .attr("transform", "translate" + translate);
        return this.genericNode(node);
    },
    /**
     * reaction
     * @param node
     * @param translate
     * @param secondary
     * @returns {*}
     */
    reaction: function(node, translate, secondary) {
        node
            .append("rect")
            .attr("width", "25")
            .attr("height", "15")
            .attr("fill", !secondary ? "#B43104" : "#F5BCA9")
            .attr("transform", "translate" + translate);
        return this.genericNode(node);
    },
    /**
     * genericNode
     * @param node
     * @returns {*}
     */
    genericNode: function(node) {
        node
            .attr("stroke", "#fff")
            .attr("stroke-width", "1px");
        return node;
    }

});