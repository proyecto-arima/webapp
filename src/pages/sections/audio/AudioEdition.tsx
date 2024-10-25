import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "reactstrap";
import { get, patch } from "../../../utils/network";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface IAudio {
  content?: { text: string, audioUrl: string }[]
  approved?: boolean;
  type?: string;
}

export default function AudioEdition() {

  const { contentId } = useParams<{ courseId: string, sectionId: string, contentId: string }>();
  const [speech, setSpeech] = useState<IAudio>({});
  const navigate = useNavigate();

  useEffect(() => {
    get(`/contents/${contentId}/speech`).then(response => response.json()).then((response) => {
      setSpeech(response.data);
    });
  }, []);


  const editText = (index: number, text: string) => {
    if (!speech.content) return;
    const newSpeech = [...speech.content];
    newSpeech[index].text = text;
    newSpeech[index].audioUrl = '';
    setSpeech({ ...speech, content: newSpeech });
  }

  const deleteAudio = (index: number) => {
    if (!speech.content) return;
    const newSpeech = [...speech.content];
    newSpeech.splice(index, 1);
    setSpeech({ ...speech, content: newSpeech });
  }

  const addAudio = () => {
    if (!speech.content) return;
    const newSpeech = [...speech.content];
    newSpeech.push({ text: '', audioUrl: '' });
    setSpeech({ ...speech, content: newSpeech });
  }



  const saveAudio = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción comenzará a generar los audios',
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        patch(`/contents/${contentId}/speech`, {
          newContent: speech.content,
        }).then(response => {
          if (response.ok) {
            Swal.fire({
              title: 'Procesando',
              text: 'Te avisaremos cuando esté listo',
              icon: 'success',
            }).then(() => {
              navigate(`/courses/${contentId}/sections/${contentId}/content/${contentId}/review`);
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al generar los audios',
              icon: 'error',
            });
          }
        });
      }
    });
  }

  return (
    <div
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
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
          <h2>Configurar audio</h2>
          <hr />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: '1rem',
            overflowY: 'scroll',
            scrollbarWidth: 'thin',
          }}>

            {speech?.content?.map((audio, index) => (
              <>
                <Card
                  style={{
                    width: '100%',
                    paddingInline: '2rem',
                    paddingBlock: '1rem',
                    marginBlock: '1rem',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  }}
                >
                  <div className="d-flex flex-row justify-content-between w-100">
                    <h3>Audio {index + 1}</h3>
                    <button className="btn-red-1"
                      onClick={() => deleteAudio(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <hr />
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    width: '100%',
                    height: '100%',
                  }}>
                    <textarea style={{
                      width: '100%',
                      border: 'none',
                      height: '20vh',
                    }}
                      value={audio.text}
                      onChange={(e) => editText(index, e.target.value)}
                      maxLength={4096}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '2rem',
                        justifyContent: 'flex-end',
                        color: 'gray',
                        fontSize: '0.8rem',
                      }}
                    >
                      <p>Caracteres: {audio.text.length}/4096</p>
                    </div>
                    <audio controls style={{
                      width: '100%',
                    }}>
                      <source src={audio.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </Card>
              </>
            ))}

            <div className="d-flex flex-row justify-content-end w-100 gap-3">
              <button className="btn-purple-2"
                onClick={addAudio}
              >
                Agregar audio
              </button>

              <button className="btn-purple-1" onClick={saveAudio}>
                Guardar y generar
              </button>
            </div>

          </div>
        </Card>
      </div>
    </div>
  )
}