import { useEffect, useState, useCallback } from 'react';
import API from '../../api/axiosInstance';
import EcgChart from '../../Components/EcgChart';
import { 
  UserCheck, Clock, Activity, CheckCircle2, XCircle, 
  X, Heart, Zap, FileText, LogOut // Added LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]); 
  const [requests, setRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modal & Patient Detail States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientReadings, setPatientReadings] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('token'); // Or whatever key you use
  navigate('/login');
};

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/requests/all');
      const allData = res.data.data || [];
      setRequests(allData.filter(req => req.status === 'pending'));
      setPatients(allData.filter(req => req.status === 'approved'));
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle Fetching Keyed Patient Data
  useEffect(() => {
    if (selectedPatient) {
      const fetchPatientVitals = async () => {
        setIsDataLoading(true);
        try {
          // Endpoint: /readings/doctors
          const res = await API.get('/readings/doctors');
          
          // Your JSON structure: res.data.data["4"].readings
          // We look up the data using the selectedPatient's ID as the key
          const patientEntry = res.data.data[selectedPatient.id];
          
          if (patientEntry && patientEntry.readings) {
            setPatientReadings(patientEntry.readings);
          } else {
            setPatientReadings([]);
          }
        } catch (err) {
          console.error("Error fetching patient readings:", err);
          setPatientReadings([]);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchPatientVitals();
    } else {
      setPatientReadings([]);
    }
  }, [selectedPatient]);

  const updateRequestStatus = async (requestId, status) => {
    try {
      await API.put(`/requests/${requestId}/status`, { status });
      fetchDashboardData();
    } catch (err) {
      alert("Status update failed");
    }
  };

  if (loading) return <div className="p-10 text-slate-400 italic text-left">Initialising Medical Suite...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-12 text-left">
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-10">
  <div>
    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Portal</h1>
    <p className="text-slate-500 font-medium">Clinical overview and waveform analysis</p>
  </div>

  <div className="flex items-center gap-4">
    {/* Role Indicator */}
    <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      Medical Suite Active
    </div>

    {/* Logout Button */}
    <button 
      onClick={handleLogout}
      className="group flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl border border-slate-200 hover:border-red-200 transition-all duration-200 shadow-sm active:scale-95"
    >
      <span className="text-sm font-bold">Logout</span>
      <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
</header>

        {/* Pending Requests */}
       <section className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
  <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-transparent">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-amber-100 rounded-xl">
        <Clock className="text-amber-600" size={20} />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Access Requests</h2>
        <p className="text-xs text-slate-400 font-medium">Patients requesting clinical monitoring</p>
      </div>
    </div>
    <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
      {requests.length} Pending
    </span>
  </div>

  <div className="divide-y divide-slate-50">
    {requests.length > 0 ? (
      requests.map((req) => (
        <div 
          key={req.id} 
          className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
              {req.patient?.firstName[0]}
              {req.patient?.lastName[0]}
            </div>
            <div>
              <p className="font-bold text-slate-800 capitalize leading-tight">
                {req.patient?.firstName} {req.patient?.lastName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-400 font-medium">{req.patient?.email}</p>
                <span className="text-[10px] text-slate-300">•</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  Requested {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <button 
              onClick={() => updateRequestStatus(req.id, 'rejected')} 
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-all active:scale-95"
            >
              <XCircle size={18} />
              Decline
            </button>
            <button 
              onClick={() => updateRequestStatus(req.id, 'approved')} 
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              <CheckCircle2 size={18} />
              Approve Access
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="p-12 text-center">
        <div className="inline-flex p-4 bg-slate-50 rounded-2xl mb-3">
          <CheckCircle2 className="text-slate-200" size={32} />
        </div>
        <p className="text-slate-400 font-bold">Queue Clear</p>
        <p className="text-xs text-slate-300">All patient requests have been processed.</p>
      </div>
    )}
  </div>
</section>

        {/* My Patients Grid */}
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 mb-6">
            <UserCheck className="text-emerald-600" /> My Patients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {req.patient?.firstName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 capitalize">{req.patient?.firstName} {req.patient?.lastName}</h3>
                    <p className="text-slate-400 text-xs">Patient ID: {req.patient?.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPatient(req.patient)}
                  className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> Open Patient File
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- PATIENT FILE MODAL --- */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-in zoom-in duration-200">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                  {selectedPatient.firstName[0]}
                </div>
                <h2 className="text-xl font-bold text-slate-900 capitalize">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h2>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-2 text-slate-400 hover:bg-white hover:border-slate-200 border border-transparent rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {/* ECG Display */}
              <div className="bg-slate-900 rounded-2xl p-6 mb-8 relative">
                <h3 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Activity size={14} /> ECG Live Stream
                </h3>

                {isDataLoading ? (
                  <div className="h-48 flex items-center justify-center text-slate-500 italic">Processing patient data...</div>
                ) : patientReadings.length > 0 ? (
                  // Displaying the latest reading's data points
                  <EcgChart dataPoints={patientReadings[0].dataPoints || []} />
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-600 bg-slate-800/40 rounded-xl border border-slate-700 border-dashed">
                    <Zap size={20} className="mb-2 opacity-30" />
                    <p className="text-sm">No recorded waveforms found.</p>
                  </div>
                )}
              </div>

              {/* Patient Info Blocks */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Email Contact</p>
                  <p className="text-sm font-bold text-slate-800">{selectedPatient.email}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Last Data Sync</p>
                  <p className="text-sm font-bold text-slate-800">
                    {patientReadings.length > 0 ? new Date(patientReadings[0].createdAt).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
                Download Analysis Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}