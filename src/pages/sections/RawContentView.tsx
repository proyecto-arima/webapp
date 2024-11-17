import { useSearchParams } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";

export const RawContentView = () => {

  const [searchParams, setUrlSearchParams] = useSearchParams();

  const getCourseFromURL = () => {
    return window.location.pathname.split('/')[2];
  }

  const getSectionFromURL = () => {
    return window.location.pathname.split('/')[4];
  }

  return (
    <PageWrapper title="Contenido original" goBackUrl={`/courses/${getCourseFromURL()}/sections/${getSectionFromURL()}`}>
      <iframe src={searchParams.get('url') as string} style={{ width: '100%', height: '100%' }}></iframe>
    </PageWrapper>

  )
};