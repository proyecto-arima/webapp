import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import { Card, Input } from "reactstrap";
import { get, post } from "../../utils/network";


interface IDocument {
  type?: string,
  number?: string,
}

interface IDirectorCreationFormValues {
  firstName?: string,
  lastName?: string,
  email?: string,
  document?: IDocument,
  institute?: string,
}

export const DirectorCreationPage = () => {

  const [formValues, setFormValues] = useState<IDirectorCreationFormValues>();
  const [institutes, setInstitutes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    get(`/institutes`)
      .then(res => res.json())
      .then(res => setInstitutes(res.data));
  }, []);

  const handleFormChange = (label: keyof IDirectorCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [label]: e.target.value,
    })
  }

  const setDocumentType = (type?: string) => {
    setFormValues({
      ...formValues,
      document: {
        ...formValues?.document,
        type,
      }
    })
  }

  const setDocumentNumber = (number?: string) => {
    setFormValues({
      ...formValues,
      document: {
        ...formValues?.document,
        number,
      }
    })
  }

  const createDirector = async () => {
    post(`/directors`, formValues).then(res => {
      if (res.ok) {
        navigate('/directors');
      }
    });
  }

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
      <Card style={{ width: '30rem', paddingInline: '2rem', paddingBlock: '1rem' }}>
        <h2 className="text-center mb-3">Crear Directivo</h2>
        <Input name="firstName" type="text" placeholder="Nombre" className="mb-3" onChange={handleFormChange('firstName')} />
        <Input name="lastName" type="text" placeholder="Apellido" className="mb-3" onChange={handleFormChange('lastName')} />
        <Input name="email" type="email" placeholder="Correo Electrónico" className="mb-3" onChange={handleFormChange('email')} />
        <ReactSelect
          options={[
            { value: 'dni', label: 'DNI' },
            { value: 'passport', label: 'Pasaporte' },
            { value: 'legajo', label: 'Legajo' },
          ]}
          className="mb-3"
          placeholder="Tipo de Documento"
          name="documentType"
          onChange={(e) => setDocumentType(e?.value)}
        />
        <Input type="text" placeholder="Número de Documento" className="mb-3" onChange={(e) => setDocumentNumber(e.target.value)} />

        <ReactSelect
          options={institutes}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          className="mb-3"
          placeholder="Institución"
          name="institute"
          onChange={(e) => {
            setFormValues({
              ...formValues,
              institute: e,
            })
          }}
        />

        <button className="btn-purple-1 w-100" onClick={createDirector}>
          Crear
        </button>
      </Card>
    </div>
  );
}