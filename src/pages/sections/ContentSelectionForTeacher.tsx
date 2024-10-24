import { faRefresh, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, CardFooter } from "reactstrap";
import Swal from "sweetalert2";
import ai_thinking from "../../assets/images/ai_thinking.gif";
import audio from "../../assets/images/audio.png";
import game from "../../assets/images/game.png";
import map from "../../assets/images/map.png";
import summmary from "../../assets/images/summary.png";
import { get, patch, post } from "../../utils/network";

export interface IContent {
  id: string;
  title: string;
  publicationType: string;
  presignedUrl: string;
  status: string;
  generated: any[];
}

export default function ContentSelectionForTeacher() {

  const { courseId, sectionId, contentId } = useParams<{ courseId: string, sectionId: string, contentId: string }>();
  const navigate = useNavigate();

  const [content, setContent] = useState<IContent>();

  const getContent = () => {
    get(`/contents/${contentId}`).then(res => res.json()).then(res => res.data).then((data: IContent) => {
      setContent(data);
      return data;
    }).then((data: IContent) => {
      if (data.status !== 'DONE') {
        setTimeout(() => getContent(), 20000);
      }
    });
  };

  const approved = content?.generated?.every(g => g.approved);

  const approveContent = () => {
    patch(`/contents/${contentId}/approval`, {
      mind_map: true,
      gamification: true,
      speech: true,
      summary: true,
    }).then(res => res.json()).then(res => {

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contenido aprobado',
          text: 'El contenido fue aprobado correctamente'
        });
        getContent();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al aprobar el contenido'
        });
      }

    });
  }

  const regenerateContent = () => {
    Swal.fire({
      title: '¿Estás seguro que deseas regenerar todo el contenido?',
      text: 'Esta acción no se puede deshacer, y todo el contenido generado anteriormente se perderá',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (!result.isConfirmed) return

      post(`/contents/${contentId}/regenerate`).then(res => res.json()).then(res => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Contenido enviado para regenerar',
            text: 'El contenido fue regenerado correctamente'
          });
          getContent();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al regenerar el contenido'
          });
        }
      })
    })
  };


  useEffect(() => {
    getContent();
  }, []);

  return (<div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Gestión del Contenido Generado</h2>
        <hr />
        <p style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          Aquí podrás visualizar y gestionar el contenido generado por ADAPTARIA para tus estudiantes en los cuatro formatos propuestos para cada estilo de aprendizaje <br />
          Como docente, podrás editar, aprobar o regenerar el contenido generado por ADAPTARIA.
          Selecciona el contenido que deseas visualizar o gestionar. <br />
          Tus estudiantes, podrán ver el contenido que les fue asignado según el estilo de aprendizaje que hayan obtenido con el Test de Kolb
        </p>
        {content?.status === 'DONE' ? <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '3rem',
            width: '100%',
            alignItems: 'center',
            height: '100%',
            flexWrap: 'wrap',
          }}
        >
          <Card style={{ width: '18rem' }}>
            <img src={summmary} alt="placeholder" />
            <CardBody>

            </CardBody>
            <CardFooter style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
              <button className="btn-purple-1"
                onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/content/${contentId}/summary`)}
              >Ver contenido</button>
            </CardFooter>
          </Card>
          <Card style={{ width: '18rem' }}>
            <img src={game} alt="placeholder" style={{
              margin: '1rem',
            }} />
            <CardBody>

            </CardBody>
            <CardFooter style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
              <button className="btn-purple-1"
                onClick={() => {
                  navigate(`/courses/${courseId}/sections/${sectionId}/content/${contentId}/game/edit`);
                }}
              >Ver contenido</button>
            </CardFooter>
          </Card>
          <Card style={{ width: '18rem' }}>
            <img src={audio} alt="placeholder" style={{
              margin: '1rem',
            }} />
            <CardBody>

            </CardBody>
            <CardFooter style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
              <button className="btn-purple-1"
                onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/content/${contentId}/audio/edit`)}
              >Ver contenido</button>
            </CardFooter>
          </Card>
          <Card style={{ width: '18rem' }}>
            <img src={map} alt="placeholder" />
            <CardBody>

            </CardBody>
            <CardFooter style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
              <button className="btn-purple-1"
                onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/content/${contentId}/map`)}
              >Ver contenido</button>
            </CardFooter>
          </Card>
          <div
            className="d-flex justify-content-end w-100 mt-3"
          >
            <div className="d-flex flex-column gap-3">

              <button className="btn-red-1" onClick={regenerateContent}>
                <FontAwesomeIcon icon={faRefresh} />
                {' '}
                Regenerar
              </button>
              {!approved && <button className="btn-purple-1" onClick={approveContent}>
                <FontAwesomeIcon icon={faThumbsUp} />
                {' '}
                Aprobar
              </button>}


            </div>

          </div>
        </div> : <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
          {/* <img src={processing} alt="processing" height={600}/> */}
          <img src={ai_thinking} alt="placeholder" style={{
            width: '30rem',
          }} />
          <h3>El contenido aún se encuentra procesándose</h3>
          <h4>Por favor, vuelva más tarde</h4>
        </div>}
      </Card>
    </div>
  </div>);
}