import { useEffect, useRef, useState } from "react";
import ReactAudioSpectrum from "react-audio-spectrum";
import { Card, Progress } from "reactstrap";
import * as tts from '@diffusionstudio/vits-web';
import { get } from "../../../utils/network";
import { useParams } from "react-router-dom";
import { IContent } from "../text/GeneratedContentView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

export default function AudioVisualizer() {
  const audioRef = useRef(new Audio());
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(true);
  const audioElement = audioRef.current;
  const containerRef = useRef<HTMLDivElement>(null);
  audioElement.crossOrigin = 'anonymous';

  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<IContent>();

  const [current, setCurrent] = useState('');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    get(`/contents/${contentId}`).then(res => res.json()).then(res => res.data).then((data: IContent) => setContent(data));
  }, []);

  useEffect(() => {
    (async () => {
      const voices = await tts.stored();
      console.log("Stored voices: ", voices);
      if (voices.length === 0) {
        await tts.download('es_MX-claude-high', (progress) => {
          console.log(`Downloading ${progress.url} - ${Math.round(progress.loaded * 100 / progress.total)}%`);
        });
      }
      setLoading(false);
    })()

  }, []);

  useEffect(() => {
    if (loading) return;
    const contents = content?.generated?.filter(g => g.type === 'SUMMARY').flatMap(g => g.content.split('\n'));
    if (!contents?.length) return;
    console.log("Contents: ", contents);
    setTimeout(() => {
      tts.predict({ text: contents[0], voiceId: 'es_MX-claude-high' }).then((wav) => {
        setAudioLoading(false);
        const src = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
        audioElement.src = src;
        setCurrent(contents[0]);
        audioElement.load();
      });
    }, 1000);
  }, [loading, content]);

  useEffect(() => {
    console.log("Audio loading: ", audioLoading);
  }, [audioLoading]);

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
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Escucha con atención</h2>
        <hr />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: '1rem',
        }}
          ref={containerRef}
        >
          {audioLoading ? <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Progress
            animated
            color="info"
            value={100}
            indeterminate
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
          >
            Cargando audio...
          </Progress>
          </div> :<>
            <span style={{
              "fontFamily": "Comic Neue",
              "fontWeight": 500,
              "fontStyle": "normal",
              "textAlign": "center",
              "fontSize": "1.5rem",
            }}>
              {current}
            </span>
            <button
            style={{
              "backgroundColor": "#6650a4",
              "border": "none",
              "color": "white",
              "padding": "0.5rem 1rem",
              "borderRadius": "0.5rem",
              "cursor": "pointer",
              "alignSelf": "center",
            }}
              onClick={async () => {
                if (playing) {
                  audioElement.pause();
                  setPlaying(false);
                } else {
                  audioElement.play().then(() => setPlaying(true));
                }
                
              }}
            >
              <FontAwesomeIcon icon={playing ? faPause : faPlay} />

            </button>
            <ReactAudioSpectrum
              id="audio-canvas"
              audioEle={audioElement}
              width={containerRef.current?.clientWidth || 0}
              height={innerHeight / 3}
              // capColor={'blue'}
              capHeight={2}
              meterWidth={4}
              meterCount={256}
              meterColor={[
                { stop: 0, color: '#6650a4' },
                { stop: 0.5, color: 'purple' },
                { stop: 1, color: '#4d3a8e' },
              ]}
              gap={5}

            ></ReactAudioSpectrum></>}
        </div>
      </Card>
    </div>
  </div>

}