import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';

export const Index = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(user.role === 'TEACHER' || user.role === 'STUDENT') {
      navigate('/courses/dashboard');
    }
    if(user.role === 'ADMIN') {
      navigate('/directors');
    }
  })

  return (
    <div>
      <h1>Index</h1>
    </div>
  );
};
