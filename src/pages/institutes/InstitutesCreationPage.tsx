import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input } from "reactstrap";
import { post } from "../../utils/network";

interface IInstituteCreationFormValues {
  name?: string,
  address?: string,
  phone?: string,
}

export const InstitutesCreationPage = () => {

  const [formValues, setFormValues] = useState<IInstituteCreationFormValues>();
  const navigate = useNavigate();

  const handleFormChange = (label: keyof IInstituteCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [label]: e.target.value,
    })
  }

  const createInstitute = () => {
    post(`/institutes`, formValues).then(res => {
      if (res.ok) {
        navigate('/institutes');
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
        <h2 className="text-center mb-3">Crear Instituto</h2>
        <Input name="firstName" type="text" placeholder="Nombre" className="mb-3" onChange={handleFormChange('name')} />
        <Input name="lastName" type="text" placeholder="Dirección" className="mb-3" onChange={handleFormChange('address')} />
        <Input name="email" type="email" placeholder="Teléfono" className="mb-3" onChange={handleFormChange('phone')} />
        <button className="btn-purple-1 w-100" onClick={createInstitute}>
          Crear
        </button>
      </Card>
    </div>
  );
}