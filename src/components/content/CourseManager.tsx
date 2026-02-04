import React, { useState } from 'react';
import { Course } from '../../types/content';
import { UnitRenderer } from './UnitRenderer';
import { Button } from '../ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CourseManagerProps {
  course: Course;
}

export const CourseManager: React.FC<CourseManagerProps> = ({ course }) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);

  const currentModule = course.modules[currentModuleIndex];
  const currentUnit = currentModule?.units[currentUnitIndex];

  const handleNext = () => {
    if (currentUnitIndex < currentModule.units.length - 1) {
      setCurrentUnitIndex(prev => prev + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      setCurrentUnitIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex(prev => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      setCurrentUnitIndex(course.modules[currentModuleIndex - 1].units.length - 1);
    }
  };

  if (!currentUnit) return <div>No content available</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold font-serif text-slate-900">{course.title}</h1>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <span>{currentModule.title}</span>
          <span>/</span>
          <span className="font-medium text-slate-700">{currentUnit.title}</span>
        </div>
      </header>

      <main className="min-h-[50vh]">
        <UnitRenderer unit={currentUnit} />
      </main>

      <footer className="mt-8 flex justify-between items-center border-t pt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentModuleIndex === 0 && currentUnitIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentModuleIndex === course.modules.length - 1 && currentUnitIndex === currentModule.units.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </footer>
    </div>
  );
};
