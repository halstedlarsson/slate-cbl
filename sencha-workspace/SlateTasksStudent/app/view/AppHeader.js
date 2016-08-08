Ext.define('SlateTasksStudent.view.AppHeader', {
    extend: 'Slate.cbl.view.AppHeader',
    requires: [
        'SlateTasksStudent.store.CourseSections',
        'Ext.toolbar.Fill'
    ],
    xtype: 'slatetasksstudent-appheader',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'combo',
            itemId: 'sectionSelect',
            cls: 'slate-course-selector',

            fieldLabel: 'Course Section',
            labelWidth: 120,

            store: {xclass: 'SlateTasksStudent.store.CourseSections'},

            displayField: 'Title',
            valueField: 'ID',

            forceSelection: true,
            editable: false
        },
        {
            xtype: 'tbfill'
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-clock-o',
            enableToggle: true,
            action: 'show-recent'
        }]
    }]

});