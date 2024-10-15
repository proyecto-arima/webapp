import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagicWandSparkles, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { IContent } from "../SectionContentDashboardPage";

import empty from '../../../assets/images/empty.svg';
import { UserState } from "../../../redux/slices/user";
import { post } from "../../../utils/network";

interface ISectionContentDashboardFormStudentsProps {
  content: IContent[];
  user: UserState;
  courseId: string;
  sectionId: string;
}

export default function SectionContentDashboardFormStudents({ content, user, courseId, sectionId }: ISectionContentDashboardFormStudentsProps) {

  const navigate = useNavigate();

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


  const urlByProfile = {
    'DIVERGENTE': 'map',
    'ASIMILADOR': 'summary',
    'ACOMODADOR': 'audio',
    'CONVERGENTE': 'game'
  }

  return (content?.length ? <Table>
    <thead>
      <tr>
        <th>Contenido</th>
        <th>¿Que te parece el contenido?</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {content.map(c => (
        <tr key={c.id}>
          <td>{c.title}</td>
          {user.role === 'TEACHER' && <td>
            {
              c.publicationType === 'AUTOMATIC' ? 'Automático' :
                c.publicationType === 'DEFERRED' ? 'Diferido' : 'Default'
            }
          </td>}
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
            <button className="btn-purple-2"
              onClick={() => {
                navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}?url=${encodeURIComponent(c.presignedUrl)}`);
              }}
            >Ver original</button>
            <button className="btn-purple-1"
              onClick={() => {
                navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}/${urlByProfile[user.learningProfile!]}`);
              }}
            >
              <FontAwesomeIcon icon={faMagicWandSparkles} />
              {' '}
              Ver</button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table> : <div className='d-flex flex-column justify-content-center align-items-center h-100'>
    <img
      src={empty}
    ></img>
    <>
      <h3>Parece que aún no hay contenido en esta sección.</h3>
      <h4>Por favor intenta de nuevo más tarde</h4>
    </>
  </div>)
}
