import { useNavigate } from "react-router-dom";
import { SwalUtils } from "../../utils/SwalUtils";

import UserCreationForm from "../UserCreationForm";

export const TeacherCreationPage = () => {
  const navigate = useNavigate();
  return (
    <UserCreationForm
      entityToCreate="TEACHER"
      actionAfterCreation={() => 
        SwalUtils.successSwal(
          "¡Docente creado!",
          "El docente fue creado correctamente, en breve podrás verlo en la lista",
          "Está bien",
          () => navigate('/teachers'),
          () => navigate('/teachers')
        )
      }
      actionOnError={() => { console.error('Teacher not created') }}
      postHttp="/teachers"
    />
  );
};
