import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { editCourses } from '../../redux/slices/courses';
import { get, patch, post } from '../../utils/network';
import { Card, Input, Label, Spinner } from 'reactstrap';
import { SwalUtils } from '../../utils/SwalUtils';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config';
import PageWrapper from '../../components/PageWrapper';

interface ICourse {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const EditCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string; sectionId: string }>();
  const [formData, setFormData] = useState<ICourse>({
    id: '',
    title: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (courseId) {
      get(`/courses/${courseId}`)
        .then(res => res.json())
        .then(({ data }) => {
          setFormData({
            id: data.id,
            title: data.title,
            description: data.description || '',
            image: data.image || ''
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching section data:', err);
          setLoading(false);
        });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validFileTypes.includes(file.type)) {
        SwalUtils.errorSwal(
          'Formato de archivo inválido',
          'Solo se permiten archivos con extensión .png, .jpeg o .jpg. Por favor, seleccioná un archivo válido.',
          'Aceptar',
          () => navigate(`/courses/${courseId}/edit`))
        e.target.value = "";
        return;
      }

      
      setImageLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      fetch(`${API_URL}/images/url/`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      }).then(res => res.json()).then(res => {
        setImageLoading(false);
        setFormData(prevState => ({
          ...prevState,
          image: res.data
        }));
      });
    }
  };

  const confirmEdit = () => {
    const updatedData = {
      ...formData,
      image: generatedImage || formData.image,
    };

    if (courseId) {
      patch(`/courses/${courseId}`, updatedData).then(res => res.json()).then((data) => {
        if (data.success) {
          dispatch(editCourses(updatedData));
          Swal.fire({
            icon: 'success',
            title: 'Curso actualizado',
            text: 'El curso fue actualizado correctamente',
          }).then(() => {
            navigate(`/courses/`);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar el curso',
          });
        }
      });
    };
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el título',
        text: 'El título no puede estar vacío. Por favor, ingresá un título para el curso.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    
    SwalUtils.infoSwal(
      '¿Estás seguro de que querés modificar este curso?',
      'Esta acción modificará los datos del curso.',
      'Sí',
      'No',
      confirmEdit
    );
  };

  // Generate image
  const generateImage = () => {
    if (!formData.title || !formData.description) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debés ingresar el nombre y la descripción del curso antes de generar la imagen',
      });
    }

    setImageLoading(true);

    post('/images', {
      name: formData.title,
      description: formData.description,
    }).then((res) => res.json()).then((res) => {
      setImageLoading(false);
      setGeneratedImage(res.data);
    });
  };

  return (
    <PageWrapper
      title="Editar curso"
      loading={loading}
    >
      <div style={{
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <p style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          Acá podés editar el curso en la plataforma. <br />
          Cada curso debe tener un nombre y una descripción que verán los alumnos al ingresar.
          Además, tenés la opción de modificar la imagen de portada o que AdaptarIA la cree para vos.<br />
          Una vez editado el curso, podés seguirle agregando secciones con el contenido deseado, y además matricular alumnos al curso.
        </p>
        <h5>Detalles del curso</h5>
        <hr />
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
          type="text"
          name="description"
          value={formData.description}
          placeholder="Descripción de la sección"
          className="mb-3"
          onChange={handleChange}
        />

        <h5>Imagen</h5>
        <hr />
        <p style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          Para generar una imagen con IA a partir del nombre y descripción del curso, hacé click en &quot;Generar Imagen&quot; y esperá que ocurra la magia.<br />
          Si querés subir un archivo (.png, .jpeg o .jpg) destildá la opción de &quot;Generar imagen automáticamente&quot; y seleccioná el archivo deseado.
        </p>

        <div className='d-flex flex-row mb-3 gap-3'>
          <Input type='checkbox' name='auto-generate' id='auto-generate' onClick={() => setAutoGenerateImage(!autoGenerateImage)} checked={autoGenerateImage} />
          <Label for='auto-generate'>Generar imagen automáticamente</Label>
        </div>

        {autoGenerateImage ? (
          <div style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
            ) : (
              generatedImage ? (
                <img src={generatedImage} alt="Generated" style={{
                  width: '200px',
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                  overflow: 'hidden',
                }} />
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
              )
            )}
          </div>
        ) : (
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Input type="file" onChange={handleFileChange} className="mb-3" />
            {imageLoading ? (<>
              <Spinner color="primary" />
            </>) : (<img src={formData.image} alt="Generated" style={{
                  width: '200px',
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                  overflow: 'hidden',
                }} />)}
          </div>
          
        )}

        <div className='d-flex flex-row justify-content-end'>
          <button className="btn-purple-1" onClick={handleSubmit}>
            Actualizar
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};