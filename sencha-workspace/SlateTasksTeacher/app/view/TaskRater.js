Ext.define('SlateTasksTeacher.view.TaskRater', {
    extend: 'Slate.cbl.view.modals.RateTask',

    xtype: 'slate-tasks-teacher-taskrater',
    config: {
        readOnly: null
    },

    updateTask: function(task, oldTask) {
        var me = this,
            form = me.down('slate-modalform'),
            attachmentsField = me.down('slate-tasks-attachmentsfield'),
            skillsField = me.down('slate-skillsfield');

        form.down('[name=Title]').setValue(task.get('Title'));
        form.down('[name=ParentTaskTitle]').setValue(task.get('ParentTask') ? task.get('ParentTask').Title : '');
        form.down('[name=ExperienceType]').setValue(task.get('ExperienceType'));
        form.down('[name=ExpirationDate]').setValue(task.get('ExpirationDate'));

        attachmentsField.setAttachments(task.get('Attachments'));
        attachmentsField.setReadOnly(true);

        skillsField.setSkills(task.get('Skills'));
        skillsField.setReadOnly(true);
    },

    updateStudentTask: function(studentTask, oldStudentTask) {
        var me = this,
            form = me.down('slate-modalform'),
            ratingsView = me.down('slate-ratingview'),
            skillRatingIds = [],
            task = me.getTask(),
            groupedSkills = studentTask.getTaskSkillsGroupedByCompetency();


        form.down('[name=StudentFullName]').setValue(studentTask.get('Student').FirstName + ' ' + studentTask.get('Student').LastName);
        form.down('[name=DueDate]').setValue(studentTask.get('DueDate'));
        form.down('[name=Submitted]').setValue(studentTask.get('Submitted'));

        ratingsView.setData({
            ratings: [7, 8, 9, 10, 11, 12, 'M'],
            competencies: groupedSkills
        });
    },

    updateReadOnly: function(readOnly) {
        var me = this,
            toolbarBtns = me.query('container[dock=bottom] button'),
            commentField = me.down('textareafield'),
            ratingView = me.down('slate-ratingview');

        ratingView.setReadOnly(readOnly);
        commentField.setReadOnly(readOnly);
        Ext.each(toolbarBtns, function(btn) {
            btn.setDisabled(readOnly);
        });
        // debugger;
    }
});