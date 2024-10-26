import React, { useState, Fragment } from 'react';
import { Card, CardTitle, CardBody, Input } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Papa from "papaparse";

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { post } from "../../utils/network";
import { FormValidators } from "../../utils/FormValidators";
import { SwalUtils } from "../../utils/SwalUtils";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  document: {
    number: string;
    type: "DNI" | "Pasaporte";
  };
};

export const UserCreationMassivePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [userType, setUserType] = useState<string | null>(null);

  const isUserValid = (user: IUser): boolean => {
    if (
      !FormValidators.isAName(user.firstName) ||
      !FormValidators.isAName(user.lastName)
    ) {
      SwalUtils.warningSwal(
        "Nombre o Apellido inválido para el usuario",
        `Por favor, ingresa un nombre y apellido válido de al menos 3 caracteres alfabéticos para el usuario #${users.indexOf(user) + 1}`,
        "Esta bien",
        () => { console.warn('Name too short') },
      );
      return false;
    }

    if (!FormValidators.isValidEmail(user.email)) {
      SwalUtils.warningSwal(
        `Email inválido para el usuario "${user.firstName} ${user.lastName}"`,
        `Por favor, asegurate de que el correo ingresado sea válido para el usuario #${users.indexOf(user) + 1}`,
        "Esta bien",
        () => { console.warn('Email not valid') },
      );
      return false;
    }

    const documentNumber = user.document.number;
    if (user.document.type === "DNI" && (documentNumber.length < 7 || documentNumber.length > 8)) {
      SwalUtils.warningSwal(
        `Documento inválido para el usuario "${user.firstName} ${user.lastName}"`,
        "Por favor, asegurate de que el documento ingresado sea un DNI válido.",
        "Esta bien",
        () => { console.warn('Document not valid') },
      );
      return false;
    }
    return true;
  };

  const confirmationOfCreation = (): void => {
    for (const user of users) {
      const userValid = isUserValid(user);
      if (!userValid) {
        return;
      }
    }

    const endpoint: string | null = userType === 'DOCENTE' ? '/teachers/massive' : userType === 'ESTUDIANTE' ? '/students/massive' : null;
    if (!endpoint) {
      SwalUtils.errorSwal(
        'Error al intentar crear los usuarios',
        'Ocurrió un error al intentar crear los usuarios, por favor intenta más tarde',
        undefined,
        () => { console.error('Error creating users') }
      );
      return;
    }

    SwalUtils.infoSwal(
      'Confimar creación de usuarios',
      '¿Estás seguro de que querés crear todos estos usuarios?',
      "Si, estoy seguro",
      "No, volver",
      async () => {
        // post('/users/massive', body)
        //   .then((response) => {
        //     console.log(response);
        //     SwalUtils.successSwal(
        //       'Usuarios creados',
        //       'Los usuarios se han creado exitosamente',
        //       undefined,
        //       () => {
        //         setUsersCreated(users);
        //         setUsers([]);
        //         setUserType(null);
        //       }
        //     );
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //     SwalUtils.errorSwal(
        //       'Error al crear usuarios',
        //       'Ocurrió un error al intentar crear los usuarios, por favor intenta más tarde',
        //       undefined,
        //       () => { console.warn('Error creating users') }
        //     );
        //   });
        console.log("creando usuarios");
        await post(endpoint, users)
          .then((res) => {
            if (res.ok) {
              SwalUtils.successSwal(
                'Usuarios creados',
                `Los usuarios se han creado exitosamente. En breve podras verlos en la lista de ${userType === 'DOCENTE' ? 'Docentes' : userType === 'ESTUDIANTE' ? 'Estudiantes' : ''}`,
                'Aceptar',
                () => { console.info('Users created') },
                () => { console.info('Users created') }
              );
              setUsers([]);
              setUserType(null);
              if (userType === 'DOCENTE') {
                navigate('/teachers');
              } else if (userType === 'ESTUDIANTE') {
                navigate('/students');
              } else {
                console.error('Error on navigate to users');
                return;
              }
            } else {
              SwalUtils.errorSwal(
                'Error al crear usuarios',
                'Ocurrió un error al intentar crear los usuarios, por favor intenta más tarde',
                undefined,
                () => { console.warn('Error creating users') }
              );
              return;
            }
          })
          .catch((err) => {
            console.error(err);
            SwalUtils.errorSwal(
              'Error interno',
              'Ocurrió un error interno al intentar crear los usuarios, por favor intenta más tarde',
              undefined,
              () => { console.warn('Error creating users') }
            );
          });
      });
    return;
  };

  const handleDeleteRow = (userToDelete: IUser): void => {
    const newTeachers = users.filter((user) => user !== userToDelete);
    setUsers(newTeachers);
    if (newTeachers.length === 0) {
      setUserType(null);
    }
    return;
  };

  const generateTbodyFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const csvFile = event.target.files?.[0];
    if (!csvFile) {
      SwalUtils.errorSwal(
        'Error al cargar el archivo',
        'No se encontro ningún archivo, intenta mas tarde',
        undefined,
        () => { console.warn('No file found') }
      );
      return;
    };

    if (!userType || userType === '') {
      SwalUtils.warningSwal(
        'Tipo de usuario no seleccionado',
        'Debes seleccionar el tipo de usuario antes de cargar el archivo',
        "Confirmar",
        () => { console.warn('No user type selected') }
      );
      return;
    };

    Papa.parse(csvFile, {
      header: false,
      skipEmptyLines: true,
      complete: function (users) {
        const newUsers = users.data.map((user: any) => {
          return {
            firstName: user[0],
            lastName: user[1],
            email: user[2],
            document: {
              type: user[3],
              number: user[4],
            },
          };
        });
        setUsers(newUsers);
      },
    });
    return;
  };

  const renderUsersToCreate = () => {
    return users.map((user, index) => (
      <Fragment key={index}>
        <h4
          style={{
            display: 'flex',
            width: '100%',
            margin: '10px 0',
          }}
        >
          {userType === 'DOCENTE' ? 'Docente' : 'Estudiante'} #{index + 1}
        </h4>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >

          <label className="form-label">Nombre</label>
          <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between', marginBottom: '1rem', }}>
            <Input
              type="text"
              placeholder="Nombre"
              value={user.firstName}
              onChange={(e) => {
                const newTeachers = [...users];
                newTeachers[index].firstName = e.target.value;
                setUsers(newTeachers);
              }}
            />
          </div>

          <label className='form-label'>Apellido</label>
          <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Input
              type="text"
              placeholder="Apellido"
              value={user.lastName}
              onChange={(e) => {
                const newTeachers = [...users];
                newTeachers[index].lastName = e.target.value;
                setUsers(newTeachers);
              }}
            />
          </div>

          <label className="form-label">Email</label>
          <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => {
                const newTeachers = [...users];
                newTeachers[index].email = e.target.value;
                setUsers(newTeachers);
              }}
            />
          </div>

          <label className="form-label">Documento</label>
          <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Input
              style={{
                marginRight: '2rem',
                width: '30%',
              }}
              type="select"
              disabled={true}
              value={user.document.type}
              onChange={(e) => {
                const newTeachers = [...users];
                newTeachers[index].document.type = e.target.value as "DNI" | "Pasaporte";
                setUsers(newTeachers);
              }}
            >
              <option value="DNI">DNI</option>
            </Input>
            <Input
              type="number"
              placeholder="Documento"
              value={user.document.number}
              onChange={(e) => {
                const newTeachers = [...users];
                newTeachers[index].document.number = e.target.value;
                setUsers(newTeachers);
              }}
            />

          </div>

          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button onClick={() => handleDeleteRow(user)} className='btn-purple-2'>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
        <hr />
      </Fragment>

    ))
  };

  return (
    <div
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
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%', overflow: 'scroll' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <h2>Creación masiva de usuarios</h2>
            <div>
              <Select
                value={userType ? { value: userType, label: userType === 'DOCENTE' ? 'Docente' : 'Estudiante' } : null}
                options={["Estudiante", "Docente"].map((option) => ({ value: option.toUpperCase(), label: option }))}
                placeholder="Seleccionar tipo de usuario"
                isDisabled={users.length > 0}
                isSearchable={false}
                onChange={(selectedOption) => {
                  setUserType(selectedOption ? selectedOption.value : '');
                }}
              />
            </div>
          </div>

          <hr />
          {users.length == 0 && (
            <>
              <div>
                <CardTitle>
                  <h3>Tene en cuenta que...</h3>
                </CardTitle>
                <CardBody>
                  <ul>
                    <li key='0'>Es muy importante <strong>que el usuario no exista previamente</strong> en el listado.</li>
                    <li key='1'>Si alguno de los usuarios ya existe, <strong>no se podrán crear el resto de los usuarios</strong>.</li>
                    <li key='2'>Recorda <strong>seleccionar el tipo de usuario</strong> que vas a cargar (docentes o alumnos).</li>
                    <li key='3'>Debes cargar un archivo en formato .csv, para luego generar la tabla con los usuarios que se van a cargar.</li>
                    <li key='4'>En Google Spreadsheets, podes hacer clic en Archivo {'>'} Descargar {'>'} Valores separados por comas (.csv, valores separados por comas) para obtener el archivo en el formato correcto.</li>
                    <li key='5'>En Microsoft Excel, podes hacer clic en Archivo {'>'} Guardar como {'>'} seleccionar CSV (delimitado por comas) (*.csv) para obtener el archivo en el formato correcto.</li>
                  </ul>
                </CardBody>
              </div>

              <Input
                type='file'
                name='csv-file'
                accept='.csv'
                onChange={(e) => {
                  generateTbodyFromCSV(e);
                  e.target.value = '';
                }}
              />
              <hr />
            </>
          )}

          {renderUsersToCreate()}

          {users.length > 0 && userType != '' && (<>
            <p>
              Total de {userType === 'DOCENTE' ? 'docentes' : userType === 'ESTUDIANTE' ? 'estudiantes' : ''} a crear: <strong>{users.length}</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button style={{ marginRight: '10px' }} className="btn-purple-2" onClick={() => {
                setUsers([]);
                setUserType(null);
              }}>
                Cancelar
              </button>
              <button className="btn-purple-1" onClick={() => confirmationOfCreation()}>
                Crear {userType === 'DOCENTE' ? 'docentes' : userType === 'ESTUDIANTE' ? 'estudiantes' : ''}
              </button>
            </div>
          </>
          )}
        </Card>
      </div>
    </div>
  );
};
