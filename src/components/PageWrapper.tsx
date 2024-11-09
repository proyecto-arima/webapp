import { faArrowLeft, faChevronLeft, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, CardFooter, CardText, CardTitle, Col, Placeholder, Progress, Spinner, Table } from "reactstrap";
import user from "../redux/slices/user";
import CardsSkeleton from "./CardsSkeleton";
import { useEffect, useState } from "react";
import TableSkeleton from "./TableSkeleton";
import { useNavigate } from "react-router-dom";

interface IPageWrapperProps {
  title: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  loading?: boolean;
  skeletonType?: 'card' | 'table' | 'content-selection';
  columnsCount?: number;
  goBackUrl?: string;
}

export default function PageWrapper({ ...props}: IPageWrapperProps) {

  const [showPageLoading, setShowPageLoading] = useState(false);

  const debounce = () => setTimeout(() => setShowPageLoading(true), 300);

  const navigate = useNavigate();

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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            {props.goBackUrl && <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '1rem', marginBottom:'8px', cursor:'pointer' }} onClick={
              () => navigate(props.goBackUrl!) 
            }/>}
            <h4>{props.title}</h4>
          </div>
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
          {props.skeletonType === 'card' ? <div className="container" style={{
            marginTop: 'auto',
            marginBottom: 'auto',
          }}>
            <CardsSkeleton />
          </div> : props.skeletonType === 'table' ? <div style={{
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
          }}>
            <TableSkeleton columnsCount={props.columnsCount} />
          </div> : props.skeletonType === 'content-selection' ? <div style={{
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
          }}>

            <Placeholder as={'p'} animation="glow" className="d-flex flex-column gap-1">
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <TableSkeleton columnsCount={3} />
            </Placeholder>
          </div> : null}
        </div> : (props.loading && !showPageLoading ? <></> : props.children)}
      </Card>
    </div>
  </div>
}