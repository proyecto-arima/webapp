import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import { Card, Input } from "reactstrap";
import { API_URL } from "../../config";
import { post } from "../../utils/network";

interface IContentCreationFormValues {
  title?: string;
  publicationType?: string;
  file?: any;
}

export const SectionContentCreation = () => {

  const [formValues, setFormValues] = useState<IContentCreationFormValues>();
  const { courseId, sectionId } = useParams<{ courseId: string, sectionId: string }>();
  const navigate = useNavigate();

  // multipart/form-data
  const createContent = () => {

    const formData = new FormData();
    formData.append('title', formValues?.title as string);
    formData.append('publicationType', formValues?.publicationType as string);
    formData.append('file', formValues?.file as string);


    fetch(`${API_URL}/courses/${courseId}/sections/${sectionId}/content`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(res => res.json()).then(res => {
      navigate(`/courses/${courseId}/sections/${sectionId}`);
    }
    );
  }


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <Card style={{ width: '90%', paddingInline: '2rem', paddingBlock: '1rem', height: '90%' }}>
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
  );
}