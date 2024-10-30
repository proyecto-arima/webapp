import { useSearchParams } from "react-router-dom";
import { Card } from "reactstrap";
import PageWrapper from "../../components/PageWrapper";

export const RawContentView = () => {

  const [searchParams, setUrlSearchParams] = useSearchParams();

  return (
    <PageWrapper title="Contenido original">
      <iframe src={searchParams.get('url') as string} style={{ width: '100%', height: '100%' }}></iframe>
    </PageWrapper>

  )
};