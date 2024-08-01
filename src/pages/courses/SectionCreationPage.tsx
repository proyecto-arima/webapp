import React, { useState } from 'react';
import { useSectionContext } from './contexts/SectionContext';
import { useParams } from 'react-router-dom';
import { Card, Input, Button } from 'reactstrap';
import { API_URL } from '../../config';

interface ISectionCreationFormValues {
  title: string;
  description: string;
  visible: boolean;
}

const SectionCreationPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { addSection } = useSectionContext();
  const [formValues, setFormValues] = useState<ISectionCreationFormValues>({ title: '', description: '', visible: true });

  const handleFormChange = (label: keyof ISectionCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormValues({ ...formValues, [label]: value });
  };

  const createSection = async () => {
    const newSection = { id: '', ...formValues, courseId: courseId };
    const response = await fetch(`${API_URL}/courses/${courseId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSection),
    });

    if (response.ok) {
      addSection(newSection);
      console.log('Section created');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f6effa', width: '100vw' }}>
      <Card style={{ width: '30rem', padding: '2rem' }}>
        <h2 className="text-center mb-3">Crear Sección</h2>
        <Input name="title" type="text" placeholder="Título de la sección" className="mb-3" onChange={handleFormChange('title')} />
        <Input name="description" type="textarea" placeholder="Descripción de la sección" className="mb-3" onChange={handleFormChange('description')} />
        <Input name="visible" type="checkbox" className="mb-3" checked={formValues.visible} onChange={handleFormChange('visible')} /> Visible
        <Button className="btn-purple-1 w-100" onClick={createSection}>Crear</Button>
      </Card>
    </div>
  );
};

export default SectionCreationPage;
