import { useNavigate } from "react-router-dom";
import UserCreationForm from "../UserCreationForm";

import { SwalUtils } from "../../utils/SwalUtils";

export const StudentCreationPage = () => {
  const navigate = useNavigate();
  return (
    <UserCreationForm
      entityToCreate="STUDENT"
      actionAfterCreation={() => 
        SwalUtils.successSwal(
          "¡Estudiante creado!",
          "El estudiante fue creado correctamente, en breve podrás verlo en la lista",
          "Esta bien",
          () => navigate('/students'),
          () => navigate('/students')
        )
      }
      actionOnError={() => { console.error('Student not created') }}
      postHttp="/students"
    />
  );
};
