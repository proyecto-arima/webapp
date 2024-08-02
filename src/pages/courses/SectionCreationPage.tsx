// src/pages/sections/SectionCreationPage.tsx
import React, { useState } from 'react';
import { Card, Input } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from '../../config';
import SidebarCourses from './SidebarCourses';
import { useSectionContext } from './contexts/SectionContext';

interface ISectionCreationFormValues {
  title?: string;
  description?: string;
  visible?: boolean;
}

export const SectionCreationPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [formValues, setFormValues] = useState<ISectionCreationFormValues>({ visible: true });
  const { addSection } = useSectionContext();
  const navigate = useNavigate();

  const handleFormChange = (label: keyof ISectionCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormValues({
      ...formValues,
      [label]: value,
    });
  };

  const createSection = async () => {
    const sectionId = uuidv4();
    const sectionData = {
      id: sectionId,
      title: formValues.title!,
      description: formValues.description!,
      visible: formValues.visible!,
    };

    // Llama al backend para crear la sección y asociarla al curso
    await fetch(`${API_URL}/courses/${courseId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sectionData),
    });

    addSection(sectionData); // Añade la sección al contexto o estado

    console.log('Section created');
    navigate(`/courses/${courseId}`);
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
        <h2 className="text-center mb-3">Crear Sección</h2>
        <Input name="name" type="text" placeholder="Nombre de la sección" className="mb-3" onChange={handleFormChange('title')} />
        <Input name="description" type="textarea" placeholder="Descripción de la sección" className="mb-3" onChange={handleFormChange('description')} />
        <div className="mb-3">
          <label>
            <input type="checkbox" checked={formValues.visible} onChange={handleFormChange('visible')} />
            Visible
          </label>
        </div>
        <button className="btn-purple-1 w-100" onClick={createSection}>
          Crear
        </button>
      </Card>
    </div>
  );
};
