/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.store.StudentTasks', {
    extend: 'Ext.data.Store',

    model: 'SlateTasksStudent.model.StudentTask',

    config: {
        pageSize: 0
    },

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks/assigned',
        include: [
            'Student',
            'Section',
            'Comments',
            'Attachments',
            'TaskSkills',
            'Task.Attachments',
            'Task.ParentTask'
        ]
    }
});
