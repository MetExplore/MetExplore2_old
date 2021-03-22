/**
 * Component
 * utilisé pour le feature flipping : composant & menu visivle selon user et/ou biosource
 */
Ext.define('MetExplore.model.Feature', {
        extend: 'Ext.data.Model',
        fields: ['name','component','typeComponent','listidBioSource','listidUser','specifStatus','defaultStatus']
    });
