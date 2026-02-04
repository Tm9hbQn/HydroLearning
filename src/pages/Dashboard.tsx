import React from 'react';
import { CourseManager } from '../components/content/CourseManager';
import courseData from '../data/course_content.json';
import { Course } from '../types/content';

export const Dashboard = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <CourseManager course={courseData as unknown as Course} />
    </div>
  );
};
