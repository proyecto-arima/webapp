import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { editCourses } from '../../redux/slices/courses';
import { get, patch, post } from '../../utils/network';
import { Card, Input, Label } from 'reactstrap';
import { SwalUtils } from '../../utils/SwalUtils';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

interface ICourse {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const EditCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [formData, setFormData] = useState<ICourse>({
    id: '',
    title: '',
    description: '',
    image: '',
  });
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (courseId) {
      get(`/courses/${courseId}`)
        .then(res => res.json())
        .then(({data}) => {
          console.log('Course data:', data);
          setFormData({
            id: data.id,
            title: data.title || '',
            description: data.description || '',
            image: data.image || '',
          });
          setGeneratedImage(data.image || '');
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching course data:', err);
          setLoading(false);
        });
    }
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const confirmEdit = async () => {
    const updatedData = { 
      ...formData, 
      ...(autoGenerateImage ? { image: generatedImage } : {}) 
    };

    if (courseId) {
      const updatedCourse = await patch(`/courses/${courseId}`, updatedData);
      const json = await updatedCourse.json();
      console.log(json);
      dispatch(editCourses(json.data));
      navigate(`/courses/dashboard`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar si el título está vacío o indefinido
  if (!formData.title?.trim()) {
    SwalUtils.errorSwal(
      'Error en Editar el Curso',
      'El título no puede estar vacío. Por favor, ingresa un título para el curso.',
      'Aceptar',
      () => navigate(`/courses/${courseId}/edit`)
    );
    return;
  }

    SwalUtils.infoSwal(
      '¿Estás seguro de que quieres modificar este curso?',
      'Esta acción modificará los datos del curso.',
      'Sí',
      'No',
      confirmEdit
    );
  };

  const generateImage = () => {
    if (!formData.title) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar un nombre para el curso antes de generar la imagen',
      });
    }

    if (!formData.description) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar una descripción para el curso antes de generar la imagen',
      });
    }

    setImageLoading(true);

    post('/images', {
      name: formData.title,
      description: formData.description,
    })
      .then(res => res.json())
      .then(res => {
        setImageLoading(false);
        setGeneratedImage(res.data);
      });
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
          <h1>Editar Curso</h1>
          <hr />
          <p style={{
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            Aquí podrás editar el curso en la plataforma. <br />
            Cada curso debe tener un nombre y una descripción que verán los alumnos al ingresar a la plataforma.
            Opcionalmente podrás cargar una imagen de portada, sino, nosotros la crearemos por tí.<br />
            Una vez editado el curso, podrás seguirle agregando secciones con el contenido deseado, y además matricular alumnos al curso.
          </p>
          <h3>Detalles del curso</h3>
          <Input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Nombre del curso"
            className="mb-3"
            onChange={handleChange}
            required
          />
          <Input
            type="textarea"
            name="description"
            value={formData.description}
            placeholder="Descripción del curso"
            className="mb-3"
            onChange={handleChange}
          />

          <h3>Imagen</h3>
          <hr />
          <p style={{
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            Para generar una imagen automáticamente a partir del nombre y descripción del curso, clickea en Generar Imagen y espera que la magia ocurra.
            También puedes utilizar una URL para elegir manualmente la imagen del curso.
          </p>
          <div className='d-flex flex-row mb-3 gap-3'>
            <Input
              type='checkbox'
              name='auto-generate'
              id='auto-generate'
              onClick={() => setAutoGenerateImage(!autoGenerateImage)}
              checked={autoGenerateImage}
            />
            <Label for='auto-generate'>Generar imagen automáticamente</Label>
          </div>

          {autoGenerateImage ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {imageLoading ? (
                <button style={{
                  backgroundColor: '#4d3a8e',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '1rem',
                }} disabled>
                  <FontAwesomeIcon icon={faWandMagicSparkles} spin />
                  Generando Imagen...
                </button>
              ) : generatedImage ? (
                <img src={generatedImage} alt="Generated" style={{ width: '200px', borderRadius: '0.5rem', objectFit: 'cover' }} />
              ) : (
                <button style={{
                  backgroundColor: '#4d3a8e',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '1rem',
                }} onClick={generateImage}>
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                  Generar Imagen
                </button>
              )}
            </div>
          ) : (
            <div style={{ flex: '1' }}>
              <Input 
              name="image"
              type="text" 
              value={formData.image} 
              placeholder="URL de la portada del curso" 
              className="mb-3" 
              onChange={handleChange} />
            </div>
          )}

          <div className='d-flex flex-row justify-content-end'>
            <button className="btn-purple-1" onClick={handleSubmit}>
              Actualizar
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};