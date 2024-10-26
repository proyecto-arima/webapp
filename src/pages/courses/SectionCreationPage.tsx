import React, { useState } from 'react';
import { Card, Input, Label } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { post } from '../../utils/network';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { SwalUtils } from '../../utils/SwalUtils';
import Swal from 'sweetalert2';
import { API_URL } from '../../config';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFormChange = (label: keyof ISectionCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormValues({
      ...formValues,
      [label]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  
      if (!validFileTypes.includes(file.type)) {
        SwalUtils.errorSwal(
          'Formato de archivo inválido',
          'Solo se permiten archivos con extensión .png, .jpeg o .jpg Por favor, selecciona un archivo válido.',
          'Aceptar',
          () => navigate(`/courses/${courseId}/new-section`))
          e.target.value = "";
        setSelectedFile(null);
        return;
      }
  
      setSelectedFile(file);
    }
  };

  const createSection = async () => {
    if (!formValues.title) {
      SwalUtils.errorSwal(
        'Error al crear la sección',
        'Debes ingresar un nombre para la sección antes de continuar.',
        'Aceptar',
        () => navigate(`/courses/${courseId}/new-section`)
      );
      return;
    }

    let imageUrl = generatedImage || formValues.image;

    // Cuando no se genera automáticamente la imagen y se sube un archivo:
    if (!autoGenerateImage && selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`${API_URL}/images/url/`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const json = await res.json();
      imageUrl = json.data;
    }

    const body = {
      ...formValues,
      name: formValues.title,
      title: undefined,
      image: imageUrl,
    };

    return post(`/courses/${courseId}/section`, { ...body })
      .then((res) => res.json())
      .then(() => {
        SwalUtils.successSwal(
          'Sección creada',
          'La sección se ha creado exitosamente.',
          'Aceptar',
          () => navigate(`/courses/${courseId}`),
          () => navigate(`/courses/${courseId}`)
        );
      })
      .catch((error) => {
        SwalUtils.errorSwal(
          'Error',
          'Hubo un problema al crear la sección. Por favor, intenta nuevamente.',
          'Aceptar',
          () => navigate(`/courses/${courseId}`)
        );
      });
  };

  const generateImage = () => {
    if (!formValues.title) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar un nombre para la sección antes de generar la imagen.',
      });
    }

    if (!formValues.description) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar una descripción para la sección antes de generar la imagen.',
      });
    }

    setImageLoading(true);

    Swal.fire({
      title: 'Generar imagen con IA',
      html: 'Tu imagen se generará utilizando IA a partir del nombre y descripción de la sección. Este proceso puede tardar unos segundos. Para continuar presione ok.',
      icon: 'info',
      showCancelButton: !imageLoading,
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: async () => {
        Swal.showLoading();
        return post('/images', {
          name: formValues.title,
          description: formValues.description,
        }).then((res) => res.json()).then((res) => {
          setImageLoading(false);
          setGeneratedImage(res.data);
          return res;
        });
      }
    }).then((result) => {
      setImageLoading(false);
      if (result.isConfirmed) {
        const generatedImage = result.value.data;
        Swal.fire({
          title: 'Imagen generada',
          html: `<img src="${generatedImage}" style="width: 200px; border-radius: 0.5rem; object-fit: cover;" />`,
          icon: 'success',
          confirmButtonText: '¡La quiero!',
          showCancelButton: true,
          showDenyButton: true,
          denyButtonText: 'Regenerar',
        }).then((result) => {
          if (result.isDenied) {
            generateImage();
          }
          if (result.isDismissed) {
            setGeneratedImage(null);
          }
        });
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', backgroundColor: '#f6effa', width: '100vw' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px', width: '100%', height: '100%' }}>
        <Card style={{ paddingInline: '2rem', paddingBlock: '1rem', width: '100%', height: '100%' }}>
          <h1>Crear Sección</h1>
          <hr />
          <p style={{ textAlign: 'left', marginBottom: '2rem', color: '#6b7280' }}>
            Acá podés crear una nueva sección en la plataforma. Cada sección tendrá diferentes contenidos agrupados por temas, franjas de tiempo, etc. 
            Opcionalmente podés cargar una imagen de portada, sino, nosotros la creamos por vos. Una vez creada la sección, podrás agregarle contenidos en PDF.
          </p>
          <h3>Detalles de la sección</h3>
          <hr />
          <Input name="title" type="text" placeholder="Nombre" className="mb-3" onChange={handleFormChange('title')} />
          <Input name="description" type="textarea" placeholder="Descripción de la sección" className="mb-3" onChange={handleFormChange('description')} />
          
          <div className='d-flex flex-row mb-3 gap-3'>
            <Input name="visible" type='checkbox' id='visible' onClick={() => setFormValues({ ...formValues, visible: !formValues.visible })} checked={formValues.visible} />
            <Label for='visible'>Visible</Label>
          </div>

          <h3>Imagen</h3>
          <hr />
          <p style={{ textAlign: 'left', marginBottom: '2rem', color: '#6b7280' }}>
            Para generar una imagen automáticamente a partir del nombre y descripción de la sección, clickea en Generar Imagen y espera que la magia ocurra. 
            También puedes subir un archivo con extensión .png, .jpeg o .jpg para elegir manualmente la imagen de la sección, si lo prefieres.
          </p>
          <div className='d-flex flex-row mb-3 gap-3'>
            <Input type='checkbox' name='auto-generate' id='auto-generate' onClick={e => setAutoGenerateImage(!autoGenerateImage)} checked={autoGenerateImage} />
            <Label for='auto-generate'>Generar imagen automáticamente</Label>
          </div>

          {autoGenerateImage ? (
            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {imageLoading ? (
                <button style={{ backgroundColor: '#4d3a8e', color: 'white', padding: '1rem', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }} disabled>
                  <FontAwesomeIcon icon={faWandMagicSparkles} spin />
                  Generando Imagen...
                </button>
              ) : (generatedImage ? (
                <img src={generatedImage} alt="Generated" style={{ width: '200px', borderRadius: '0.5rem', objectFit: 'cover' }} />
              ) : (
                <button style={{ backgroundColor: '#4d3a8e', color: 'white', padding: '1rem', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={generateImage}>
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                  Generar Imagen
                </button>
              ))}
            </div>
          ) : (
            <div>
              <Input name="file" type="file" className="mb-3" onChange={handleFileChange} />
            </div>
          )}

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
