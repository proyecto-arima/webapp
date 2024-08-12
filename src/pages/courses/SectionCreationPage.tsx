// src/pages/sections/SectionCreationPage.tsx
import React, { useState } from 'react';
import { Card, Input } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { post, del } from '../../utils/network';
import ConfirmModal from '../../components/ConfirmModal';



interface ISectionCreationFormValues {
  name?: string;
  description?: string;
  visible?: boolean;
}

export const SectionCreationPage = () => {
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId?: string }>();
  const [formValues, setFormValues] = useState<ISectionCreationFormValues>({ visible: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const { addSection } = useSectionContext();
  const navigate = useNavigate();

  // 
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFormChange = (label: keyof ISectionCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormValues({
      ...formValues,
      [label]: value,
    });
  };

  const createSection = () => post(`/courses/${courseId}/section`, { ...formValues }).then((res) => res.json()).then(() => navigate(`/courses/${courseId}`));  

  const deleteSection = async () => {
    toggleModal(); // Mostrar el modal

    const onConfirmDelete = async () => {
      try {
        await del(`/courses/${courseId}/section/${sectionId}`);
        alert('Sección eliminada exitosamente');
        navigate(`/courses/${courseId}`);
      } catch (error) {
        console.error('Error eliminando la sección:', error);
        alert('Hubo un problema eliminando la sección');
      }
    };

    return (
      <ConfirmModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onConfirm={onConfirmDelete}
        message="¿Estás seguro de que deseas eliminar esta sección?"
      />
    );
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
      <Card style={{ width: '30rem', paddingInline: '2rem', paddingBlock: '1rem' }}>
        <h2 className="text-center mb-3">Crear Sección</h2>
        <Input name="name" type="text" placeholder="Nombre de la sección" className="mb-3" onChange={handleFormChange('name')} />
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
        {/* Botón de eliminación */}
        {sectionId && (
          <button className="btn-purple-1 w-100 mt-3" onClick={toggleModal}>
            Eliminar Sección
          </button>
        )}
        {/* Modal de confirmación */}
        <ConfirmModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          onConfirm={deleteSection}
          message="¿Estás seguro de que deseas eliminar esta sección?"
        />
      </Card>
    </div>
  );
};
