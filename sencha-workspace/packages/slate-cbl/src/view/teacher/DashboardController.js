/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('Slate.cbl.view.teacher.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-dashboard',
    requires: [
        'Slate.cbl.view.teacher.skill.OverviewWindow',
        'Slate.cbl.view.teacher.demonstration.EditWindow'
    ],


    config: {
        id: 'slate-cbl-teacher-dashboard', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            'slate-cbl-teacher-studentsprogressgrid': {
                democellclick: 'onDemoCellClick'
            },
            'slate-cbl-teacher-skill-overviewwindow': {
                createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
                editdemonstrationclick: 'onOverviewEditDemonstrationClick'
            }
        },

        listen: {
            api: {
                demonstrationsave: 'onDemonstrationSave'
            }
        }
    },


    // event handers
    onDemoCellClick: function(progressGrid, ev, targetEl) {
        Ext.create('Slate.cbl.view.teacher.skill.OverviewWindow', {
            ownerCmp: this.getView(),
            autoShow: true,
            animateTarget: targetEl,

            competency: parseInt(targetEl.up('.cbl-grid-skills-row').getAttribute('data-competency'), 10),
            studentsStore: progressGrid.getStudentsStore(),
            competenciesStore: progressGrid.getCompetenciesStore(),

            skill: parseInt(targetEl.up('.cbl-grid-skill-row').getAttribute('data-skill'), 10),
            student: parseInt(targetEl.up('.cbl-grid-demos-cell').getAttribute('data-student'), 10),
            selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
        });
    },

    onOverviewCreateDemonstrationClick: function(overviewWindow, student, competency) {
        this.showDemonstrationEditWindow({
            defaultStudent: student,
            defaultCompetency: competency
        });
    },

    onOverviewEditDemonstrationClick: function(overviewWindow, demonstrationId) {
        var me = this,
            editWindow = me.showDemonstrationEditWindow({
                title: 'Edit demonstration #' + demonstrationId
            });

        editWindow.setLoading('Loading demonstration #' + demonstrationId + '&hellip;');
        Slate.cbl.model.Demonstration.load(demonstrationId, {
            params: {
                include: 'Skills.Skill'
            },
            success: function(demonstration) {
                editWindow.setDemonstration(demonstration);
                editWindow.setLoading(false);
            }
        });
    },

    onDemonstrationSave: function(demonstration) {
        this.getView().progressGrid.loadDemonstration(demonstration);
    },


    // public methods
    showDemonstrationEditWindow: function(options) {
        var dashboardView = this.getView();

        return Ext.create('Slate.cbl.view.teacher.demonstration.EditWindow', Ext.apply({
            ownerCmp: dashboardView,
            autoShow: true,
            
            studentsStore: dashboardView.progressGrid.getStudentsStore()
        }, options));
    }
});