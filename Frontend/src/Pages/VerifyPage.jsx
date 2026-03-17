import { useState } from 'react';
import API from '../api/axiosInstance';
import { Clock, CheckCircle, ShieldAlert, Stethoscope, Briefcase, Building2, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VerifyPage() {
  const [profile, setProfile] = useState({ specialization: '', experience: '', clinicName: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/doctors', {
        specialization: profile.specialization,
        clinicName: profile.clinicName,
        experienceYears: parseInt(profile.experience) 
      });
      setIsSubmitted(true);
    } catch (err) {
      alert("Submission failed: " + (err.response?.data?.message || "Check fields"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left">
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
        
        {/* Top Accent Bar */}
        <div className={`h-2 w-full ${isSubmitted ? 'bg-emerald-500' : 'bg-blue-600'}`} />

        <div className="p-10">
          {!isSubmitted ? (
            <>
              <header className="mb-10 text-center">
                <div className="mx-auto w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                  <Stethoscope size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Professional Verification</h1>
                <p className="text-slate-500 mt-2 font-medium">Complete your profile to access the medical suite.</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Medical Specialization</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input required placeholder="e.g. Cardiologist" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-semibold text-slate-800" 
                      onChange={(e) => setProfile({...profile, specialization: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Years of Experience</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input required type="number" placeholder="Experience" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-semibold text-slate-800" 
                      onChange={(e) => setProfile({...profile, experience: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Clinic / Hospital Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input required placeholder="Medical Facility" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-semibold text-slate-800" 
                      onChange={(e) => setProfile({...profile, clinicName: e.target.value})} />
                  </div>
                </div>
                
                <button 
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-slate-300"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Submit for Verification"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="mx-auto w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 relative">
                <Clock className="animate-[spin_10s_linear_infinite]" size={48} />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
                  <CheckCircle size={28} className="text-emerald-500 fill-white" />
                </div>
              </div>

              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review in Progress</h1>
              <p className="text-slate-500 mt-4 font-medium leading-relaxed">
                Your application has been logged. Our administration team is currently verifying your medical credentials.
              </p>

              <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Profile Details Received</span>
                </div>
                <div className="flex items-center gap-3 text-left opacity-50">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center" />
                  <span className="text-sm font-bold text-slate-500">Document Verification</span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                 <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 mx-auto text-slate-400 hover:text-red-500 font-bold transition-all group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Sign out of Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}