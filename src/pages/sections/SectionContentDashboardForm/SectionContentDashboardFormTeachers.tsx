import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "reactstrap";
import empty from '../../../assets/images/empty.svg';
import { IContent } from "../SectionContentDashboardPage";
import { UserState } from "../../../redux/slices/user";
import { ConfirmDialog } from '../../../components/ConfirmDialog'; // Asumiendo que tienes un componente de diálogo de confirmación
import { del } from "../../../utils/network"; // Función para hacer la solicitud DELETE al servidor
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from "react-redux";
import { removeContent } from '../../../redux/slices/sections';

interface ISectionContentDashboardFormTeachersProps {
  content: IContent[];
  user: UserState;
  courseId: string;
  sectionId: string;
}

export default function SectionContentDashboardFormTeachers({ content, user, courseId, sectionId }: ISectionContentDashboardFormTeachersProps) {

  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleConfirm = () => setConfirmOpen(!confirmOpen);

  const handleDeleteContent = (contentId: string) => {
    setSelectedContent(contentId);
    toggleConfirm();
  };

  const confirmDelete = async () => {
    if (selectedContent) {
      await del(`/contents/${selectedContent}`);
      // Actualiza el estado de Redux después de la eliminación en el backend
      dispatch(removeContent({ sectionId, contentId: selectedContent }));
    }
    toggleConfirm();
  };

  return (content?.length ? (
    <>
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
              <td>{c.publicationType}</td>
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
                    navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}/map`);
                  }}
                >Ver contenido generado</button>
                {user.role === 'TEACHER' && (
                  <Button color="danger"
                    onClick={() => handleDeleteContent(c.id)}
                    title="Eliminar contenido"
                  >
                    <FontAwesomeIcon icon={faTrash} /> {/* El ícono del tacho de basura */}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        toggle={toggleConfirm}
        onConfirm={confirmDelete}
        onCancel={toggleConfirm}
        message="¿Estás seguro de que quieres eliminar este contenido?"
      />
    </>
  ) : (
    <div className='d-flex flex-column justify-content-center align-items-center h-100'>
      <img src={empty} alt="Sin contenido"></img>
      <h3>Parece que aún no has subido ningún contenido en esta sección.</h3>
      <h4>Por favor sube un contenido para que pueda ser procesado por AdaptarIA</h4>
    </div>
  ));
}
