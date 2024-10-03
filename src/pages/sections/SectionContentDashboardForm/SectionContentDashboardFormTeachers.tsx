import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import empty from '../../../assets/images/empty.svg';
import { IContent } from "../SectionContentDashboardPage";
import { UserState } from "../../../redux/slices/user";

interface ISectionContentDashboardFormTeachersProps {
  content: IContent[];
  user: UserState;
  courseId: string;
  sectionId: string;
}

export default function SectionContentDashboardFormTeachers({ content, user, courseId, sectionId }: ISectionContentDashboardFormTeachersProps) {
  const navigate = useNavigate();

  return (content?.length ? (
    <Table>
      <thead>
        <tr>
          <th>Contenido</th>
          <th>Modo de publicación</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {content.map(c => (
          <tr key={c.id}>
            <td>{c.title}</td>
            <td>
              {c.publicationType === 'AUTOMATIC' ? 'Automático' :
                c.publicationType === 'DEFERRED' ? 'Diferido' : 'Default'
              }
            </td>
            <td style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
            }}>
              <button className='btn-purple-2' onClick={() => {
                  navigate(`/courses/${courseId}/sections/${sectionId}/contents/${c.id}/edit-title`);
                }}>
              <FontAwesomeIcon icon={faEdit} />

              </button>
              <button className="btn-purple-2"
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
  ) : (
    <div className='d-flex flex-column justify-content-center align-items-center h-100'>
      <img src={empty}></img>
      <h3>Parece que aún no has subido ningún contenido en esta sección.</h3>
      <h4>Por favor sube un contenido para que pueda ser procesado por AdaptarIA</h4>
    </div>
  ));
}
