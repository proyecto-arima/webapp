import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "reactstrap"
import { get } from "../../utils/network";

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
  const navigate = useNavigate();

  const [section, setSection] = useState<ISection | null>(null);
  const [content, setContent] = useState<IContent[]>([]);


  // Fetch section data
  useEffect(() => {
    get(`/courses/${courseId}/sections/${sectionId}`).then(res => res.json()).then(res => res.data).then((data: ISection) => setSection(data));
    get(`/courses/${courseId}/sections/${sectionId}/content`).then(res => res.json()).then(res => res.data).then((data: IContent[]) => setContent(data));
  }, [courseId, sectionId]);


  const handleNewContent = () => {
    navigate(`/courses/${courseId}/sections/${sectionId}/new`);
  }

  return <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', /* Alinea el contenido al principio */
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
                }}><button className="btn-purple-1"
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
      </Card>
    </div>
  </div>

};