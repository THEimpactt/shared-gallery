import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}