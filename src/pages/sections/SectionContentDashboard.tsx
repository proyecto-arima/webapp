import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "reactstrap";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { get } from "../../utils/network";
import { RootState } from "../../redux/store";
import PageWrapper from "../../components/PageWrapper";

interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

interface IContent {
  id: string;
  title: string;
  publicationType: string;
  presignedUrl: string;
}

export const SectionContentDashboard = () => {
  const { courseId, sectionId } = useParams<{ courseId: string, sectionId: string }>();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [section, setSection] = useState<ISection | null>(null);
  const [content, setContent] = useState<IContent[]>([]);

  useEffect(() => {
    get(`/courses/${courseId}/sections/${sectionId}`).then(res => res.json()).then(res => res.data).then((data: ISection) => setSection(data));
    get(`/courses/${courseId}/sections/${sectionId}/contents`).then(res => res.json()).then(res => res.data).then((data: IContent[]) => setContent(data));
  }, [courseId, sectionId]);

  const handleNewContent = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}/new`);
  };

  const handleEditTitle = (contentId: string) => {
    navigate(`/courses/${courseId}/sections/${sectionId}/contents/${contentId}/edit-title`);
  };


  return (
    <PageWrapper 
      title={section?.name || ''}
      goBackUrl={`/courses/${courseId}`}
      buttons={
        user.role === 'TEACHER' &&
        <button onClick={handleNewContent} className="btn-purple-1">Subir contenido</button>
      }
    >
      <Table>
        <thead>
          <tr>
            <th>Contenido</th>
            <th>Modo de Publicación</th>
            {user.role === 'STUDENT' && <th>¿Qué te parece el contenido?</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {content.map(c => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>
                {
                  c.publicationType === 'AUTOMATIC' ? 'Automático' :
                    c.publicationType === 'DEFERRED' ? 'Diferido' : 'Default'
                }
              </td>
              {user.role === 'STUDENT' &&
                <td>
                  <div style={{
                    display: 'flex',
                    gap: '2rem',
                    fontSize: '1.5rem'
                  }}>
                  </div>
                </td>
              }
              <td style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
              }}>
                <button
                  className="btn-purple-2"
                  onClick={() => handleEditTitle(c.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn-purple-2"
                  onClick={() => {
                    navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}?url=${encodeURIComponent(c.presignedUrl)}`);
                  }}
                >Ver PDF</button>
                <button className="btn-purple-1"
                  onClick={() => {
                    navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}/view`);
                  }}
                >Ver contenido generado</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageWrapper>
  );
};
