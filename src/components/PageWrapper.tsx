import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, CardFooter, CardText, CardTitle, Col, Placeholder, Progress, Spinner } from "reactstrap";
import user from "../redux/slices/user";
import CardsSkeleton from "./CardsSkeleton";
import { useEffect, useState } from "react";

interface IPageWrapperProps {
  title: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  loading?: boolean;
}

export default function PageWrapper(props: IPageWrapperProps) {

  const [showPageLoading, setShowPageLoading] = useState(false);

  const debounce = () => setTimeout(() => setShowPageLoading(true), 300);

  useEffect(() => {
    debounce();
  }, []);

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', /* Alinea el contenido al principio */
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%', marginBottom: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <h4>{props.title}</h4>
          {props.buttons}
        </div>
        <hr />
        {props.loading && showPageLoading ? <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
            opacity: 0.5,
          }}
        >
          <div className="container" style={{
            marginTop: 'auto',
            marginBottom: 'auto',
          }}>
            <CardsSkeleton />
          </div>
        </div> : (props.loading && !showPageLoading ? <></> : props.children)}
      </Card>
    </div>
  </div>
}