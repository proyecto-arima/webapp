import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "reactstrap";
import { get, patch } from "../../../utils/network";
import './GeneratedContentView.css';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Reactions from "../../../components/Reactions";
import PageWrapper from "../../../components/PageWrapper";

interface IGenerated {
  type: string;
  content: string;
  title: string;
}

export interface IContent {
  id: string;
  title: string;
  generated: IGenerated[];
}

export const GeneratedContentView = () => {

  const { courseId, sectionId, contentId } = useParams<{ courseId: string, sectionId: string, contentId: string }>();
  const [content, setContent] = useState<IGenerated>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    get(`/contents/${contentId}/summary`).then(res => res.json()).then(res => res.data).then((data: IGenerated) => setContent(data));
  }, []);

  const saveChanges = () => {
    patch(`/contents/${contentId}/summary`, {
      newContent: content?.content,
    }).then(res => res.json()).then(res => {
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contenido actualizado',
          text: 'El contenido fue actualizado correctamente'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el contenido'
        })
      }
    });
  }

  return <PageWrapper title="Lee con atención"
    goBackUrl={`/courses/${courseId}/sections/${sectionId}/${user.role === 'TEACHER' ? `content/${contentId}/review` : ''}`}
  >
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      gap: '1rem',
    }}>
      <h3>{content?.title}</h3>
      <textarea className="generated-content" value={content?.content} style={{
        width: '80%',
        flex: 1,
        border: 'none',
        scrollbarWidth: 'none',

      }}
        readOnly={user?.role === 'STUDENT'}
        onChange={e => {
          if (!content) return;
          setContent({ ...content, content: e.target.value ?? "" })
        }}
      ></textarea>
    </div>

    {/** FAB Button to save changes only for teachers */}

    {user?.role === 'TEACHER' && <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBlock: '1rem',
      width: '100%',
    }}>
      <button
        className="btn-purple-1"
        onClick={saveChanges}>
        <FontAwesomeIcon icon={faSave} />
        {' '}
        Guardar
      </button>
    </div>}
    {user.role === 'STUDENT' && <Reactions />}
  </PageWrapper>


};