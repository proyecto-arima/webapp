import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, patch, post } from '../../utils/network';
import { Card, Input, Label } from 'reactstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { SwalUtils } from '../../utils/SwalUtils';
import { API_URL } from '../../config';
interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  image?: string;
}

export const EditSectionPage: React.FC = () => {
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId: string }>();
  const [formData, setFormData] = useState<ISection>({
    id: '',
    name: '',
    description: '',
    visible: true,
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sectionId) {
      get(`/courses/${courseId}/sections/${sectionId}`)
        .then(res => res.json())
        .then(({data}) => {
          setFormData({
            id: data.id,
            name: data.name,
            description: data.description || '',
            visible: data.visible,
            image: data.image || ''
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching section data:', err);
          setLoading(false);
        });
    }
  }, [courseId, sectionId]);

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
      const validFileTypes = ['image/png'];
  
      if (!validFileTypes.includes(file.type)) {
        SwalUtils.errorSwal(
          'Formato de archivo inválido',
          'Solo se permiten archivos con extensión .png. Por favor, selecciona un archivo válido.',
          'Aceptar',
          () => navigate(`/courses/${courseId}/sections/${sectionId}/edit`))
        setSelectedFile(null);
        return;
      }
  
      setSelectedFile(file);
    }
  };

  const confirmEdit = async () => {
    let imageUrl = generatedImage || formData.image;

    if (!autoGenerateImage && selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`${API_URL}/images/url/`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const json = await res.json();
      imageUrl = json.data;
    }

    const updatedData = {
      ...formData,
      image: imageUrl,
    };

    if (sectionId) {
      await patch(`/courses/${courseId}/sections/${sectionId}`, updatedData);
      SwalUtils.successSwal(
        '¡Sección actualizada!',
        'La sección fue modificada con éxito.',
        'Aceptar',
        () => navigate(`/courses/${courseId}`),
        () => navigate(`/courses/${courseId}`)
        )
      };
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      SwalUtils.errorSwal(
        'Error en Editar la Sección',
        'El título no puede estar vacío. Por favor, ingresa un título para la sección.',
        'Aceptar',
        () => navigate(`/courses/${courseId}/sections/${sectionId}/edit`)
      );
      return;
    }

    // Expresión regular para permitir caracteres alfanuméricos, espacios y letras con tildes
    const alphanumericWithAccentsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s;°]+$/;
  
    const titleInvalid = !alphanumericWithAccentsRegex.test(formData.name);
    const descriptionInvalid = formData.description && !alphanumericWithAccentsRegex.test(formData.description);
  
    if (titleInvalid && descriptionInvalid) {
      SwalUtils.errorSwal(
        'Error en los campos',
        'El título y la descripción solo pueden contener letras, números, espacios y tildes.',
        'Aceptar',
        () => navigate(`/courses/${courseId}/sections/${sectionId}/edit`)
      );
      return;
    }
  
    if (titleInvalid) {
      SwalUtils.errorSwal(
        'Error en el título',
        'El título solo puede contener letras, números, espacios y tildes.',
        'Aceptar',
        () => navigate(`/courses/${courseId}/sections/${sectionId}/edit`)
      );
      return;
    }
  
    if (descriptionInvalid) {
      SwalUtils.errorSwal(
        'Error en la descripción',
        'La descripción solo puede contener letras, números, espacios y tildes.',
        'Aceptar',
        () => navigate(`/courses/${courseId}/sections/${sectionId}/edit`)
      );
      return;
    }

    SwalUtils.infoSwal(
      '¿Estás seguro de que quieres modificar esta sección?',
      'Esta acción modificará los datos de la sección.',
      'Sí',
      'No',
      confirmEdit
    );
  };

  // Generate image
  const generateImage = () => {
    if (!formData.name || !formData.description) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar el nombre y la descripción de la sección antes de generar la imagen',
      });
    }

    setImageLoading(true);

    post('/images', {
      name: formData.name,
      description: formData.description,
    }).then((res) => res.json()).then((res) => {
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
          <h1>Editar Sección</h1>
          <hr />
          <p style={{
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            Aquí podrás editar la sección en la plataforma <br />
            Cada sección tendrá diferentes contenidos agrupados por temas, franjas de tiempo, etc.
            Opcionalmente podrás cargar una imagen de portada, sino, nosotros la crearemos por tí.<br />
          </p>
          <h3>Detalles de la sección</h3>
          <hr />
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

          <div className='d-flex flex-row mb-3 gap-3'>
            <Input
              type="checkbox"
              name="visible"
              id="visible"
              checked={formData.visible}
              onChange={handleChange}
            />
            <Label for="visible">Visible</Label>
          </div>

          <h3>Imagen</h3>
          <hr />
          <p style={{
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            Para generar una imagen automáticamente a partir del nombre y descripción de la sección, clickea en Generar Imagen y espera que la magia ocurra.<br />
            También puedes subir un archivo con extensión .png para elegir manualmente la imagen de la sección, si lo prefieres.
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
            <div style={{ flex: '1' }}>
              <Input type="file" onChange={handleFileChange} className="mb-3" />
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