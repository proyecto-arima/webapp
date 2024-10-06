import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import { Card, Input } from "reactstrap";
import { API_URL } from "../../config";
import { post } from "../../utils/network";
import { SwalUtils } from "../../utils/SwalUtils";

interface IContentCreationFormValues {
  title?: string;
  publicationType?: string;
  file?: any;
}

export const SectionContentCreation = () => {

  const [formValues, setFormValues] = useState<IContentCreationFormValues>({});
  const { courseId, sectionId } = useParams<{ courseId: string, sectionId: string }>();
  const navigate = useNavigate();

  // multipart/form-data
  const createContent = () => {

    const formData = new FormData();
    formData.append('title', formValues?.title as string);
    formData.append('publicationType', formValues?.publicationType as string);
    formData.append('file', formValues?.file as string);

      if (!formValues.title) {
        SwalUtils.errorSwal(
          'Error en la creación de contenido',
          'El título no puede estar vacío. Por favor, ingresa un título válido.',
          'Aceptar',
          () => navigate(`/courses/${courseId}/sections/${sectionId}/new`)
        );
        return;
      }
  
      // Expresión regular para permitir caracteres alfanuméricos, espacios y letras con tildes
      const alphanumericWithAccentsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
  
      if (!alphanumericWithAccentsRegex.test(formValues.title)) {
        SwalUtils.errorSwal(
          'Error en el título',
          'El título solo puede contener letras, números, espacios y tildes.',
          'Aceptar',
          () => navigate(`/courses/${courseId}/sections/${sectionId}/new`)
        );
        return;
      }

    // TODO: Usar post de utils/network
    fetch(`${API_URL}/courses/${courseId}/sections/${sectionId}/contents`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(res => res.json()).then(res => {
      navigate(`/courses/${courseId}/sections/${sectionId}`);
    }
    );
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
        <h2>Contenido de la Sección</h2>
        <hr />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Input type="text" placeholder="Título" onChange={(e) => setFormValues({ ...formValues, title: e.target.value })} />
          <ReactSelect options={[
            { value: 'AUTOMATIC', label: 'Automática' },
            { value: 'DEFERRED', label: 'Diferida' },
          ]} 
          placeholder="Modo de publicación" 
          onChange={(e) => setFormValues({ ...formValues, publicationType: e?.value })}
          />
          <Input type="file" placeholder="Archivo" 
          onChange={(e) => setFormValues({ ...formValues, file: e.target?.files?.[0] })}
          />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button className="btn-purple-1" onClick={createContent}> Crear </button>
        </div>
        </div>
      </Card>
    </div>
  </div>
  );
};
