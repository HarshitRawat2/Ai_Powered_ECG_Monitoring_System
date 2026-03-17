import { useState , useEffect} from 'react';
import VerifyPage from '../VerifyPage';
import API from '../../api/axiosInstance';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import AdminDashboard from './AdminDashboard';
export default function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      if (role === 'doctor') {
        try {
          const res = await API.get('/doctors/me'); // Get your own profile
          setIsVerified(res.data.data.isVerified); // Ensure your backend sends this
        } catch (err) {
          setIsVerified(false);
        }
      }
      setLoading(false);
    };
    checkVerification();
  }, [role]);

  if (loading) return <div>Loading...</div>;

  if (role === 'doctor' && !isVerified) {
    return <VerifyPage/>;
  }


  // 3. Role Dispatcher
  if (role === 'admin') return <AdminDashboard/>;
  if (role === 'doctor') return <DoctorDashboard />;


  return role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard/>;
}