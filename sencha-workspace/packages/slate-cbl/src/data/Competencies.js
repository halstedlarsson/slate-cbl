/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.data.Competencies', {
    extend: 'Slate.cbl.store.Competencies',
    singleton: true,
    requires: [
        'Slate.proxy.Records',
        'Slate.cbl.data.ContentAreas'
    ],

    storeId: 'cbl-competencies',

    proxy: {
        type: 'slate-records',
        url: '/cbl/competencies',
        relatedTable: 'ContentArea'
    },

    onProxyLoad: function(operation) {
        var me = this,
            rawData = me.getProxy().getReader().rawData;

        if (rawData.related && rawData.related.ContentArea) {
            Slate.cbl.data.ContentAreas.loadRawData(rawData.related.ContentArea, true);
        }

        me.callParent(arguments);
    }
});