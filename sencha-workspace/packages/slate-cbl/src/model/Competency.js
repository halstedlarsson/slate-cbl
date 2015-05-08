/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.model.Competency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.API',
        'Slate.cbl.proxy.Records',
        'Ext.data.identifier.Negative'
    ],

    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        // server-persisted fields
        { name: 'ID', type: 'int' },
        { name: 'ContentAreaID', type: 'int' },
        { name: 'Code', type: 'string'},
        { name: 'Descriptor', type: 'string'},
        { name: 'Statement', type: 'string'},

        // server-provided metadata
        { name: 'totalDemonstrationsRequired', persist: false, type: 'integer' },
        { name: 'minimumAverage', persist: false, type: 'float' },
        { name: 'studentCompletions', persist: false, defaultValue: {} },

        // in-browser state
        { name: 'expanded', persist: false, type: 'boolean', defaultValue: false },
        { name: 'skillsRendered', persist: false, type: 'boolean', defaultValue: false },
        { name: 'skills', persist: false },
        { name: 'demonstrations', persist: false }
    ],

    proxy: {
        type: 'slate-cbl-records',
        url: '/cbl/competencies'
    }
});