import { Card, CardBody, CardTitle, Input, Label, Button } from 'reactstrap';
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { API_URL } from '../../config';
import React from 'react';
import { patch } from '../../utils/network';
import { SwalUtils } from '../../utils/SwalUtils';
import { useNavigate } from 'react-router-dom';

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
          () => navigate('/me/profile'),
          () => navigate('/me/profile')
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        width: '100%',
        height: '100%',
      }}>
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
          <CardTitle tag="h2">Tus datos</CardTitle>
          <hr />
          <CardBody
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
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

            {/* Imagen de perfil */}
            <Label for="profileImage">Imagen de Perfil</Label>
            <Input type="file" name="profileImage" id="profileImage" onChange={handleFileChange} />

            {/* Botón de actualización */}
            
          </CardBody>
          <div className='d-flex flex-row justify-content-end'>
            <button className='btn-purple-1' onClick={uploadProfileImage}>Actualizar información</button>
            </div>
        </Card>
      </div>
    </div>
  );
};
