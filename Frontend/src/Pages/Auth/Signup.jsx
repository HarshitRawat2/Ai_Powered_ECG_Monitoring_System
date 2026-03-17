import { useState } from 'react';
import API from '../../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '', // State initialized
    age: '',
    role: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/signup', {
        ...formData,
        age: parseInt(formData.age) 
      });
      
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || "Error occurred"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600">Create Account</h1>
          <p className="text-slate-500 mt-2">Join HeartSense AI Monitoring</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700">First Name</label>
              <input name="firstName" type="text" required onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700">Last Name</label>
              <input name="lastName" type="text" required onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input name="email" type="email" required onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700">Age</label>
              <input name="age" type="number" required onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700">Gender</label>
              <select 
                name="gender" 
                required 
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              >
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input name="password" type="password" required onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">I am a:</label>
            <div className="mt-1 flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600">
                <input 
                  type="radio" 
                  name="role" 
                  value="patient" 
                  checked={formData.role === 'patient'} 
                  onChange={handleChange} 
                  className="hidden" 
                />
                <span className={`text-sm font-medium ${formData.role === 'patient' ? 'text-blue-600' : 'text-slate-600'}`}>
                  Patient
                </span>
              </label>
              
              <label className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600">
                <input 
                  type="radio" 
                  name="role" 
                  value="doctor" 
                  checked={formData.role === 'doctor'} 
                  onChange={handleChange} 
                  className="hidden" 
                />
                <span className={`text-sm font-medium ${formData.role === 'doctor' ? 'text-blue-600' : 'text-slate-600'}`}>
                  Doctor
                </span>
              </label>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95">
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}