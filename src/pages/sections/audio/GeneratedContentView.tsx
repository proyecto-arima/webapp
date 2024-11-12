import { useEffect, useRef, useState } from "react";
import ReactAudioSpectrum from "react-audio-spectrum";
import { Card, Progress } from "reactstrap";
import { get } from "../../../utils/network";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faBackward, faPause, faPlay, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Reactions from "../../../components/Reactions";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import PageWrapper from "../../../components/PageWrapper";

interface IGenerated {
  type: string;
  content: { text: string, audioUrl: string }[];
  approved: boolean;
  title: string;
}

export default function AudioVisualizer() {
  const audioRef = useRef(new Audio());
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(true);
  const audioElement = audioRef.current;
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user);


  const { courseId, sectionId, contentId } = useParams<{ courseId: string, sectionId: string, contentId: string }>();
  const [content, setContent] = useState<IGenerated>();

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    get(`/contents/${contentId}/speech`).then(res => res.json()).then(res => res.data).then((data) => {
      setContent(data);
      audioElement.crossOrigin = 'anonymous';
      audioElement.src = data.content[0].audioUrl;
      audioElement.load();
      audioElement.onended = () => {
        setCurrent((current + 1) % data.content.length);
      }
    });

    return () => {
      audioElement.pause();
    };
  }, []);

  useEffect(() => {
    if (!content) return;
    audioElement.src = content?.content[current].audioUrl;
    audioElement.load();
    audioElement.play().then(() => setPlaying(true));
    audioElement.onended = () => {
      setCurrent((current + 1) % content.content.length);
    }
  }, [current]);

  useEffect(() => {
    console.log("Audio loading: ", audioLoading);
  }, [audioLoading]);

  return <PageWrapper title="Escuchá con atención" goBackUrl={`/courses/${courseId}/sections/${sectionId}`}>
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
      <div className="d-flex flex-row w-100 justify-content-center">
      <h3>{content?.title}</h3>
      </div>
      {(content?.content?.length ?? 0) > 0 && <>
        <div
          className="d-flex flex-row justify-content-end w-100"
          style={{
            color: 'gray',
          }}
        >
          <span>Audio {current + 1}/{content?.content.length}</span>
        </div>
        <span style={{
          "fontFamily": "Comic Neue",
          "fontWeight": 500,
          "fontStyle": "normal",
          "textAlign": "center",
          "fontSize": "2vmin",
        }}>
          {content?.content[current].text}
        </span>
        <div className="d-flex flex-row justify-content-center align-items-center gap-3 w-100">
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
            onClick={() => setCurrent((current - 1 + (content?.content?.length ?? 0)) % (content?.content?.length ?? 0))}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
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
            onClick={() => setCurrent((current + 1) % (content?.content?.length ?? 0))}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        <ReactAudioSpectrum
          id="audio-canvas"
          audioEle={audioElement}
          width={containerRef.current?.clientWidth || 0}
          height={innerHeight / 4}
          // capColor={'blue'}
          capHeight={2}
          meterWidth={4}
          meterCount={400}
          meterColor={[
            { stop: 0, color: '#6650a4' },
            { stop: 0.5, color: 'purple' },
            { stop: 1, color: '#4d3a8e' },
          ]}
          gap={5}

        ></ReactAudioSpectrum>
        {user.role === 'STUDENT' && <Reactions />}
      </>

      }
    </div>
  </PageWrapper>

}