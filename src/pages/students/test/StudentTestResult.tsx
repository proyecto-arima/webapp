import { Card, CardBody, CardTitle, Input } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { RootState } from '../../../redux/store';
import { get } from '../../../utils/network';

import '../../../assets/styles/LearningTypePage.css';

const testPostComments = [
    "El test de kolb fue desarrollado en 1984",
    "El test te permite descubrir que forma de aprender es la que mejor se adapta a vos",
    "Podes repetir el test cuantas veces quieras!"
];

export const StudentLearningTypeResult = () => {
    const user = useSelector((state: RootState) => state.user);
    const [learningType, setLearningType] = useState<string>('');
    const [learningTypeMessage, setLearningTypeMessage] = useState<string>('');

    useEffect(() => {
        // TODO: Fetch learning type from redux
        // After test is completed, the learning type is stored in the redux store
        // user.learningType && setLearningType(user.learningType);
        setLearningType("VISUALIZADOR");
        setLearningTypeMessage(`Tu estilo de aprendizaje "${learningType}" implica que asimilas mejor la información a través de la escucha.
            Probablemente prefieras recibir información de manera verbal y encuentres más efectivo escuchar explicaciones,
            participar en discusiones y debates para comprender el contenido. Tienes una gran capacidad para recordar diálogos y sonidos,
            y a menudo recurres a la repetición en voz alta y al diálogo interno como métodos de estudio.

            Además, eres especialmente sensible a los matices y tonos de voz, lo que te permite captar detalles adicionales en
            la comunicación.

            Es probable que disfrutes participar activamente en discusiones grupales y actividades auditivas,
            ya que estas te facilitan la consolidación de tu aprendizaje.`
        )

        // TODO: Get test last results from backend
        get(`/students/${user.id}/learning-profile/last-test`)
            .then((res) => {
                return res.ok ? res.json() : Promise.reject(res);
            })
            .then((res) => {
                const data = res.data;
                console.log("Last test info: ", data);
            })
            .catch((err) => {
                console.error(`An error ocurred while fetching learning type: ${err}`);
            });
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f6effa',
                width: '100vw',
            }}
        >
            <div className="container">
                <ul>
                    <Card className='profile-card-init'>
                        <CardTitle tag="h1">Tu resultado</CardTitle>
                        <CardBody>{learningTypeMessage}</CardBody>
                    </Card>
                </ul>

                <ul>
                    <Card className='profile-card-init'>
                        <CardTitle tag="h5">Queres saber mas?</CardTitle>
                        <CardBody>
                            {testPostComments.map((comment, index) => (
                                <div key={index}>
                                    <Input type='checkbox' defaultChecked />
                                    <span>{comment}</span>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </ul>

                <ul>
                    <button className="btn-purple-primary" onClick={() => { window.location.href = '/me/learning-type'; }}>
                        Volver
                    </button>
                </ul>
            </div>
        </div>
    );
}
