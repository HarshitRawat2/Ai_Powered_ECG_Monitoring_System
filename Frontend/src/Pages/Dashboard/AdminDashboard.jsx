import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { ShieldCheck, UserCheck, AlertTriangle, Eye, X, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDoctor, setSelectedDoctor] = useState(null); // For the View Profile Modal

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get('/requests/all/doctors');
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('token'); 
  navigate('/login');
};

  const toggleVerification = async (id, isVerifying) => {
    try {
      if (isVerifying) await API.put(`/doctors/verify/${id}`);
      else await API.put(`/doctors/unverify/${id}`);
      fetchDoctors();
      setSelectedDoctor(null); // Close modal after action
    } catch (err) {
      alert("Action failed: Check if you have Admin permissions.");
    }
  };

  const filtered = doctors.filter(d => {
    const isDoctor = d.role === 'doctor';
    const isPending = !d.DoctorProfile || !d.DoctorProfile.isVerified;
    return activeTab === 'pending' ? (isDoctor && isPending) : (isDoctor && !isPending);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
      {/* Header Section */}
<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
      <ShieldCheck className="text-blue-600 w-8 h-8" />
    </div>
    <div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">
        Admin Control Center
      </h1>
      <p className="text-slate-500 text-sm font-medium">System-wide provider verification</p>
    </div>
  </div>
  
  <div className="flex items-center gap-4">
    {/* Admin Status Badge */}
    <div className="hidden lg:flex items-center gap-2 bg-slate-900 text-slate-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-800">
      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      Secure Root Access
    </div>

    {/* Tab Switcher */}
    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
      <button 
        onClick={() => setActiveTab('pending')} 
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        Pending
      </button>
      <button 
        onClick={() => setActiveTab('verified')} 
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'verified' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        Verified
      </button>
    </div>

    {/* The Beautiful Logout Button */}
    <button 
      onClick={handleLogout}
      className="group flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl border border-slate-200 hover:border-red-200 transition-all duration-200 active:scale-95"
    >
      <span className="text-xs font-bold">Exit</span>
      <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
</div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Total Applications</p>
            <p className="text-3xl font-bold text-slate-900">{doctors.length}</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <p className="text-emerald-600 text-sm font-medium">Verified Providers</p>
            <p className="text-3xl font-bold text-emerald-700">{doctors.filter(d => d.DoctorProfile?.isVerified).length}</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
            <p className="text-amber-600 text-sm font-medium">Awaiting Review</p>
            <p className="text-3xl font-bold text-amber-700">{doctors.filter(d => !d.DoctorProfile || !d.DoctorProfile.isVerified).length}</p>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Doctor Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                            {doc.firstName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 capitalize">Dr. {doc.firstName} {doc.lastName}</p>
                            <p className="text-sm text-slate-500">{doc.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {activeTab === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Clock size={14} /> Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle size={14} /> Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedDoctor(doc)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          title="View Profile"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center">
              <AlertTriangle className="mx-auto text-slate-300 w-12 h-12 mb-4" />
              <p className="text-slate-500 font-medium">No {activeTab} doctors found.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- DOCTOR PROFILE MODAL --- */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4 shadow-lg">
                  {selectedDoctor.firstName[0]}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h2>
                <p className="text-blue-600 font-medium">{selectedDoctor.DoctorProfile?.specialization || "General Practitioner"}</p>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Clinic Name</span>
                  <span className="text-slate-900 font-semibold">{selectedDoctor.DoctorProfile?.clinicName || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Experience</span>
                  <span className="text-slate-900 font-semibold">{selectedDoctor.DoctorProfile?.experienceYears || 0} Years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Email</span>
                  <span className="text-slate-900 font-semibold">{selectedDoctor.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Registration Date</span>
                  <span className="text-slate-900 font-semibold">{new Date(selectedDoctor.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                {activeTab === 'pending' ? (
                  <button 
                    onClick={() => toggleVerification(selectedDoctor.id, true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all"
                  >
                    Approve Doctor
                  </button>
                ) : (
                  <button 
                    onClick={() => toggleVerification(selectedDoctor.id, false)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-all"
                  >
                    Revoke Access
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}