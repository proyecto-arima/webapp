import { useParams, useSearchParams } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";

export const RawContentView = () => {

  const [searchParams, setUrlSearchParams] = useSearchParams();

  const { courseId, sectionId} = useParams<{ courseId: string, sectionId: string }>();


  return (
    <PageWrapper title="Contenido original" goBackUrl={`/courses/${courseId}/sections/${sectionId}`}>
      <iframe src={searchParams.get('url') as string} style={{ width: '100%', height: '100%' }}></iframe>
    </PageWrapper>

  )
};