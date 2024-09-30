import { useNavigate } from "react-router-dom";

import UserCreationForm from "../UserCreationForm";
import { SwalUtils } from "../../utils/SwalUtils";

export const DirectorCreationPage = () => {
  const navigate = useNavigate();
  return (
    <UserCreationForm
      entityToCreate="DIRECTOR"
      actionAfterCreation={() => 
        SwalUtils.successSwal(
          "¡Directivo creado!",
          "El directivo fue creado correctamente, en breve podrás verlo en la lista",
          "Esta bien",
          () => navigate('/directors'),
          () => navigate('/directors')
        )
      }
      actionOnError={() => { console.error('Director not created') }}
      postHttp="/directors"
    />
  );
};
