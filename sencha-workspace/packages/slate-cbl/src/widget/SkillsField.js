Ext.define('Slate.cbl.widget.SkillsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Slate.cbl.store.Skills',
        'Ext.form.field.ComboBox',
        'Ext.view.View'
    ],
    xtype: 'slate-skillsfield',

    componentCls: 'slate-skillsfield',

    fieldLabel: 'Skills',
    config: {
        readOnly: false
    },

    items: [
        {
            width: '100%',
            xtype: 'combo',
            name: 'Skills',
            store: 'Skills',
            queryParam: 'q',
            displayField: 'Code_Descriptor',
            valueField: 'ID',
            emptyText: 'Competency code or statement\u2026', // &hellip;
            multiSelect: true,
            listeners: {
                beforeselect: function(combo, record) {
                    var dataview = combo.next('dataview'),
                        store = dataview.getStore();
                    store.add(record);
                    return false;
                }
            },
            listConfig: {
                tpl: [
                    '<ul>',
                        '<tpl for=".">',
                            '<tpl if="xindex == 1 || this.getGroupStr(parent[xindex - 2]) != this.getGroupStr(values)">',
                                '<li class="x-combo-list-group"><b>{[this.getGroupStr(values)]}</b></li>',
                            '</tpl>',
                            '<li role="option" class="x-boundlist-item" style="padding-left: 12px">{Code_Descriptor}</li>',
                        '</tpl>',
                    '</ul>',
                    {
                        getGroupStr: function (values) {
                            return values.CompetencyDescriptor;
                        }
                    }
                ]
            }
        },
        {
            xtype: 'dataview',
            itemId: 'skills-list',
            cls: 'slate-skillsfield-list',
            store: {
                model: 'Slate.cbl.model.Skill'
            },
            autoEl: 'ul',
            enableEditing: true,
            itemSelector: '.slate-skillsfield-item',
            tpl: [
                '<tpl for=".">',
                    '<li class="slate-skillsfield-item">',
                        '<div class="slate-skillsfield-token">',
                            '<strong class="slate-skillsfield-item-code">{Code}</strong>',
                            '<span class="slate-skillsfield-item-title" title="{Descriptor}">{Descriptor}</span>',
                            '<tpl if="this.owner.enableEditing">',
                                '<i tabindex="0" class="slate-skillsfield-item-remove fa fa-times-circle"></i>',
                            '</tpl>',
                        '</div>',
                    '</li>',
                '</tpl>'
            ],
            listeners: {
                itemclick: function(view, record, item, idx, event) {

                    if (event.target.classList.contains('slate-skillsfield-item-remove')) {
                        view.getStore().remove(record);
                    }
                }
            }
        }
    ],

    updateReadOnly: function(readOnly) {
        if (!this.rendered) {
            return this.on('render', function() {
                return this.updateReadOnly(readOnly);
            });
        }

        var me = this,
            field = me.down('combo'),
            view = me.down('dataview'),
            action = readOnly === undefined || !!readOnly;

        view.enableEditing = !action;
        view.refreshView();

        field[action ? 'hide' : 'show']();
    },

    getSkills: function(returnRecords, idsOnly) {
        var me = this,
            skillsList = me.down('#skills-list'),
            skillsStore = skillsList.getStore();

        if (returnRecords === false) {
            if (idsOnly === true) {
                return skillsStore.collect('ID');
            }
            return Ext.Array.map(skillsStore.getRange(), function(s) {
                return s.getData();
            });
        }
        return skillsStore.getRange();
    },

    setSkills: function(skills, append) {
        var me = this,
            skillsList = me.down('#skills-list'),
            skillsStore = skillsList.getStore();

        if (append !== true) {
            skillsStore.removeAll();
        }
        skillsStore.add(skills);
    }
});