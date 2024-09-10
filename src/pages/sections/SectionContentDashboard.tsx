import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "reactstrap"
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { get, post } from "../../utils/network";
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { RootState } from "../../redux/store";

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
  }

  const sendContentReaction = (id: string, _isSatisfied: boolean): void => {
    post(`/contents/${id}/reactions`, { isSatisfied: _isSatisfied })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to send content reaction');
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        console.error(`An unexpected error occurred while sending the content reaction: ${err}`);
      });
  }

  return <div
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
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <div className="course-detail-header">
          <h1>{section?.name}</h1>
          <div className='d-flex flex-row gap-3'>
            <button onClick={handleNewContent} className="btn-purple-1">Subir contenido</button>
          </div>
        </div>
        <hr />

        <Table>
          <thead>
            <tr>
              <th>Contenido</th>
              <th>Modo de Publicación</th>
              {user.role === 'STUDENT' && <th>¿Que te parece el contenido?</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {content.map(c => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.publicationType}</td>
                {user.role === 'STUDENT' &&
                  <td>
                    <div style={
                      {
                        display: 'flex',
                        gap: '2rem',
                        fontSize: '1.5rem'
                      }
                    }>
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        onClick={() => {
                          sendContentReaction(c.id, true);
                        }}
                        style={{
                          color: '#4d3a8e',
                          cursor: 'pointer'
                        }} />
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        onClick={() => {
                          sendContentReaction(c.id, false);
                        }}
                        style={{
                          color: 'lightgray',
                          cursor: 'pointer'
                        }} />
                    </div>
                  </td>
                }
                <td style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                }}>
                  <button className="btn-purple-1"
                    onClick={() => {
                      navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}?url=${encodeURIComponent(c.presignedUrl)}`);
                    }}
                  >Ver PDF</button>
                  <button className="btn-purple-1"
                    onClick={() => {
                      navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}/map`);
                    }}
                  >Ver contenido generado</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  </div>
};
