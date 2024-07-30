// src/pages/courses/CourseCreationPage.tsx
import React, { useState } from 'react';
import ReactSelect from 'react-select';
import { Card, Input } from 'reactstrap';
import { useCourseContext } from './contexts/CourseContext';
import SidebarCourses from './SidebarCourses';

interface ICourseCreationFormValues {
  title?: string;
  description?: string;
  imageUrl?: string;
  students?: { value: string; label: string }[];
}

export const CourseCreationPage = () => {
  const [formValues, setFormValues] = useState<ICourseCreationFormValues>({ students: [] });
  const { addCourse } = useCourseContext();

  const handleFormChange = (label: keyof ICourseCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [label]: e.target.value,
    });
  };

  const setStudents = (students: { value: string; label: string }[]) => {
    setFormValues({
      ...formValues,
      students,
    });
  };

  const createCourse = async () => {
    addCourse({
      title: formValues.title!,
      description: formValues.description!,
      imageUrl: formValues.imageUrl!,
    });
    console.log('Course created');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <SidebarCourses />
      <Card style={{ width: '30rem', paddingInline: '2rem', paddingBlock: '1rem' }}>
        <h2 className="text-center mb-3">Crear Curso</h2>
        <Input name="title" type="text" placeholder="Título del curso" className="mb-3" onChange={handleFormChange('title')} />
        <Input name="description" type="textarea" placeholder="Descripción del curso" className="mb-3" onChange={handleFormChange('description')} />
        <Input name="imageUrl" type="text" placeholder="URL de la imagen representativa" className="mb-3" onChange={handleFormChange('imageUrl')} />
        <ReactSelect
          isMulti
          options={[
            { value: 'student1', label: 'Estudiante 1' },
            { value: 'student2', label: 'Estudiante 2' },
            { value: 'student3', label: 'Estudiante 3' },
          ]}
          className="mb-3"
          placeholder="Listado de estudiantes"
          name="students"
          onChange={(selectedOptions) => setStudents(selectedOptions as { value: string; label: string }[])}
        />
        <button className="btn-purple-1 w-100" onClick={createCourse}>
          Crear
        </button>
      </Card>
    </div>
  );
};
