import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "reactstrap"
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { get, post } from "../../utils/network";
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { RootState } from "../../redux/store";

import empty from '../../assets/images/empty.svg';
import SectionContentDashboardFormTeachers from "./SectionContentDashboardForm/SectionContentDashboardFormTeachers";
import SectionContentDashboardFormStudents from "./SectionContentDashboardForm/SectionContentDashboardFormStudents";
interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

export interface IContent {
  id: string;
  title: string;
  publicationType: string;
  publicationDate: string;
  presignedUrl: string;
  status: string;
  reactions: { userId: string, isSatisfied: boolean }[];
}

export const SectionContentDashboard = () => {
  const { courseId, sectionId } = useParams<{ courseId: string, sectionId: string }>();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [section, setSection] = useState<ISection | null>(null);
  const [content, setContent] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      get(`/courses/${courseId}/sections/${sectionId}`).then(res => res.json()).then(res => res.data),
      get(`/courses/${courseId}/sections/${sectionId}/contents`).then(res => res.json()).then(res => res.data),
    ])
      .then(([sectionData, contentData]) => {
        setSection(sectionData);
        setContent(contentData);
      })
      .finally(() => setLoading(false));

  }, [courseId, sectionId]);


  const handleNewContent = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}/new`);
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
            {user.role === 'TEACHER' && <button onClick={handleNewContent} className="btn-purple-1">Subir contenido</button>}
          </div>
        </div>
        <hr />

        {loading && user?.role === 'TEACHER' ? <SectionContentDashboardFormTeachers
          courseId={courseId!}
          sectionId={sectionId!}
          content={content}
          user={user}
        /> : <SectionContentDashboardFormStudents
          courseId={courseId!}
          sectionId={sectionId!}
          content={content}
          user={user}
        />}
      </Card>
    </div>
  </div>
};
