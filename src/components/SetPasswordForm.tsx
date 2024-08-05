import { useState } from "react";
import { Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

import '../App.css';

interface ISetPasswordFormProps {
	setPassword: (newPassword: string, newPasswordConfirmation: string) => Promise<void>;
	statusSended: boolean;
	statusMessage: string;
}

export default function SetPasswordForm({ setPassword: handleSetNewPassword, statusSended, statusMessage }: ISetPasswordFormProps) {
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
	const navigate = useNavigate();

	return (
		<div>
			<div className="mb-3">
				<Label htmlFor="password" className="form-label">Contraseña</Label>
				<Input type="password" id="password" placeholder="*********" onChange={(e) => setNewPassword(e.target.value)} />
				<Label htmlFor="password" className="form-label">Confirma la contraseña</Label>
				<Input type="password" id="password" placeholder="*********" onChange={(e) => setNewPasswordConfirmation(e.target.value)} />
				{statusMessage && <p className={statusSended ? "text-success" : "text-danger"}>{statusMessage}</p>}
			</div>
			<div className="d-flex justify-content-between mt-4">
				<button className="btn-purple-2" onClick={() => navigate('/login')}>
					Volver
				</button>
				<button className="btn-purple-1" onClick={() => newPassword && newPasswordConfirmation && handleSetNewPassword(newPassword, newPasswordConfirmation)}>
					Confirmar
				</button>
			</div>
		</div>
	);
}