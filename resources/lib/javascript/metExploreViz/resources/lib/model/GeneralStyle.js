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
 * @author MC
 * (a)description 
 */
 /**
 * General style
 */
var GeneralStyle = function(siteName, minContinuous, maxContinuous, max, dispLabel, dispLink, dispConvexhull, dispPathwaysOnLinks, clust, dispCaption, eventForNodeInfo, loadButtonHidden, windowsAlertDisable){
    this.websiteName = siteName;
    this.valueMinMappingContinuous = minContinuous;
    this.valueMaxMappingContinuous = maxContinuous;
    this.maxReactionThreshold = max;
    this.displayLabelsForOpt = dispLabel;
    this.displayLinksForOpt = dispLink;
    this.displayConvexhulls = dispConvexhull;
    this.displayPathwaysOnLinks = dispPathwaysOnLinks;
    this.displayCaption = dispCaption;
    this.eventForNodeInfo=eventForNodeInfo;
    this.loadButtonHidden=false;
    this.windowsAlertDisable=false;
    this.clustered=clust;
};

GeneralStyle.prototype = {
    loadButtonIsHidden:function(){
        return this.loadButtonHidden;
    },
    setLoadButtonIsHidden:function(bool){
        this.loadButtonHidden = bool;
        metExploreD3.fireEvent("graphPanel", "setLoadButtonHidden");
    },
    windowsAlertIsDisable:function(){
        return this.windowsAlertDisable;
    },
    setWindowsAlertDisable:function(bool){
        this.windowsAlertDisable = bool;
    },
    // Getters & Setters
    getValueMinMappingContinuous:function()
    {
      return this.valueMinMappingContinuous;
    },
    getValueMaxMappingContinuous:function()
    {
      return this.valueMaxMappingContinuous;
    },

    setMaxValueMappingContinuous:function(newValue)
    {
      this.valueMaxMappingContinuous = newValue;
    },

    setMinValueMappingContinuous:function(newValue)
    {
      this.valueMinMappingContinuous = newValue;
    },

    getWebsiteName:function(){return this.websiteName;},
   
//If there are less than this number of reactions in the store, then different graph components are displayed.
    getReactionThreshold:function(){return this.maxReactionThreshold;},
    setReactionThreshold:function(maxReaction){this.maxReactionThreshold = maxReaction;},

    hasEventForNodeInfo:function(){return this.eventForNodeInfo;},
    setEventForNodeInfo:function(bool){this.eventForNodeInfo = bool;},

    isDisplayedLabelsForOpt:function(){return this.displayLabelsForOpt;},
    setDisplayLabelsForOpt:function(dispLabel){this.displayLabelsForOpt = dispLabel;},

    isDisplayedLinksForOpt:function(){return this.displayLinksForOpt;},
    setDisplayLinksForOpt:function(dispLink){this.displayLinksForOpt = dispLink;},

    isDisplayedConvexhulls:function(){return this.displayConvexhulls;},
    setDisplayConvexhulls:function(dispConvexhull){this.displayConvexhulls = dispConvexhull;},

    isDisplayedPathwaysOnLinks:function(){return this.displayPathwaysOnLinks;},
    setDisplayPathwaysOnLinks:function(dispPathwaysOnLinks){this.displayPathwaysOnLinks = dispPathwaysOnLinks;},

    isDisplayedCaption:function(){return this.displayCaption;},
    setDisplayCaption:function(dispCaption){this.displayCaption = dispCaption;},
 
    useClusters:function(){return this.clustered;},
    setUseClusters:function(bool){this.clustered = bool;}
};