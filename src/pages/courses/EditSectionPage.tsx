import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, patch, post } from '../../utils/network';
import { Card, Input, Label } from 'reactstrap';
import Swal from 'sweetalert2';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

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
  const [editConfirmOpen, setEditConfirmOpen] = useState(false); // Estado para el diálogo
  const [loading, setLoading] = useState(true); // Estado de carga
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch section data when the page loads
  useEffect(() => {
    if (sectionId) {
      get(`/courses/${courseId}/sections/${sectionId}`)
        .then(res => res.json())
        .then(data => {
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
      const updatedData = {
        ...formData,
        ...(autoGenerateImage ? { image: generatedImage } : {})
      };
      await patch(`/courses/${courseId}/sections/${sectionId}`, updatedData);
      navigate(`/courses/${courseId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toggleEditConfirm();
  };

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
            También puedes utilizar una URL para elegir manualmente la imagen de la sección.
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
              <Input name="image" type="text" placeholder="URL de la imagen" className="mb-3" onChange={handleChange} />
            </div>
          )}

          <div className='d-flex flex-row justify-content-end'>
            <button className="btn-purple-1" onClick={handleSubmit}>
              Actualizar
            </button>
          </div>
        </Card>
      </div>

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
