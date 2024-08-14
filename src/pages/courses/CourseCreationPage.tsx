// src/pages/courses/CourseCreationPage.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Input } from 'reactstrap';
import { addCourse } from '../../redux/slices/courses';
import { post } from '../../utils/network';


interface ICourseCreationFormValues {
  title?: string;
  description?: string;
  image?: string;
  students?: { value: string; label: string }[];
}

export const CourseCreationPage = () => {

  const [formValues, setFormValues] = useState<ICourseCreationFormValues>({ students: [] });
  const dispatch = useDispatch();

  const handleFormChange = (label: keyof ICourseCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [label]: e.target.value,
    });
  };

  const createCourse = () => {
    return post('/courses', {...formValues}).then((res) => res.json()).then((res) => {
      dispatch(addCourse(res.data));
    });
  };

  return (
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', /* Alinea el contenido al principio */
      padding: '20px',
      width: '100%',
      height: '100%',
    }}>
      <Card style={{ paddingInline: '2rem', paddingBlock: '1rem', width: '100%', height: '100%' }}>
        <h1>Crear Curso</h1>
        <hr />
        <Input name="title" type="text" placeholder="Nombre" className="mb-3" onChange={handleFormChange('title')} />
        <Input name="description" type="textarea" placeholder="Descripción del curso" className="mb-3" onChange={handleFormChange('description')} />
        <Input name="image" type="text" placeholder="URL de la portada del curso" className="mb-3" onChange={handleFormChange('image')} />
        <div className='d-flex flex-row justify-content-end'>
          <button className="btn-purple-1" onClick={createCourse}>
            Crear
          </button>
        </div>
      </Card>
      </div>
    </div>
  );
};
