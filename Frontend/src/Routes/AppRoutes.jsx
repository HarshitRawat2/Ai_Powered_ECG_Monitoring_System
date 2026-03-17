import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Pages/Auth/Login';
import Signup from '../Pages/Auth/Signup';
import Dashboard from '../Pages/Dashboard/Dashboard';
import AdminDashboard from '../Pages/Dashboard/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // If no token, send to login. Otherwise, show the component.
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  return role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default function AppRoutes() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      {/* Root Path logic */}
      <Route 
        path="/" 
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />

      <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard/>
            </AdminRoute>
          } 
        />

      {/* Wildcard to catch everything else */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}