import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import empty from '../../../assets/images/empty.svg';
import { IContent } from "../SectionContentDashboardPage";
import { UserState } from "../../../redux/slices/user";
import { del } from '../../../utils/network';
import { SwalUtils } from '../../../utils/SwalUtils';
import { useDispatch } from 'react-redux';
import { removeContent } from '../../../redux/slices/sections';

interface ISectionContentDashboardFormTeachersProps {
  content: IContent[];
  user: UserState;
  courseId: string;
  sectionId: string;
  
}

export default function SectionContentDashboardFormTeachers({ content, user, courseId, sectionId }: ISectionContentDashboardFormTeachersProps) {
  const [localContent, setLocalContent] = useState<IContent[]>(content);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0'); // Usa el día en UTC
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Usa el mes en UTC (0-11)
    return `${day}/${month}`; // Devuelve la fecha en formato dd/mm
};

  const handleDeleteContent = async (contentId: string) => {
    SwalUtils.infoSwal(
      '¿Estás seguro de que quieres eliminar este contenido?',
      'Esta acción eliminará el contenido permanentemente y no podrá deshacerse.',
      'Sí',
      'No',
      async () => {
        await del(`/contents/${contentId}`);
        // Actualiza el estado local eliminando el contenido
        setLocalContent(prevContent => prevContent.filter(c => c.id !== contentId));
        // También despacha la acción para actualizar el estado global de Redux
        dispatch(removeContent({ sectionId, contentId }));
      }
    );
  };

  return (localContent.length ? (
    <Table>
      <thead>
        <tr>
          <th>Contenido</th>
          <th style={{ textAlign: 'center'}}>Modo de publicación</th>
          <th style={{ textAlign: 'center'}}>Reacciones positivas</th>
          <th style={{ textAlign: 'center'}}>Reacciones negativas</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {localContent.map(c => (
          <tr key={c.id}>
            <td>{c.title}</td>
            <td style={{ textAlign: 'center'}}>
              {c.publicationType === 'AUTOMATIC' ? 'Automático' :
                c.publicationType === 'DEFERRED' ? `Diferido - disponible ${formatDate(c.publicationDate)}` : 'Default'
              }
            </td>
            <td style={{
              textAlign: 'center',
            }}>
              {c.reactions.filter(r => r.isSatisfied).length}
              </td>
            <td
              style={{
                textAlign: 'center',
              }}
            >
              {c.reactions.filter(r => !r.isSatisfied).length}
              </td>
            <td style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
            }}>
              <button className="btn-purple-2"
                onClick={() => {
                  navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}?url=${encodeURIComponent(c.presignedUrl)}`);
                }}
              >Ver PDF</button>
              <button className="btn-purple-1"
                onClick={() => {
                  navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}/review`);
                }}
              >Ver contenido generado</button>

              <div style={{
                borderLeft: '1px solid #000000',
                height: 'auto',
                margin: '0 1rem',
              }}></div>

              <button className='btn-purple-2' onClick={() => {
                navigate(`/courses/${courseId}/sections/${sectionId}/contents/${c.id}/edit-title`);
              }}>
                <FontAwesomeIcon icon={faEdit} />
              </button>

              <button className='btn-purple-2' onClick={() => handleDeleteContent(c.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <div className='d-flex flex-column justify-content-center align-items-center h-100'>
      <img src={empty} alt="Sin contenido" />
      <h3>Parece que aún no has subido ningún contenido en esta sección.</h3>
      <h4>Por favor sube un contenido para que pueda ser procesado por AdaptarIA</h4>
    </div>
  ));
}
