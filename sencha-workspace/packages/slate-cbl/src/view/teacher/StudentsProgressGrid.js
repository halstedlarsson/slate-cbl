/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('Slate.cbl.view.teacher.StudentsProgressGrid', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-teacher-studentsprogressgrid',
    requires:[
        'Slate.cbl.Util',

        'Slate.cbl.widget.Popover',

        'Slate.cbl.store.Students',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.store.Completions',
        'Slate.cbl.store.Skills',
        'Slate.cbl.store.DemonstrationSkills'
    ],

    config: {
        studentDashboardLink: null,
        averageFormat: '0.##',
        progressFormat: '0%',

        popover: true,

        studentsStore: {
            xclass: 'Slate.cbl.store.Students'
        },

        competenciesStore: {
            xclass: 'Slate.cbl.store.Competencies'
        },

        completionsStore: {
            xclass: 'Slate.cbl.store.Completions'
        },

        skillsStore: {
            xclass: 'Slate.cbl.store.Skills'
        },
        
        demonstrationSkillsStore: {
            xclass: 'Slate.cbl.store.DemonstrationSkills'
        }
    },

    componentCls: 'cbl-grid-cmp',

    tpl: [
        '{%var studentsCount = values.students.length%}',
        '<div class="cbl-grid-ct">',
            '<table class="cbl-grid cbl-grid-competencies">',
                '<colgroup class="cbl-grid-competency-col"></colgroup>',

                '<thead>',
                    '<tr>',
                        '<td class="cbl-grid-corner-cell"></td>',
                    '</tr>',
                '</thead>',

                '<tbody>',
                    '<tpl for="competencies">',
                        '<tpl for="competency">',
                            '<tr class="cbl-grid-progress-row" data-competency="{ID}">',
                                '<th class="cbl-grid-competency-name"><div class="ellipsis">{Descriptor}</div></th>',
                            '</tr>',
                            '<tr class="cbl-grid-skills-row" data-competency="{ID}">',
                                '<td class="cbl-grid-skills-cell">',
                                    '<div class="cbl-grid-skills-ct">',
                                        '<table class="cbl-grid-skills-grid">',
                                            '<colgroup class="cbl-grid-skill-col"></colgroup>',
                                            '<tbody></tbody>',
                                        '</table>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                        '</tpl>',
                    '</tpl>',
                '</tbody>',
            '</table>',

            '<div class="cbl-grid-scroll-ct">',
                '<table class="cbl-grid cbl-grid-main">',
                    '<colgroup span="{[studentsCount]}" class="cbl-grid-progress-col"></colgroup>',

                    '<thead>',
                        '<tr>',
                            '<tpl for="students">',
                                '<th class="cbl-grid-student-name" data-student="{student.ID}">',
                                    '<tpl if="dashboardUrl"><a href="{dashboardUrl}"></tpl>',
                                        '{student.FirstName} {student.LastName}',
                                    '<tpl if="dashboardUrl"></a></tpl>',
                                '</th>',
                            '</tpl>',
                        '</tr>',
                    '</thead>',

                    '<tbody>',
                        '<tpl for="competencies">',
                            '<tr class="cbl-grid-progress-row" data-competency="{competency.ID}">',
                                '<tpl for="students">',
                                    '<td class="cbl-grid-progress-cell" data-student="{student.ID}">',
                                        '<span class="cbl-grid-progress-bar" style="width: 0%"></span>',
                                        '<span class="cbl-grid-progress-level"></span>',
                                        '<span class="cbl-grid-progress-percent"></span>',
                                        '<span class="cbl-grid-progress-average"></span>',
                                    '</td>',
                                '</tpl>',
                            '</tr>',
                            '<tr class="cbl-grid-skills-row" data-competency="{competency.ID}">',
                                '<td class="cbl-grid-skills-cell" colspan="{[studentsCount]}"">',
                                    '<div class="cbl-grid-skills-ct">',
                                        '<table class="cbl-grid-skills-grid">',
                                            '<colgroup span="{[studentsCount]}"" class="cbl-grid-demos-col"></colgroup>',
                                            '<tbody></tbody>',
                                        '</table>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                        '</tpl>',
                    '</tbody>',
                '</table>',
            '</div>',
        '</div>',
        '<div class="cbl-grid-legend">',
            '<span class="cbl-grid-legend-label">Legend:&ensp;</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-8">8</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-9">9</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-10">10</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-11">11</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-12">12</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-13">13</span>',
        '</div>'
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.cbl-grid-progress-row, .cbl-grid-demo'
        },
        mouseover: {
            fn: 'onSkillNameMouseOver',
            element: 'el'
        },
        competencyrowclick: 'onCompetencyRowClick'
    },


    // local subtemplates
    competencySkillsTpl: [
        '<tpl for="skills">',
            '<tr class="cbl-grid-skill-row" data-skill="{skill.ID}">',
                '<th class="cbl-grid-skill-name" data-skill-name="{skill.Descriptor:htmlEncode}" data-skill-description="{skill.Statement:htmlEncode}">',
                    '<div class="ellipsis">{skill.Descriptor:htmlEncode}</div>',
                '</th>',
            '</tr>',
        '</tpl>'
    ],

    competencyDemonstrationsTpl: [
        '<tpl for="skills">',
            '<tr class="cbl-grid-skill-row" data-skill="{skill.ID}">',
                '<tpl for="students">',
                    '<td class="cbl-grid-demos-cell <tpl if="completion">cbl-level-{completion.currentLevel}</tpl>" data-student="{student.ID}">', // TODO: update currentlevel if already rendered when completion is loaded?
                        '<ul class="cbl-grid-demos">',
                            '<tpl for="demonstrationBlocks">',
                                '<li class="cbl-grid-demo cbl-grid-demo-empty"></li>',
                            '</tpl>',
                        '</ul>',
                    '</td>',
                '</tpl>',
            '</tr>',
        '</tpl>',
    ],


    // config handlers
    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },

    applyAverageFormat: function(format) {
        return Ext.isString(format) ? Ext.util.Format.numberRenderer(format) : format;
    },

    applyProgressFormat: function(format) {
        return Ext.isString(format) ? Ext.util.Format.numberRenderer(format) : format;
    },

    applyStudentsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },
    
    updateStudentsStore: function(store) {
        if (store) {
            store.on('refresh', 'refresh', this);
        }
    },

    applyCompetenciesStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateCompetenciesStore: function(store) {
        if (store) {
            store.on('refresh', 'refresh', this);
        }
    },

    applyCompletionsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateCompletionsStore: function(store) {
        if (store) {
            store.on({
                scope: this,
                refresh: 'onCompletionsRefresh',
                update: 'onCompletionUpdate'
            });
        }
    },

    applySkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    applyDemonstrationSkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateDemonstrationSkillsStore: function(store) {
        if (store) {
            store.on({
                scope: this,
//                refresh: function() { debugger; console.log('refresh', arguments); },
//                add: function() { debugger; console.log('add', arguments); },
//                update: function() { debugger; console.log('update', arguments); },
//                remove: function() { debugger; console.log('remove', arguments); },
//                load: function() { debugger; console.log('load', arguments); },
                load: 'onDemonstrationSkillsLoad'
            });
        }
    },


    // component lifecycle
    afterRender: function() {
        this.callParent(arguments);
        this.refresh();
    },


    // event handlers
    onGridClick: function(ev, targetEl) {
        var me = this;

        if (targetEl = ev.getTarget('.cbl-grid-progress-row', me.el, true)) {
            me.fireEvent(
                'competencyrowclick',
                me,
                me.getCompetenciesStore().getById(targetEl.getAttribute('data-competency'), 10),
                ev,
                targetEl
            );
        } else if (targetEl = ev.getTarget('.cbl-grid-demo', me.el, true)) {
            me.fireEvent('democellclick', me, ev, targetEl);
        }
    },

    onCompetencyRowClick: function(me, competency, ev, targetEl) {
        me.toggleCompetency(competency);
    },

    onSkillNameMouseOver: function(ev) {
        var me = this,
            popover = me.getPopover(),
            dashboardEl = me.el,
            targetEl;

        if (targetEl = ev.getTarget('.cbl-grid-skill-name', dashboardEl, true)) {
            if (popover.hidden || popover.alignTarget !== targetEl) {
                popover.showBy(targetEl);
                popover.update({
                    title: targetEl.getAttribute('data-skill-name'),
                    body: targetEl.getAttribute('data-skill-description')
                });
            }
        } else if (!popover.hidden) {
            popover.hide();
        }
    },

    onCompletionsRefresh: function(completionsStore) {
        var me = this,
            competenciesById = me.data.competenciesById,
            averageFormat = me.getAverageFormat(),
            progressFormat = me.getProgressFormat(),
            completionsLength = completionsStore.getCount(), completionIndex,
            completion, competencyData, competencyStudentData, percentComplete, demonstrationsAverage;
        
        for (completionIndex = 0; completionIndex < completionsLength; completionIndex++) {
            completion = completionsStore.getAt(completionIndex);
            competencyData = competenciesById[completion.get('CompetencyID')];
            competencyStudentData = competencyData.studentsById[completion.get('StudentID')];

            percentComplete = 100 * (completion.get('demonstrationsCount') || 0) / competencyData.competency.totalDemonstrationsRequired;
            demonstrationsAverage = completion.get('demonstrationsAverage');

            competencyStudentData.progressCellEl
                .addCls('cbl-level-'+completion.get('currentLevel'))
                .toggleCls('is-average-low', percentComplete >= 50 && demonstrationsAverage < competencyData.competency.minimumAverage);

            competencyStudentData.progressBarEl.setStyle('width', Math.round(percentComplete) + '%');
            competencyStudentData.progressLevelEl.update('L'+completion.get('currentLevel'));
            competencyStudentData.progressPercentEl.update(progressFormat(percentComplete));
            competencyStudentData.progressAverageEl.update(averageFormat(demonstrationsAverage));
            
            competencyStudentData.completion = completion.data; // TODO: what if there is a completion already loaded? How do changes to it get propogated to the DOM and to demo cells?
        }
    },
    
    onCompletionUpdate: function(completionsStore, completion, operation, modifiedFieldNames, details) {
//        debugger;
        // TODO: apply completion updates to DOM
    },

    onDemonstrationSkillsLoad: function(demonstrationSkillsStore, demonstrationSkills) {
        var renderData = this.getData();

        renderData.incomingDemonstrationSkills = (renderData.incomingDemonstrationSkills || []).concat(demonstrationSkills);

        this.flushDemonstrations();
    },


    // public methods

    /**
     * Redraw the dashboard's primary markup shell based on the already-loaded {@link #config-studentsStore} and {@link #config-competenciesStore}
     */
    refresh: function() {
        var me = this,
            studentsStore = me.getStudentsStore(),
            competenciesStore = me.getCompetenciesStore();

        if (!studentsStore.isLoaded() || !competenciesStore.isLoaded()) {
            return;
        }

        Ext.suspendLayouts();

        me.setData(me.buildRenderData());

        if (me.rendered) {
            me.finishRefresh();
        } else {
            me.on('render', 'finishRefresh', me, { single: true });
        }

        // TODO: should this be in finishRefresh instead? what happens if refresh called before render?
        me.getCompletionsStore().loadByStudentsAndCompetencies(
            me.getStudentsStore().collect('ID'),
            me.getCompetenciesStore().collect('ID')
        );

        Ext.resumeLayouts(true);
    },

    /**
     * Expand or collapse a give competency, loading and rendering associated skills if needed
     * 
     * @param {Slate.cbl.model.Competency} competency
     */
    toggleCompetency: function(competency) {
        var me = this,
            competencyRenderData = me.getRenderDataForCompetency(competency),
            skillsRowEl = competencyRenderData.skillsRowEl,
            demonstrationsRowEl = competencyRenderData.demonstrationsRowEl,
            isExpand = !competencyRenderData.expanded,
            eventName = isExpand ? 'expand' : 'collapse',
            expandedCls = 'is-expanded',
            skillsHeight = 0,
            _finishExpand, _finishToggle;


        if (me.fireEvent('beforecompetency'+eventName, me, competency) === false) {
            return;
        }


        Ext.suspendLayouts();


        _finishToggle = function() {
            skillsRowEl.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            demonstrationsRowEl.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            me.fireEvent('competency'+eventName, me, competency)
            Ext.resumeLayouts(true);
        };

        competencyRenderData.expanded = isExpand;


        // handle collapse
        if (!isExpand) {
            skillsRowEl.removeCls(expandedCls);
            demonstrationsRowEl.removeCls(expandedCls);
            _finishToggle();
            return;
        }


        // handle expand
        _finishExpand = function() {
            skillsHeight = skillsRowEl.down('.cbl-grid-skills-grid').getHeight();
            skillsRowEl.addCls(expandedCls);
            demonstrationsRowEl.addCls(expandedCls);
            _finishToggle();
        };

        // skills are already loaded & rendered, finish expand immediately
        if (competencyRenderData.skills) {
            _finishExpand();
            return;
        }

        // load demonstrations and skills
        me.getDemonstrationSkillsStore().loadByStudentsAndCompetencies(me.getStudentsStore().collect('ID'), competency.getId());

        me.getSkillsStore().getAllByCompetency(competency, function(skillsCollection) {
            var renderData = me.getData(),
                skillsById = renderData.skillsById || (renderData.skillsById = {}),
                competencySkills = competencyRenderData.skills = [],
                demonstrationsBodyEl = demonstrationsRowEl.down('tbody'),

                studentsStore = me.getStudentsStore(),
                studentsCount = studentsStore.getCount(), studentIndex, student,

                skillsCount = skillsCollection.getCount(), skillIndex, skill,

                skillRenderData, studentsRenderData, studentRenderData, studentsById, skillRowEl, demonstrationsCellEl;

            // build new skills render tree and update root skill index
            for (skillIndex = 0; skillIndex < skillsCount; skillIndex++) {
                skill = skillsCollection.getAt(skillIndex);
                skillRenderData = {
                    skill: skill.data,
                    students: studentsRenderData = [],
                    studentsById: studentsById = {}
                };

                competencySkills.push(skillRenderData);
                skillsById[skill.getId()] = skillRenderData;

                for (studentIndex = 0; studentIndex < studentsCount; studentIndex++) {
                    student = studentsStore.getAt(studentIndex);
                    studentRenderData = {
                        student: student.data,
                        completion: competencyRenderData.studentsById[student.getId()].completion,
                        demonstrationBlocks: Slate.cbl.Util.padArray([], skill.get('DemonstrationsRequired'), true)
                    };

                    studentsRenderData.push(studentRenderData);
                    studentsById[student.getId()] = studentRenderData;
                }
            }

            // render skill subtables within expanded competency
            me.getTpl('competencySkillsTpl').overwrite(skillsRowEl.down('tbody'), competencyRenderData);
            me.getTpl('competencyDemonstrationsTpl').overwrite(demonstrationsBodyEl, competencyRenderData);
            
            // decorate renderData with instances
            for (skillIndex = 0; skillIndex < skillsCount; skillIndex++) {
                skillRenderData = competencySkills[skillIndex];
                skillRenderData.skillRowEl = skillRowEl = demonstrationsBodyEl.child('.cbl-grid-skill-row[data-skill="'+skillRenderData.skill.ID+'"]');
                studentsRenderData = skillRenderData.students;

                for (studentIndex = 0; studentIndex < studentsCount; studentIndex++) {
                    studentRenderData = studentsRenderData[studentIndex];
                    studentRenderData.demonstrationsCellEl = demonstrationsCellEl = skillRowEl.child('.cbl-grid-demos-cell[data-student="'+studentRenderData.student.ID+'"]');
                    studentRenderData.demonstrationBlockEls = demonstrationsCellEl.select('.cbl-grid-demo', true);
                }
            }

            // finish expand
            Slate.cbl.Util.syncRowHeights(
                skillsRowEl.select('tr'),
                demonstrationsRowEl.select('tr')
            );

            // write any pending demonstrations to the DOM
            me.flushDemonstrations();

            _finishExpand();
        });
    },


    // protected methods
    /**
     * @protected
     * Builds render data tree for the progress table's top-level template, {@link #config-tpl}
     * 
     * Each object directly within the `students` and `competencies` arrays is a unique instance to this render tree
     * but contains references to the `data` objects in the corresponding student/competency model instances. The top-
     * level objects may be modified to keep track of render state, but the referenced student/competency data should
     * be treated as read-only. Any changes that need to be made to the underlying student/competency models must be done
     * through the model instances loaded into {@link #config-studentsStore} or {@link #config-competenciesStore} and
     * then the render tree regenerated by calling {@link #method-refresh}
     * 
     * @return {Object} renderData
     */
    buildRenderData: function() {
        var me = this,
            studentDashboardLink = me.getStudentDashboardLink(),

            students = me.getStudentsStore().getRange(),
            studentsLength = students.length, studentIndex, student,
            studentsData = [],

            competenciesStore = me.getCompetenciesStore(),
            competenciesLength = competenciesStore.getCount(), competencyIndex, competency, competencyStudentsData,
            competenciesData = [];


        // build array of students
        for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
            student = students[studentIndex];
            studentsData.push({
                student: student.data,
                dashboardUrl: studentDashboardLink && Ext.String.urlAppend(studentDashboardLink, 'student=' + escape(student.get('Username')))
            });
        }


        // build array of competencies
        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competency = competenciesStore.getAt(competencyIndex);

            competenciesData.push({
                competency: competency.data,
                students: competencyStudentsData = [],
            });

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                student = students[studentIndex];
                competencyStudentsData.push({
                    student: student.data
                });
            }
        }


        return {
            students: studentsData,
            competencies: competenciesData
        };
    },
    
    /**
     * @protected
     * Decorates renderData after a redraw with indexes and element references that are useful
     * for applying updates
     * 
     * Take care to keep the read and write phases batched for optimal performances, each flip-flop between reading
     * from the DOM and writing to the DOM forces the browser to do a layout run
     */
    finishRefresh: function() {
        var me = this,
            el = me.el,
            renderData = me.getData(),
            competenciesTableEl = renderData.competenciesTableEl = el.down('.cbl-grid-competencies'),
            studentsTableEl = renderData.competenciesTableEl = el.down('.cbl-grid-main'),

            competenciesById = renderData.competenciesById = {},
            competenciesRenderData = renderData.competencies,
            competenciesLength = competenciesRenderData.length, competencyIndex,
            competencyRenderData, competencyId, studentsById, competencySelector, progressRowEl, progressCellEl,

            competencyStudentsRenderData, studentsLength = renderData.students.length, studentIndex,
            studentRenderData, studentId;


        //
        // READ PHASE:
        //

        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competencyRenderData = competenciesRenderData[competencyIndex];
            competencyId = competencyRenderData.competency.ID;
            competencyStudentsRenderData = competencyRenderData.students;
            studentsById = competencyRenderData.studentsById = {};
            competenciesById[competencyId] = competencyRenderData;

            competencySelector = '[data-competency="'+competencyId+'"]';
            competencyRenderData.progressRowEl = progressRowEl = studentsTableEl.down('.cbl-grid-progress-row' + competencySelector);
            competencyRenderData.skillsRowEl = competenciesTableEl.down('.cbl-grid-skills-row' + competencySelector);
            competencyRenderData.demonstrationsRowEl = studentsTableEl.down('.cbl-grid-skills-row' + competencySelector);

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                studentRenderData = competencyStudentsRenderData[studentIndex];
                studentId = studentRenderData.student.ID;
                studentsById[studentId] = studentRenderData;

                studentRenderData.progressCellEl = progressCellEl = progressRowEl.down('.cbl-grid-progress-cell[data-student="'+studentId+'"]');
                studentRenderData.progressBarEl = progressCellEl.down('.cbl-grid-progress-bar');
                studentRenderData.progressLevelEl = progressCellEl.down('.cbl-grid-progress-level');
                studentRenderData.progressPercentEl = progressCellEl.down('.cbl-grid-progress-percent');
                studentRenderData.progressAverageEl = progressCellEl.down('.cbl-grid-progress-average');
            }
        }


        //
        // WRITE PHASE:
        //

        // syncRowHeights does a batch read followed by a batch write so it should remain as the first call in the write phase if possible
        Slate.cbl.Util.syncRowHeights(
            competenciesTableEl.select('thead tr, .cbl-grid-progress-row'),
            studentsTableEl.select('thead tr, .cbl-grid-progress-row')
        );

    },

    /**
     * @protected
     * Gets the render object corresponding to the given competency from the render tree previously by
     * {@link #method-buildRenderData} and already loaded into {@link #config-data}. Properties
     * tracking the render state may be added to this object.
     * 
     * @param {Slate.cbl.model.Competency} competency
     * @return {Object} competencyRenderData
     */
    getRenderDataForCompetency: function(competency) {
        return this.data.competencies[this.getCompetenciesStore().indexOf(competency)];
    },

    /**
     * Writes any pending changes to demonstrations to the DOM.
     * 
     * This method must not trigger any reads from the DOM
     */
    flushDemonstrations: function() {
        var me = this,
            renderData = me.getData(),
            skillsById = renderData.skillsById,

            incomingDemonstrationSkills = renderData.incomingDemonstrationSkills || [],
            incomingDemonstrationSkillsLength = incomingDemonstrationSkills.length,
            skillDemonstrationIndex, skillDemonstration,
            unsortedDemonstrationSkills = [],

            competenciesRenderData = renderData.competencies,
            competenciesLength = competenciesRenderData.length, competencyIndex, competencyRenderData,
            
            skillsRenderData, skillsLength, skillIndex, skillRenderData,
            skillDemonstrationsRequired,
            skillStudentsRenderData, skillStudentsLength, skillStudentIndex, skillStudentRenderData,
            skillDemonstrationBlocks, skillDemonstrationsChanged,
            
            skillDemonstrationBlockEls, skillDemonstrationBlockEl,
            skillDemonstrationDemonstratedLevel, renderedDemonstrationLevel,
            skillDemonstrationDemonstrationID;

        // nothing can be flushed if no skills are loaded yet
        if (!skillsById) {
            return;
        }


    	// sort any incoming skill demonstrations that can be into skills->students render objects
        for (skillDemonstrationIndex = 0; skillDemonstrationIndex < incomingDemonstrationSkillsLength; skillDemonstrationIndex++) {
            skillDemonstration = incomingDemonstrationSkills[skillDemonstrationIndex];

            if (
                (skillRenderData = skillsById[skillDemonstration.get('SkillID')]) &&
                (skillStudentRenderData = skillRenderData.studentsById[skillDemonstration.get('StudentID')])
            ) {
                (skillStudentRenderData.incomingDemonstrationSkills || (skillStudentRenderData.incomingDemonstrationSkills = [])).push(skillDemonstration.data);
            } else {
                unsortedDemonstrationSkills.push(skillDemonstration);
            }
        }

        renderData.incomingDemonstrationSkills = unsortedDemonstrationSkills;


        // consume all pending changes, generate new demonstrationBlocks arrays, and render them
        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competencyRenderData = competenciesRenderData[competencyIndex];
            skillsRenderData = competencyRenderData.skills;

            if (!skillsRenderData) {
                continue;
            }

            for (skillIndex = 0, skillsLength = skillsRenderData.length; skillIndex < skillsLength; skillIndex++) {
                skillRenderData = skillsRenderData[skillIndex];
                skillStudentsRenderData = skillRenderData.students;
                skillDemonstrationsRequired = skillRenderData.skill.DemonstrationsRequired;

                for (skillStudentIndex = 0, skillStudentsLength = skillStudentsRenderData.length; skillStudentIndex < skillStudentsLength; skillStudentIndex++) {
                    skillStudentRenderData = skillStudentsRenderData[skillStudentIndex];
                    skillDemonstrationBlocks = skillStudentRenderData.demonstrationBlocks;
                    skillDemonstrationsChanged = false;

                    // append any incoming skill demonstrations
                    if (skillStudentRenderData.incomingDemonstrationSkills) {
                        skillDemonstrationBlocks = skillDemonstrationBlocks.concat(skillStudentRenderData.incomingDemonstrationSkills);
                        skillStudentRenderData.incomingDemonstrationSkills = null;
                        skillDemonstrationsChanged = true;
                    }

                    // TODO: handle other types of pending changes

                    // if demonstrations have changed, prepare new blocks array and patch the DOM
                    if (skillDemonstrationsChanged) {
                        skillDemonstrationBlocks = Slate.cbl.Util.sortDemonstrations(skillDemonstrationBlocks, skillDemonstrationsRequired);
                        Slate.cbl.Util.padArray(skillDemonstrationBlocks, skillDemonstrationsRequired);
                        skillStudentRenderData.demonstrationBlocks = skillDemonstrationBlocks;

                        skillDemonstrationBlockEls = skillStudentRenderData.demonstrationBlockEls;
                        for (skillDemonstrationIndex = 0; skillDemonstrationIndex < skillDemonstrationsRequired; skillDemonstrationIndex++) {
                            skillDemonstration = skillDemonstrationBlocks[skillDemonstrationIndex];
                            skillDemonstrationDemonstratedLevel = skillDemonstration.DemonstratedLevel;
                            skillDemonstrationDemonstrationID = skillDemonstration.DemonstrationID;

                            skillDemonstrationBlockEl = skillDemonstrationBlockEls.item(skillDemonstrationIndex);
                            renderedDemonstrationLevel = skillDemonstrationBlockEl.renderedDemonstrationLevel;

                            // apply demonstrated level change
                            if (renderedDemonstrationLevel !== skillDemonstrationDemonstratedLevel) {
                                if (skillDemonstrationBlockEl === undefined) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-demo-empty');
                                } else if (skillDemonstrationDemonstratedLevel === undefined) {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-demo-empty');
                                }

                                if (renderedDemonstrationLevel === 0) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-demo-uncounted');
                                } else if (skillDemonstrationDemonstratedLevel === 0) {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-demo-uncounted');
                                }

                                if (skillDemonstrationDemonstratedLevel) {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-demo-counted');
                                } else if (renderedDemonstrationLevel) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-demo-counted');
                                }

                                skillDemonstrationBlockEl.update(
                                    skillDemonstrationDemonstratedLevel === undefined ?
                                        '' :
                                        (skillDemonstrationDemonstratedLevel === 0 ? 'M' : skillDemonstrationDemonstratedLevel)
                                );

                                skillDemonstrationBlockEl.renderedDemonstrationLevel = skillDemonstrationDemonstratedLevel;
                            }

                            // apply demo ID change
                            if (skillDemonstrationBlockEl.renderedDemonstrationId != skillDemonstrationDemonstrationID) {
                                skillDemonstrationBlockEl.renderedDemonstrationId = skillDemonstrationDemonstrationID;
                                skillDemonstrationBlockEl.set({'data-demonstration': skillDemonstrationDemonstrationID || ''});
                            }
                        }
                    }
                }
            }
        }
    }
}, function(Class) {
    //<debug>
    var monitoredMethods = ['refresh', 'finishRefresh', 'syncRowHeights', 'buildRenderData', 'flushDemonstrations'];

    Ext.Array.each(monitoredMethods, function(functionName) {
        var origFn = Class.prototype[functionName];

        Class.prototype[functionName] = function() {
            var timeLabel = this.id + '.' + functionName,
                ret;

            console.groupCollapsed('%o.%s(%o) called from %o', this.id, functionName, arguments, arguments.callee.caller);
            console.time(timeLabel);

            ret = origFn.apply(this, arguments);

            console.timeEnd(timeLabel);
            console.groupEnd();

            return ret;
        };
    });
    //</debug>
});
