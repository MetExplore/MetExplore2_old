/*
 This file is part of MetExploreViz 

 Copyright © 2020 INRA 
 Contact: http://metexplore.toulouse.inra.fr/metexploreViz/doc/contact 
 GNU General Public License Usage 
 This file may be used under the terms of the GNU General Public License version 3.0 as 
 published by the Free Software Foundation and appearing in the file LICENSE included in the 
 packaging of this file. 
 Please review the following information to ensure the GNU General Public License version 3.0 
 requirements will be met: http://www.gnu.org/copyleft/gpl.html. 
 If you are unsure which license is appropriate for your use, please contact us 
 at http://metexplore.toulouse.inra.fr/metexploreViz/doc/contact
 Version: 3.0.18 
 Build Date: Tue Jun 30 16:03:55 CEST 2020 
 */
/**
 * @class metExploreD3.Features
 * Feature flipping allows to enable function in function of user
 * @author MC
 * @experimental
 */
metExploreD3.Features = {

	// functions swhich can be disabled
	features:
	{
			"highlightSubnetwork":
			{
				description: "highlightSubnetwork",
				enabledTo: []
			},
        	"layouts":
            {
                description: "layouts",
                enabledTo: []
            },
            "algorithm":
            {
                description: "layouts",
                enabledTo: []
            },
            "align":
            {
                description: "align",
                enabledTo: ["all"]
            }
	},

	/**
	 * Test if feature must be active for particular user or all users
	 * @param feature
	 * @param currentUser
	 * @returns {*|boolean|boolean}
	 */
    isEnabled : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    	 	return this.isEnabledForUser(feature, currentUser) || this.isEnabledForAll(feature) ;
    	return false;
    },

	/**
	 * Test if feature must be active for particular user
	 * @param feature
	 * @param currentUser
	 * @returns {boolean}
	 */
    isEnabledForUser : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    		return this.features[feature].enabledTo.indexOf(currentUser)!=-1;
    	return false;
    },

	/**
	 * Test if feature must be active for all users
	 * @param feature
	 * @returns {boolean}
	 */
    isEnabledForAll : function(feature) {
    	if(this.features[feature]!==undefined)
    		return this.features[feature].enabledTo.indexOf("all")!==-1;
    	return false;
    }
};