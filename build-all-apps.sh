#!/bin/bash
cd sencha-workspace

cd SlateDemonstrationsTeacher
sencha app build

cd ../SlateDemonstrationsStudent
sencha app build

cd ../SlateTasksTeacher
sencha app build

cd ../SlateTasksStudent
sencha app build

cd ../SlateTasksManager
sencha app build

cd ../AggregridExample
sencha app build