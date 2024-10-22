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

    // Enviar el contenido usando la función post de network
    fetch(`${API_URL}/courses/${courseId}/sections/${sectionId}/contents`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(res => res.json()).then(res => {
      navigate(`/courses/${courseId}/sections/${sectionId}`);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      // Validar la extensión del archivo
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'pdf') {
        // Si no es un PDF, mostrar alerta y no permitir la carga
        SwalUtils.errorSwal(
          'Formato de archivo inválido',
          'Solo se permiten archivos con extensión .pdf. Por favor, selecciona un archivo válido.',
          'Aceptar',
          () => navigate(`/courses/${courseId}/sections/${sectionId}/new`)
        );
        // Restablecer el valor del archivo en el formulario
        e.target.value = '';
        setFormValues({ ...formValues, file: null });
        return;
      }
      setFormValues({ ...formValues, file });
    }
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
          <h2>Contenido de la Sección</h2>
          <hr />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <Input
              type="text"
              placeholder="Título"
              onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
            />
            <ReactSelect
              options={[
                { value: 'AUTOMATIC', label: 'Automática' },
                { value: 'DEFERRED', label: 'Diferida' },
              ]}
              placeholder="Modo de publicación"
              onChange={(e) => setFormValues({ ...formValues, publicationType: e?.value })}
            />
            <Input
              type="file"
              placeholder="Archivo"
              onChange={handleFileChange}
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
