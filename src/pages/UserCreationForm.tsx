import React, { useState, useEffect } from 'react';
import { Card, Input } from "reactstrap";
import ReactSelect from 'react-select';

import { get, post } from "../utils/network";
import { FormValidators } from "../utils/FormValidators";
import { SwalUtils } from "../utils/SwalUtils";

interface IInstitute {
  id: string,
  name: string,
}

interface IDocument {
  type?: string,
  number?: string,
}

interface IUserCreationFormValues {
  firstName?: string,
  lastName?: string,
  email?: string,
  document?: IDocument,
  institute?: string,
}

interface UserCreationFormProps {
  entityToCreate: string;
  actionAfterCreation: () => void;
  actionOnError: () => void
  postHttp: string;
}

const UserCreationForm: React.FC<UserCreationFormProps> = ({ entityToCreate, actionAfterCreation, actionOnError, postHttp }) => {
  const [formValues, setFormValues] = useState<IUserCreationFormValues>();
  const [institutes, setInstitutes] = useState<IInstitute[]>([]);

  useEffect(() => {
    if (entityToCreate === 'DIRECTOR') {
      fetchInstitutesData();
    }
  }, [entityToCreate]);

  const fetchInstitutesData = async () => {
    await get(`/institutes`)
      .then(async res => {
        const response = await res.json();
        if (response.success) {
          return response;
        } else {
          SwalUtils.errorSwal(
            "Hubo un error al cargar las instituciones",
            "Por favor, intenta mas tarde. Si crees que se trata de un error contactate con el administrador de AdaptarIA",
            "Esta bien",
            () => { console.error('HTTP ERROR') },
          );
          throw new Error('HTTP ERROR');
        }
      })
      .then(res => {
        if (res && res.success) {
          setInstitutes(res.data);
          return;
        } else {
          SwalUtils.errorSwal(
            "Hubo un error al cargar las instituciones",
            "Por favor, intenta mas tarde. Si crees que se trata de un error contactate con el administrador de AdaptarIA",
            "Esta bien",
            () => { console.error('INTERNAL ERROR') },
          );
          throw new Error('INTERNAL ERROR');
        }
      })
      .catch((e) => {
        SwalUtils.errorSwal(
          "Hubo un error al cargar las instituciones",
          "Por favor, intenta mas tarde. Si crees que se trata de un error contactate con el administrador de AdaptarIA",
          "Esta bien",
          () => { console.error('INTERNAL ERROR') },
        );
        console.error(`Error loading institutes. ${e}`);
      });
  };

  const handleFormChange = (label: keyof IUserCreationFormValues) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValues({
      ...formValues,
      [label]: e.target.value
    })
  }

  const setDocumentType = (type?: string): void => {
    setFormValues({
      ...formValues,
      document: {
        ...formValues?.document,
        type,
      }
    })
  }

  const setDocumentNumber = (number?: string): void => {
    setFormValues({
      ...formValues,
      document: {
        ...formValues?.document,
        number,
      }
    })
  }

  const checkFormData = (): boolean => {
    if (entityToCreate !== 'DIRECTOR') {
      const { institute, ...newFormValues } = formValues || {};
      setFormValues(newFormValues);
    } else {
      if (!formValues?.institute || formValues?.institute?.length > 2) {
        SwalUtils.warningSwal(
          "La institución no fue seleccionada",
          "Por favor, selecciona una institución para el director",
          "Esta bien",
          () => { console.warn('Institute not selected') },
        );
        return false
      }
    }

    if (
      !FormValidators.isAName(formValues?.firstName || '') ||
      !FormValidators.isAName(formValues?.lastName || '')
    ) {
      SwalUtils.warningSwal(
        "Nombre o Apellido inválido",
        "Por favor, ingresa un nombre y apellido válido de al menos 3 caracteres.",
        "Esta bien",
        () => { console.warn('Name too short') },
      );
      return false;
    }

    if (!FormValidators.isValidEmail(formValues?.email || '')) {
      SwalUtils.warningSwal(
        "El correo electrónico es inválido",
        "Por favor, asegurate de que el correo ingresado sea válido.",
        "Esta bien",
        () => { console.warn('Email not valid') },
      );
      return false;
    }

    if (formValues?.document?.type === "DNI" && !FormValidators.isDNI(formValues?.document?.number || '')) {
      SwalUtils.warningSwal(
        "El documeto ingresado es inválido.",
        "Por favor, asegurate de que el documeto ingresado sea un DNI válido.",
        "Esta bien",
        () => { console.warn('Document not valid') },
      );
      return false;
    }
    return true;
  }

  const onCreation = async (): Promise<void> => {
    post(postHttp, formValues)
      .then((res) => {
        const response = res.json();
        if (res && res.ok) {
          return response;
        } else {
          SwalUtils.errorSwal(
            "Hubo un error interno al tratar de crear el usuario",
            "Por favor, intenta mas tarde. Si crees que se trata de un error contactate con el administrador de AdaptarIA",
            "Esta bien",
            () => { console.error('HTTP ERROR') },
          );
          throw new Error('HTTP ERROR');
        }
      })
      .then((res) => {
        if (res && res.success) {
          actionAfterCreation();
        } else {
          SwalUtils.errorSwal(
            `Hubo un error al crear al ${entityToCreate === 'TEACHER' ? 'docente' :
              entityToCreate === 'STUDENT' ? 'estudiante' : 'directivo'
            }`,
            "Por favor, intenta mas tarde. Si crees que se trata de un error contactate con el administrador de AdaptarIA",
            "Esta bien",
            () => { console.error('INTERNAL ERROR') },
          );
          throw new Error('INTERNAL ERROR');
        }
      })
      .catch((e) => {
        actionOnError();
        console.error(`Error creating ${entityToCreate}. ${e}`);
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
        <h2 className="text-center mb-3">
          {`Nuevo ${entityToCreate === 'TEACHER' ? 'docente' :
            entityToCreate === 'STUDENT' ? 'estudiante' : 'directivo'
            }`}
        </h2>
        <Input
          name="firstName"
          type="text"

          maxLength={30}
          placeholder="Nombre"
          className="mb-3"
          onChange={handleFormChange('firstName')}
        />
        <Input name="lastName" type="text" maxLength={30} placeholder="Apellido" className="mb-3" onChange={handleFormChange('lastName')} />
        <Input name="email" type="email" maxLength={256} placeholder="Correo Electrónico" className="mb-3" onChange={handleFormChange('email')} />
        {entityToCreate === 'DIRECTOR' &&
          <ReactSelect
            options={institutes}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            noOptionsMessage={() => 'No se encontraron instituciones'}
            className="mb-3"
            placeholder="Institución"
            name="institute"
            onChange={(e) => {
              setFormValues({
                ...formValues,
                institute: e?.name,
              })
            }}
          />
        }
        <ReactSelect
          options={[
            { value: 'DNI', label: 'DNI' }
          ]}
          className="mb-3"
          placeholder="Tipo de Documento"
          name="documentType"
          onChange={(e) => setDocumentType(e?.value)}
        />
        <Input
          type="number"
          placeholder="Número de Documento"
          minLength={formValues?.document?.type === "DNI" ? 7 : 10}
          maxLength={formValues?.document?.type === "DNI" ? 9 : 10}
          className="mb-3"
          onChange={(e) => setDocumentNumber(e.target.value)}
        />
        <button className="btn-purple-1 w-100" onClick={() => checkFormData() && onCreation()}>
          {`Crear ${entityToCreate === 'TEACHER' ? 'docente' :
            entityToCreate === 'STUDENT' ? 'estudiante' : 'directivo'
            }`}
        </button>
      </Card>

    </div>
  );
};

export default UserCreationForm;
