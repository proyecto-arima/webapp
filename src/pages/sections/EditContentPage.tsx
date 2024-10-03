import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import { SwalUtils } from '../../utils/SwalUtils';
import { get, patch } from '../../utils/network';

import '../../assets/styles/CourseDetailPage.css';

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentId) {
      get(`/contents/${contentId}`)
        .then(res => res.json())
        .then(({data}) => {
          console.log(data);
          setFormData({
            id: data.id,
            title: data.title,
          });
          setLoading(false);
        })

        .catch(err => {
          console.error('Error fetching content data:', err);
          setLoading(false);
        });
    }
  }, [courseId, sectionId, contentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const confirmEdit = async () => {
    if (contentId) {
      await patch(`/contents/${contentId}/title`, formData);
      navigate(`/courses/${courseId}/sections/${sectionId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      SwalUtils.errorSwal(
        'Error al editar el contenido',
        'El título no puede estar vacío. Por favor, ingresa un título para el contenido.',
        'Aceptar',
        () => navigate(`/courses/${courseId}/sections/${sectionId}/contents/${contentId}/edit-title`)
      );
      return;
    }

    SwalUtils.infoSwal(
      '¿Estás seguro de que quieres modificar este contenido?',
      'Esta acción modificará los datos del contenido.',
      'Sí',
      'No',
      confirmEdit
    );
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        width: '100%',
        height: '100%',
      }}>
      <Card style={{ paddingInline: '2rem', paddingBlock: '1rem', width: '100%', height: '100%' }}>
        <h2 className="text-center mb-4">Editar Contenido</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título del contenido"
              required
            />
          </div>
          <div style={{ flexGrow: 1 }}></div>
          <div className='d-flex flex-row justify-content-end'>
            <button className="btn-purple-1" onClick={handleSubmit}>
              Actualizar
            </button>
          </div>
        </form>
      </Card>
    </div>
  </div>
  );
};
