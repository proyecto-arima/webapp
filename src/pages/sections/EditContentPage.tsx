import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from 'reactstrap';
import Swal from 'sweetalert2';
import { get, patch } from '../../utils/network';

import '../../assets/styles/CourseDetailPage.css';
import PageWrapper from '../../components/PageWrapper';

interface IContent {
  id?: string;
  title?: string;
  visibility?: boolean;
}

export const EditContentPage: React.FC = () => {
  const { courseId, sectionId, contentId } = useParams<{ courseId: string; sectionId: string; contentId: string }>();
  const [formData, setFormData] = useState<IContent>({});
  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentId) {
      get(`/contents/${contentId}`)
        .then(res => res.json())
        .then(({ data }) => {
          setFormData({
            id: data.id,
            title: data.title,
            visibility: data.visible,
          });
          console.log(!data.generated.some((content: any) => !content.approved))
          setApproval(!data.generated.some((content: any) => !content.approved));
          setLoading(false);
        })

        .catch(err => {
          console.error('Error fetching content data:', err);
          setLoading(false);
        });
    }
  }, [courseId, sectionId, contentId]);


  const editContent = () => patch(`/contents/${contentId}`, {
    title: formData.title,
    visibility: formData.visibility,
  }).then(res => res.json()).then(res => {
    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Contenido actualizado',
        text: 'El contenido fue actualizado correctamente'
      }).then(() => {
        navigate(`/courses/${courseId}/sections/${sectionId}`);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar el contenido'
      });
    }
  })

  const handleSubmit = () => {

    if (!formData.title?.trim()) {
      return Swal.fire({
        icon: 'error',
        title: 'Error en el título',
        text: 'El título no puede estar vacío.',
        confirmButtonText: 'Aceptar',
      });
    }

    // Expresión regular para permitir caracteres alfanuméricos, espacios y letras con tildes
    const alphanumericWithAccentsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;

    if (!alphanumericWithAccentsRegex.test(formData.title)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error en el título',
        text: 'El título solo puede contener letras, números y espacios.',
        confirmButtonText: 'Aceptar',
      });
    }

    if(!approval && formData.visibility) {
      Swal.fire({
        title: 'El contenido aún no está aprobado',
        text: 'El contenido está configurado para estar visible, pero aún no se encuentra aprobado, con lo cual, tus alumnos aún no podrán visualizarlo',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Ir a aprobar',
        showCancelButton: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          return editContent();
        } else {
          navigate(`/courses/${courseId}/sections/${sectionId}/content/${contentId}/review`);
        }
      });
    } else {
      editContent();
    }

    

  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <PageWrapper
      title="Editar contenido"
      loading={loading}
    >
      <p
        style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: '#6b7280',
          fontSize: '2vmin',
        }}
      >
        Acá podés editar el título y la visibilidad del contenido que se generó automáticamente para tus estudiantes. <br />
        Si deseas cambiar el archivo, deberás borrar el contenido y crear uno nuevo.
        Una vez que el contenido esté <b>visible</b>, sólo será visible para tus estudiantes si también se encuentra <b>aprobado</b> <br />
        Para aprobar un contenido, debes acceder a él y clickear en el botón <b>Aprobar</b>
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5vmin',
          width: '100%',
          margin: '0 auto',
          height: '100%',
        }}
      >
        <div>
          <h5>Título</h5>
          <hr />
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título del contenido"
            required
          />
        </div>
        <div>
          <h5>Visibilidad</h5>
          <hr />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <Input
              type="checkbox"
              name="visibility"
              checked={formData.visibility}
              onChange={e => setFormData({ ...formData, visibility: e.target.checked })}
            />
            <span style={{ marginLeft: '1rem' }}>Visible para estudiantes</span>
          </div>
        </div>
        <div style={{
          flex: 1,
        }}>

        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
          <button
            className="btn-purple-1"
            onClick={handleSubmit}
          >
            Guardar cambios
          </button>
        </div>
        
      </div>
    </PageWrapper>
  );
};
