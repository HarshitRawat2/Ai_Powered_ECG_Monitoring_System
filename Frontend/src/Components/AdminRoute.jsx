import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const role = localStorage.getItem('role');

  // If the user isn't an admin, redirect them to login or dashboard
  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}