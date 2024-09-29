// src/pages/sections/SectionCreationPage.tsx
import React, { useState } from 'react';
import { Card, Input, Label } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { post } from '../../utils/network';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';


interface ISectionCreationFormValues {
  title?: string;
  description?: string;
  visible?: boolean;
  image?: string;
}

export const SectionCreationPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [formValues, setFormValues] = useState<ISectionCreationFormValues>({ visible: true });
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  //const { addSection } = useSectionContext();
  const navigate = useNavigate();

  const handleFormChange = (label: keyof ISectionCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormValues({
      ...formValues,
      [label]: value,
    });
  };

  const createSection = () => {
    const body = {
      ...formValues,
      name: formValues.title,
      title: undefined,
      ...(autoGenerateImage ? { image: generatedImage } : {}),
    };

    return post(`/courses/${courseId}/section`, { ...body })
      .then((res) => res.json())
      .then(() => navigate(`/courses/${courseId}`));
  }
    

  const generateImage = () => {
    if (!formValues.title) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar un nombre para el curso antes de generar la imagen',
      });
    }

    if (!formValues.description) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar una descripción para el curso antes de generar la imagen',
      });
    }

    setImageLoading(true);

    post('/images', {
      name: formValues.title,
      description: formValues.description,
    }).then((res) => res.json()).then((res) => {
      setImageLoading(false);
      setGeneratedImage(res.data);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', /* Alinea el contenido al principio */
        padding: '20px',
        width: '100%',
        height: '100%',
      }}>
        <Card style={{ paddingInline: '2rem', paddingBlock: '1rem', width: '100%', height: '100%' }}>
          <h1>Crear Sección</h1>
          <hr />
          <p style={{
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            Aquí podrás crear una nueva sección en la plataforma <br />
            Cada sección tendrá diferentes contenidos agrupados por temas, franjas de tiempo, etc.  
            Opcionalmente podrás cargar una imagen de portada, sino, nosotros la crearemos por tí.<br />
            Una vez creada la sección, podrás agregarle contenidos en PDF, que será procesado por AdaptarIA para tus alumnos
          </p>
          <h3>Detalles de la sección</h3>
          <hr />
          <Input name="title" type="text" placeholder="Nombre" className="mb-3" onChange={handleFormChange('title')} />
          <Input name="description" type="textarea" placeholder="Descripción de la sección" className="mb-3" onChange={handleFormChange('description')} />
          
          <div className='d-flex flex-row mb-3 gap-3'>
            <Input name="visible" type='checkbox' id='visible' onClick={() => {
              setFormValues({
                ...formValues,
                visible: !formValues.visible
              });
            }} checked={formValues.visible} />
            <Label for='visible'>Visible</Label>
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
            <Input type='checkbox' name='auto-generate' id='auto-generate' onClick={e => setAutoGenerateImage(!autoGenerateImage)} checked={autoGenerateImage} />
            <Label for='auto-generate'>Generar imagen automáticamente</Label>
          </div>

          {autoGenerateImage ? (<div style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            {imageLoading ? <button style={{
              backgroundColor: '#4d3a8e',
              color: 'white',
              padding: '1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1rem',
            }}
              disabled
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} spin />
              Generando Imagen...
            </button> : (generatedImage ? <img src={generatedImage} alt="Generated" style={{
              width: '200px',
              borderRadius: '0.5rem',
              objectFit: 'cover',
              overflow: 'hidden',
            }} /> : <button style={{
              backgroundColor: '#4d3a8e',
              color: 'white',
              padding: '1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1rem',
            }}
              onClick={generateImage}
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              Generar Imagen
            </button>)}

          </div>) : <div style={{
            flex: '1',
          }}>
            <Input name="image" type="text" placeholder="URL de la portada del curso" className="mb-3" onChange={handleFormChange('image')} />
          </div>}
          <div className='d-flex flex-row justify-content-end'>
            <button className="btn-purple-1" onClick={createSection}>
              Crear
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
