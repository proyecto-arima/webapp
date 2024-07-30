import React, { createContext, useState, useContext, ReactNode } from 'react';
import { API_URL } from '../../../config';
import { useEffect } from 'react';

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

const getCoursesFromTeacher = async () => {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(res => {
    if(res.ok) {
      return res.json();
    } else {
      console.error('Error while getting the courses');
      console.info(res);
      return [];
    }
  }
  ).catch((err) => {
    console.error('An unexpected error occurred while getting the courses');
    console.error(err);
    return [];
  });
};

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/courses');
        if (!response.ok) {
          throw new Error('Error fetching courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);
  /*
  const [courses, setCourses] = useState<ICourse[]>([
    // TODO: fetch courses from the API
    // {
    //   title: 'Curso de React',
    //   description: 'Aprende a crear aplicaciones con React',
    //   imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freecodecamp.org%2Fnews%2Freact-course%2F&psig=AOvVaw2i6bZM2K4zLQ4U8JQJj5Qe&ust=1634321583064000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJj8l9zvzvMCFQAAAAAdAAAAABAD',
    // },
    {
      title: 'Curso de Angular',
      description: 'Aprende a crear aplicaciones con Angular',
      imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freecodecamp.org%2Fnews%2Fangular-course%2F&psig=AOvVaw3P0Qa6v4Zj4Jc7WZKQVw0z&ust=1634321612100000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJj8l9zvzvMCFQAAAAAdAAAAABAD',
    }
  ])
    */;

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
