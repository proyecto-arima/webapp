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
import PageWrapper from "../../components/PageWrapper";
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
  visible: boolean;
}

export const SectionContentDashboard = () => {
  const { courseId, sectionId } = useParams<{ courseId: string, sectionId: string }>();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [section, setSection] = useState<ISection | null>(null);
  const [content, setContent] = useState<IContent[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      get(`/courses/${courseId}/sections/${sectionId}`).then(res => res.json()).then(res => res.data).then((data: ISection) => setSection(data)),
      get(`/courses/${courseId}/sections/${sectionId}/contents`).then(res => res.json()).then(res => res.data).then((data: IContent[]) => setContent(data)),
    ]).then(() => setLoading(false));
  }, [courseId, sectionId]);


  const handleNewContent = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}/new`);
  }

  return <PageWrapper
    skeletonType="table"
    columnsCount={5}
    loading={loading}
    title={section?.name ?? 'Cargando...'}
    buttons={
      user.role === 'TEACHER' && (
        <div className='d-flex flex-row gap-3'>
          <button onClick={handleNewContent} className="btn-purple-1">Subir contenido</button>
        </div>
      )
    }>
    {user?.role === 'TEACHER' ? <SectionContentDashboardFormTeachers
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
  </PageWrapper>
};
