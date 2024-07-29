import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ICourse {
  title: string;
  description: string;
  imageUrl: string;
}

interface ICourseContext {
  courses: ICourse[];
  addCourse: (course: ICourse) => void;
}

const CourseContext = createContext<ICourseContext | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<ICourse[]>([]);

  const addCourse = (course: ICourse) => {
    setCourses([...courses, course]);
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};
