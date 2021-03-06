<?php

namespace Slate\CBL\Demonstrations;

use Slate\CBL\Skill;
use Slate\CBL\StudentCompetency;

class DemonstrationSkill extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $tableName = 'cbl_demonstration_skills';
    public static $singularNoun = 'demonstration skill';
    public static $pluralNoun = 'demonstration skills';
    public static $collectionRoute = '/cbl/demonstration-skills';

    public static $fields = [
        'DemonstrationID' => [
            'type' => 'uint'
            ,'index' => true
        ],
        'SkillID' => [
            'type' => 'uint'
            ,'index' => true
        ],
        'TargetLevel' => [
            'type' => 'tinyint',
            'notnull' => false
        ],
        'DemonstratedLevel' => [
            'type' => 'tinyint',
            'unsigned' => true
        ],
        'Override' => [
            'type' => 'boolean',
            'default' => false
        ]
    ];

    public static $relationships = [
        'Demonstration' => [
            'type' => 'one-one'
            ,'class' => Demonstration::class
        ],
        'Skill' => [
            'type' => 'one-one'
            ,'class' => Skill::class
        ]
    ];

    public static $validators = [
        'DemonstrationID' => [
            'validator' => 'number'
            ,'min' => 1
        ]
        ,'SkillID' => [
            'validator' => 'number'
            ,'min' => 1
        ]
        ,'TargetLevel' => [
            'validator' => 'number'
            ,'min' => 1
            ,'max' => 13
            ,'required' => false
        ]
        ,'DemonstratedLevel' => [
            'validator' => 'number'
            ,'min' => 0
            ,'max' => 13
        ]
    ];

    public static $dynamicFields = [
        'Demonstration',
        'Skill'
    ];

    public function save($deep = true)
    {
        // default TargetLevel to student's current level
        if (!$this->TargetLevel && $StudentCompetency = StudentCompetency::getCurrentForStudent($this->Demonstration->Student, $this->Skill->Competency)) {
            $this->TargetLevel = $StudentCompetency->Level;
        }

        return parent::save($deep);
    }
}