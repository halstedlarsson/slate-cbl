Ext.define('SlateDemonstrationsStudent.store.ContentAreas', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.model.ContentArea'
    ],

    model: 'Slate.cbl.model.ContentArea',

    autoLoad: true
});