import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from 'reactstrap'; // Importa el componente Badge

import { RootState } from '../../redux/store';
import { del, get } from '../../utils/network';

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import empty from '../../assets/images/empty.svg';
import placeholder from '../../assets/images/placeholder.webp';
import '../../assets/styles/CourseDetailPage.css';
import PageWrapper from '../../components/PageWrapper';
import { SwalUtils } from '../../utils/SwalUtils';

interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  image: string;
}

interface ICourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  matriculationCode: string;
  teacherId: string;
  students: Array<{ id: string; firstName: string; lastName: string }>;
}

export const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [sections, setSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCourse(), fetchSections()]).then(() => setLoading(false));
  }, [courseId]);

  // Fetch course details
  const fetchCourse = () => get(`/courses/${courseId}`)
    .then(res => res.json())
    .then(res => res.data)
    .then((data: ICourse) => {
      setCourse(data);
    });

  // Fetch sections details
  const fetchSections = () => {
    get(`/courses/${courseId}/sections`)
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ISection[]) => {
        setSections(data);
      });
  };

  const handleNewSection = () => {
    navigate(`/courses/${courseId}/new-section`);
  };

  const handleDeleteSection = async (sectionId: string) => {
    SwalUtils.infoSwal(
      '¿Estás seguro de que quieres eliminar esta sección?',
      'Esta acción eliminará la sección y no podrá deshacerse.',
      'Sí',
      'No',
      async () => {
        await del(`/courses/${courseId}/sections/${sectionId}`);
        await fetchSections();
        SwalUtils.successSwal(
          'Sección eliminada',
          'La sección se ha eliminado con éxito.',
          'Aceptar',
          () => navigate(`/courses/${courseId}`),
          () => navigate(`/courses/${courseId}`)
        );
      }
    );
  };

  const handleEditSection = (sectionId: string) => {
    navigate(`/courses/${courseId}/sections/${sectionId}/edit`);
  };

  const visibleSections = sections.filter(
    section => user.role !== 'STUDENT' || section.visible
  );

  return (
    <PageWrapper title={course?.title ?? 'Cargando...'}
      loading={loading}
      skeletonType='card'
      buttons={
        user.role === 'TEACHER' && (
          <div className='d-flex flex-row gap-3'>
            <button className="btn-purple-1" onClick={handleNewSection}>Nueva Sección</button>
            <button className='btn-purple-2' onClick={() => navigate(`/courses/${courseId}/students`)}>Estudiantes</button>
          </div>
        )
      }
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        overflowY: 'auto',
      }}>
        {visibleSections.length ? (
          <div className="container" style={{
            marginBlock: 'auto',
          }}>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
              {visibleSections.map((section) => (
                <div key={section.id} className="col">
                  <div className="card h-100">

                    <div className="card-img-container position-relative" style={{ paddingBottom: '66.67%', overflow: 'hidden' }}>

                      <img
                        src={section.image ? section.image : placeholder}
                        className="card-img-top position-absolute top-0 start-0 w-100 h-100"
                        alt={section.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />

                    </div>
                    {user.role === 'TEACHER' && (
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <Badge
                          color={section.visible ? 'success' : 'danger'}
                          style={{
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem'
                          }}>
                          {section.visible ? 'Visible para los estudiantes' : 'No visible para los estudiantes'}
                        </Badge>
                      </div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title fs-4 fs-md-3 mb-3">{section.name}</h5>
                      <p className="card-text flex-grow-1 fs-6 fs-md-5">{section.description}</p>
                    </div>
                    <div className="card-footer d-flex flex-column flex-md-row justify-content-end align-items-center gap-3">
                      <button className='btn-purple-1 w-100 w-md-auto' onClick={() => navigate(`/courses/${courseId}/sections/${section.id}`)}>Ver sección</button>
                      {user.role === 'TEACHER' && (
                        <div className='d-flex gap-3 flex-column flex-md-row'>
                          <button className='btn-purple-2 w-100 w-md-auto' onClick={() => handleEditSection(section.id)}><FontAwesomeIcon icon={faEdit} /></button>
                          <button className='btn-purple-2 w-100 w-md-auto' onClick={() => handleDeleteSection(section.id)}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      )}
                    </div>



                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <img src={empty} alt="No sections available" />
            {user.role === 'STUDENT' ? (
              <>
                <h3>Parece que aún no hay secciones en este curso.</h3>
                <h4>Por favor intentá de nuevo más tarde</h4>
              </>
            ) : (
              <>
                <h3>Parece que aún no has creado ninguna sección en este curso.</h3>
                <h4>Por favor creá una sección para comenzar a añadir contenido.</h4>
              </>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
