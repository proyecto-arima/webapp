import { Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import React from 'react';
import { useSelector } from "react-redux";
import PageWrapper from '../../components/PageWrapper';
import { useNavigate } from 'react-router-dom';

import { patch } from '../../utils/network';
import { SwalUtils } from '../../utils/SwalUtils';
import { RootState } from "../../redux/store";

import { API_URL } from '../../config';

export const UserPersonalDataPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const navigate = useNavigate();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validFileTypes.includes(file.type)) {
        SwalUtils.errorSwal(
          'Formato de archivo inválido',
          'Solo se permiten archivos con extensión .png, .jpeg o .jpg. Selecciona un archivo válido.',
          'Aceptar',
          () => navigate('/me/profile')
        );
        e.target.value = "";
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadProfileImage = async () => {
    let imageUrl = user.profilePicture;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await fetch(`${API_URL}/images/url/`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!res.ok) throw new Error('Error al subir la imagen');

        const json = await res.json();
        imageUrl = json.data;
      } catch (error) {
        SwalUtils.errorSwal(
          'Error de carga',
          'No se pudo cargar la imagen de perfil. Inténtalo de nuevo más tarde.',
          'Aceptar',
          () => navigate('/me/profile')
        );
        return;
      }
    }

    const updatedData = {
      profilePicture: imageUrl,
    };

    try {
      const response = await patch(`/users/me`, updatedData);
      const json = await response.json();
      if (response.ok) {
        SwalUtils.successSwal(
          'Información actualizada',
          'Tu información de perfil ha sido actualizada correctamente.',
          'Aceptar',
          () => { navigate('/me/profile'); window.location.reload(); },
          () => { navigate('/me/profile'); window.location.reload(); },
        );

      } else {
        throw new Error(json.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      SwalUtils.errorSwal(
        'Error de actualización',
        'No se pudo actualizar la información del perfil. Inténtalo nuevamente.',
        'Aceptar',
        () => navigate('/me/profile')
      );
    }
  };

  return (
    <PageWrapper title="Datos personales">
      <CardBody
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflowY: 'auto',
        }}
      >
        <Label for="firstName">Nombre</Label>
        <Input type="text" name="firstName" id="firstName" defaultValue={user.firstName} disabled />

        <Label for="lastName">Apellido</Label>
        <Input type="text" name="lastName" id="lastName" defaultValue={user.lastName} disabled />

        <Label for="email">Email</Label>
        <Input type="email" name="email" id="email" defaultValue={user.email} disabled />

        {['DIRECTOR', 'TEACHER', 'STUDENT'].includes(user.role ?? '') && (
          <>
            <Label for="institute">Institución</Label>
            <Input type="text" name="institute" id="institute" defaultValue={
              user.institute ? user.institute.name : "Sin institución"
            } disabled />
          </>
        )}

        <Label for="learningType">Mi rol</Label>
        <Input type="text" name="rol" id="rol" defaultValue={
          user.role === 'DIRECTOR' ? "Directivo" :
            user.role === 'STUDENT' ? "Estudiante" :
              user.role === 'TEACHER' ? "Docente" :
                user.role === 'ADMIN' ? "Administrador" : "Sin rol"
        } disabled />

        {user.role === 'STUDENT' && (
          <>
            <Label for="learningType">Mi tipo de aprendizaje</Label>
            <Input type="text" name="learningType" id="learningType" defaultValue={
              user.learningProfile === 'CONVERGENTE' ? "Convergente" :
                user.learningProfile === 'DIVERGENTE' ? "Divergente" :
                  user.learningProfile === 'ACOMODADOR' ? "Acomodador" :
                    user.learningProfile === 'ASIMILADOR' ? "Asimilador" : "Sin tipo de aprendizaje"
            } disabled />
          </>
        )}

        {['STUDENT', 'TEACHER', 'DIRECTOR'].includes(user.role ?? '') && (
          <>
            <Label for="profileImage">Imagen de Perfil</Label>
            <Input type="file" name="profileImage" id="profileImage" onChange={handleFileChange} />
          </>
        )}

      </CardBody>
      <div className='d-flex flex-row justify-content-end'>
        <button className='btn-purple-1' onClick={uploadProfileImage}>Actualizar información</button>
      </div>
    </PageWrapper>


  );
};
