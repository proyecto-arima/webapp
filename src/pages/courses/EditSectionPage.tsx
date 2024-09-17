import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, patch } from '../../utils/network';
import { Card, Input } from 'reactstrap';
import '../../assets/styles/CourseDetailPage.css';
import { ConfirmDialog } from '../../components/ConfirmDialog';

interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

export const EditSectionPage: React.FC = () => {
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId: string }>();
  const [formData, setFormData] = useState<ISection>({
    id: '',
    name: '',
    description: '',
    visible: true,
  });
  const [editConfirmOpen, setEditConfirmOpen] = useState(false); // Estado para el diálogo
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Fetch section data when the page loads
  useEffect(() => {
    if (sectionId) {
      console.log('Fetching section data...'); // Para verificar que se haga la llamada
      get(`/courses/${courseId}/sections/${sectionId}`)
        .then(res => res.json())
        .then(data => {
          console.log('Datos recibidos:', data); // Verifica los datos recibidos
          setFormData({
            id: data.id,
            name: data.name,
            description: data.description || '', // Evitar que sea undefined
            visible: data.visible,
          });
          setLoading(false); // Desactivar el estado de carga cuando los datos estén listos
        })
        .catch(err => {
          console.error('Error fetching section data:', err);
          setLoading(false); // Asegurar que el estado de carga se desactive en caso de error
        });
    }
  }, [courseId, sectionId]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleEditConfirm = () => {
    setEditConfirmOpen(!editConfirmOpen);
  };

  const confirmEdit = async () => {
    if (sectionId) {
      await patch(`/courses/${courseId}/sections/${sectionId}`, formData);
      navigate(`/courses/${courseId}`); // Redirigir de nuevo a la página de detalles del curso
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toggleEditConfirm(); // Mostrar el diálogo de confirmación
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

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
        <h2 className="text-center mb-3">Editar Sección</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Nombre de la sección"
            className="mb-3"
            onChange={handleChange}
            required
          />
          <Input
            type="textarea"
            name="description"
            value={formData.description}
            placeholder="Descripción de la sección"
            className="mb-3"
            onChange={handleChange}
          />
          <div className="mb-3">
            <label>
              <input
                type="checkbox"
                name="visible"
                checked={formData.visible}
                onChange={handleChange}
              />
              Visible
            </label>
          </div>
          <button type="submit" className="btn-purple-1 w-100">
            Actualizar
          </button>
        </form>
      </Card>

      {/* Confirmación para editar la sección */}
      <ConfirmDialog
        isOpen={editConfirmOpen}
        toggle={toggleEditConfirm}
        onConfirm={confirmEdit}
        onCancel={toggleEditConfirm}
        message="¿Estás seguro de que quieres modificar esta sección?"
      />
    </div>
  );
};
