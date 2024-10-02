import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input } from "reactstrap";

import { post } from "../../utils/network";
import { isPhoneNumber } from "../../utils/FormValidators";
import { SwalUtils } from "../../utils/SwalUtils";

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
    if((formValues?.name?.length ?? 0) < 3 || (formValues?.name?.length ?? 0) > 30) {
      SwalUtils.warningSwal(
        "El nombre de la institución es inválido.",
        "Por favor, asegurate de que el nombre sea el nombre completo de la institución.",
        "Esta bien",
        () => { console.warn('Name too short') },
      );
      return;
    }

    if((formValues?.address?.length ?? 0) < 5 || (formValues?.address?.length ?? 0) > 50) {
      SwalUtils.warningSwal(
        "La dirección ingresada es inválida.",
        "Por favor, asegurate de que la dirección ingresada sea la dirección correcta de la institución.",
        "Esta bien",
        () => { console.warn('Address too short') },
      );
      return;
    }

    if(!isPhoneNumber(formValues?.phone || '')) {
      SwalUtils.warningSwal(
        "El número de teléfono ingresado es inválido.",
        "Por favor, asegurate de que el número de teléfono ingresado sea correcto.",
        "Esta bien",
        () => { console.warn('Phone number not valid') },
      );
      return;
    }
    
    post(`/institutes`, formValues).then(res => {
      if (res.ok) {
        SwalUtils.successSwal(
          "Institución creada con éxito 🎉",
          "La institución se ha creado correctamente, en breve podrás ver los datos registrados.",
          "Aceptar",
          () => navigate('/institutes'),
          () => navigate('/institutes')
        );
      } else {
        SwalUtils.errorSwal(
          "Hubo un error al crear la institución ❗",
          "Hubo un error interno al crear la institución. Por favor, intenta mas tarde",
          undefined,
          () => { console.error(`Institute not created. Error: ${res.statusText}`) },
        );
      }
      })
      .catch(err => {
        SwalUtils.errorSwal(
          "Hubo un error al crear la institución ❗",
          "Hubo un error interno al crear la institución. Por favor, intenta mas tarde",
          undefined,
          () => { console.error(`Institute not created. Error: ${err}`) },
        );
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
        <Input name="name" type="text" placeholder="Nombre" className="mb-3" onChange={handleFormChange('name')} />
        <Input name="address" type="text" placeholder="Dirección" className="mb-3" onChange={handleFormChange('address')} />
        <Input name="phone" type="tel" placeholder="Teléfono" className="mb-3" onChange={handleFormChange('phone')} />
        <button className="btn-purple-1 w-100" onClick={createInstitute}>
          Crear
        </button>
      </Card>
    </div>
  );
}