import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Input, Label } from 'reactstrap';
import { addCourse } from '../../redux/slices/courses';
import { post } from '../../utils/network';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { SwalUtils } from '../../utils/SwalUtils';
import { API_URL } from '../../config';

interface ICourseCreationFormValues {
  title?: string;
  description?: string;
  image?: string;
  students?: { value: string; label: string }[];
}

export const CourseCreationPage = () => {
  const [formValues, setFormValues] = useState<ICourseCreationFormValues>({ students: [] });
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormChange = (label: keyof ICourseCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [label]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const createCourse = async () => {
    if (!formValues.title) {
      SwalUtils.errorSwal(
        'Error al crear el curso',
        'Debes ingresar un nombre para el curso antes de continuar.',
        'Aceptar',
        () => navigate(`/courses/create`)
      );
      return;
    }
  
    // Expresión regular para permitir caracteres alfanuméricos, espacios y letras con tildes
    const alphanumericWithAccentsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
  
    const titleInvalid = !alphanumericWithAccentsRegex.test(formValues.title);
    const descriptionInvalid = formValues.description && !alphanumericWithAccentsRegex.test(formValues.description);
  
    if (titleInvalid && descriptionInvalid) {
      SwalUtils.errorSwal(
        'Error en los campos',
        'El título y la descripción solo pueden contener letras, números, espacios y tildes.',
        'Aceptar',
        () => navigate(`/courses/create`)
      );
      return;
    }
  
    if (titleInvalid) {
      SwalUtils.errorSwal(
        'Error en el título',
        'El título solo puede contener letras, números, espacios y tildes.',
        'Aceptar',
        () => navigate(`/courses/create`)
      );
      return;
    }
  
    if (descriptionInvalid) {
      SwalUtils.errorSwal(
        'Error en la descripción',
        'La descripción solo puede contener letras, números, espacios y tildes.',
        'Aceptar',
        () => navigate(`/courses/create`)
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
        body: formData
      })

      const json = await res.json();
      imageUrl = json.data;
    }

    const body = {
      ...formValues,
      name: formValues.title,
      image: imageUrl,
    };
  
    return post('/courses', { ...body })
      .then((res) => res.json())
      .then((res) => {
        dispatch(addCourse(res.data));

        Swal.fire({
          title: 'Curso creado exitosamente',
          html: `El curso ha sido creado correctamente. La clave de matriculación es: <strong>${res.data.matriculationCode}</strong>`,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate('/courses/dashboard');
        });
      })
      .then(() => {
        navigate('/courses/dashboard');
      });
  };

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

    Swal.fire({
      title: 'Generar imagen con IA',
      html: 'Tu imagen se generará utilizando IA a partir del nombre y descripción del curso. Este proceso puede tardar unos segundos. Para continuar presione ok.',
      icon: 'info',
      showCancelButton: !imageLoading,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancelar',
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
          html: '<img src="' + generatedImage + '" style="width: 200px; border-radius: 0.5rem; object-fit: cover;" />',
          icon: 'success',
          confirmButtonText: '¡La quiero!',
          cancelButtonText: 'Cancelar',
          showCancelButton: true,
          denyButtonText: 'Regenerar',
        }).then((result) => {
          if (result.isDenied) {
            generateImage();
          }
          if(result.isConfirmed) {
            return;
          }
          if(result.isDismissed) {
            setGeneratedImage(null);
          }
        });
      }
    })
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
          <h1>Crear Curso</h1>
          <hr />
          <p style={{
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            Aquí podrás crear un nuevo curso en la plataforma. <br />
            Cada curso debe tener un nombre y una descripción que verán los alumnos al ingresar a la plataforma.
            Opcionalmente podrás cargar una imagen de portada, sino, nosotros la crearemos por tí.<br />
            Una vez creado el curso, podrás agregarle secciones con el contenido deseado, y además matricular alumnos al curso.
            Adicionalmente, se generará un código de automatriculación, para que los alumnos puedan matricularse automáticamente.
          </p>
          <h3>Detalles del curso</h3>
          <hr />
          <Input name="title" type="text" placeholder="Nombre" className="mb-3" onChange={handleFormChange('title')} />
          <Input name="description" type="textarea" placeholder="Descripción del curso" className="mb-3" onChange={handleFormChange('description')} />

          <h3>Imagen</h3>
          <hr />
          <p style={{
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            Para generar una imagen automáticamente a partir del nombre y descripción del curso, clickea en Generar Imagen y espera que la magia ocurra.<br />
            También puedes subir un archivo con extensión .png para elegir manualmente la imagen del curso, si lo prefieres.
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
            <Input type="file" accept=".png" onChange={handleFileChange} className="mb-3" />
          </div>}
          <div className='d-flex flex-row justify-content-end'>
            <button className='btn-purple-1' onClick={createCourse}>Crear Curso</button>
          </div>
        </Card>
      </div>
    </div>
  );
};
