import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, patch } from '../../utils/network';
import { Card, Input } from 'reactstrap';
import '../../assets/styles/CourseDetailPage.css';
import { ConfirmDialog } from '../../components/ConfirmDialog';

interface IContent {
  id: string;
  title: string;
}

export const EditContentPage: React.FC = () => {
  const { courseId, sectionId, contentId } = useParams<{ courseId: string; sectionId: string; contentId: string }>();
  const [formData, setFormData] = useState<IContent>({
    id: '',
    title: '',
  });
  const [editConfirmOpen, setEditConfirmOpen] = useState(false); // Estado para el diálogo
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Fetch content data when the page loads
  useEffect(() => {
    if (contentId) {
      get(`/courses/${courseId}/sections/${sectionId}/content/${contentId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            id: data.id,
            title: data.title || '', // Evitar que sea undefined
          });
          setLoading(false); // Desactivar el estado de carga cuando los datos estén listos
        })
        .catch(err => {
          console.error('Error fetching content data:', err);
          setLoading(false); // Asegurar que el estado de carga se desactive en caso de error
        });
    }
  }, [courseId, sectionId, contentId]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEditConfirm = () => {
    setEditConfirmOpen(!editConfirmOpen);
  };

  const confirmEdit = async () => {
    if (contentId) {
      await patch(`/contents/${contentId}/title`, formData);
      navigate(`/courses/${courseId}/sections/${sectionId}`); // Redirigir de nuevo a la página de detalles de la sección
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
        <h2 className="text-center mb-4">Editar Contenido</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título del contenido"
              required
            />
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn-purple-1">
              Actualizar
            </button>
          </div>
        </form>
      </Card>

      {/* Confirmación para editar el contenido */}
      <ConfirmDialog
        isOpen={editConfirmOpen}
        toggle={toggleEditConfirm}
        onConfirm={confirmEdit}
        onCancel={toggleEditConfirm}
        message="¿Estás seguro de que quieres guardar los cambios?"
      />
    </div>
  );
};
