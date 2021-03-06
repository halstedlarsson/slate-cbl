/**
 * The Dashboard controller manages the components of the student dashboard and
 * handles routing by course section.
 */
Ext.define('SlateTasksStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    // dependencies
    views: [
        'Dashboard',
        'AppHeader',
        'TaskTree',
        'RecentActivity',
        'Slate.cbl.view.student.TaskHistory'
    ],

    refs: {
        dashboard: {
            selector: 'slatetasksstudent-dashboard',
            autoCreate: true,

            xtype: 'slatetasksstudent-dashboard'
        },
        appHeader: {
            selector: 'slatetasksstudent-appheader',
            autoCreate: true,

            xtype: 'slatetasksstudent-appheader'
        },
        sectionSelectorCombo: {
            selector: 'combobox#section-selector',
        },
        taskTree: {
            selector: 'slatetasksstudent-tasktree',
            autoCreate: true,

            xtype: 'slatetasksstudent-tasktree'
        },
        todoList: {
            selector: 'slatetasksstudent-todolist',
            autoCreate: true,

            xtype: 'slatetasksstudent-todolist'
        },
        recentActivity: {
            selector: 'slatetasksstudent-recentactivity',
            autoCreate: true,

            xtype: 'slatetasksstudent-recentactivity'
        },
        taskHistory: {
            selector: 'slate-taskhistory',
            autoCreate: true,

            xtype: 'slate-taskhistory'
        }
    },


    // entry points
    routes: {
        'section/:sectionCode': {
            sectionCode: '([a-zA-Z0-9])+',
            action: 'showCourseSection'
        }
    },

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    control: {
        'slatetasksstudent-appheader button[action="show-recent"]': {
            click: 'onShowRecentClick'
        },
        'slatetasksstudent-tasktree': {
            resize: 'onTaskTreeResize'
        },
        'combo#section-selector': {
            select: 'onSectionSelectorSelect',
            boxready: 'onSectionSelectorBoxReady'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getDashboard().render('slateapp-viewport');
    },


    // event handlers
    onUnmatchedRoute: function() {
        this.redirectTo('section/all');
    },

    onShowRecentClick: function(button) {
        var win = this.getRecentActivity();

        if (button.pressed) {
            win.showBy(button, 'tr-bl');
        } else {
            win.hide();
        }
    },

    onTaskTreeResize: function () {
        this.maskDemoElements();
    },

    onSectionSelectorSelect: function(combo, rec) {
        var sectionCode = rec.get('Code'),
            route = 'section/all';

        if (sectionCode) {
            route = 'section/'+sectionCode;
        }
        this.redirectTo(route);
    },

    onSectionSelectorBoxReady: function(combo) {
        combo.getStore().on('load', function(store) {
            store.insert(0, {
                ID: 0,
                Code: null,
                Title: 'All'
            })
        });
    },


    // custom controller methods
    maskDemoElements: function () {
        this.getTaskHistory().setLoading(false);

        this.getTaskHistory().setLoading('');
    },

    showCourseSection: function(sectionCode) {
        var me = this,
            params = Ext.urlDecode(location.search.substring(1)),
            sectionSelectorCombo = me.getSectionSelectorCombo(),
            courseSectionsStore = sectionSelectorCombo.getStore(),
            rec = courseSectionsStore.findRecord('Code', sectionCode),
            taskTree = me.getTaskTree(),
            todoList = me.getTodoList(),
            user = params.student ? params.student : 'current';

        // correct route if it does not match requested course_section parameter
        if (params.course_section && params.course_section !== sectionCode) {
            this.redirectTo('section/'+params.course_section);
            return;
        }

        if (!courseSectionsStore.isLoaded()) {
            courseSectionsStore.load({
                params: {
                    enrolled_user: user // eslint-disable-line camelcase
                },
                callback: function() {
                    me.showCourseSection(sectionCode);
                }
            });
            return;
        }

        if (params.student) {
            taskTree.setStudent(params.student);
            taskTree.setReadOnly(true);

            todoList.setStudent(params.student);
            todoList.setReadOnly(true);

            sectionSelectorCombo.setDisabled(true);
        }

        if (!rec && sectionCode !== 'all') {
            Ext.Msg.alert('Error', 'Course Section not found.');
            return;
        }

        if (sectionCode === 'all') {
            sectionCode = 0;
            sectionSelectorCombo.setValue(0);
        } else {
            sectionSelectorCombo.setValue(rec);
        }

        taskTree.setCourseSection(sectionCode);
        todoList.setCourseSection(sectionCode);
    }
});
