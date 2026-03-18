import { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import EcgChart from '../../Components/EcgChart';
import { Activity, Heart, Clock, UserPlus, ShieldCheck, X, AlertCircle, CheckCircle2, Hourglass, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UploadReading from './UploadReading';

export default function PatientDashboard() {
  const [latestReading, setLatestReading] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [approvedId, setApprovedId] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [allReadings, setAllReadings] = useState([]);

  const navigate = useNavigate();

  const showToast = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const ecgRes = await API.get('/readings');
        
        // Corrected Data Extraction Logic
        const readingsArray = ecgRes.data?.data || [];
        setAllReadings(readingsArray);

        if (ecgRes.data?.success && ecgRes.data?.data?.ecgReading) {
          // If response has a single specific ecgReading object
          setLatestReading(ecgRes.data.data.ecgReading);
        } else {
          // Default to the first item in the readings array
          setLatestReading(readingsArray.length > 0 ? readingsArray[0] : null);
        }

        const userRes = await API.get('/users/me');
        const userData = userRes.data.data;

        if (userData.Doctor) {
          setApprovedId(userData.doctorId);
          setPendingId(null);
        } else if (userData.doctorId) {
          setPendingId(userData.doctorId);
          setApprovedId(null);
        } else {
          setApprovedId(null);
          setPendingId(null);
        }

        const doctorRes = await API.get('/requests/all/doctors');
        const verifiedDoctors = (doctorRes.data.data || []).filter(doc =>
          doc.role === 'doctor' && doc.DoctorProfile?.isVerified === true
        );
        setDoctors(verifiedDoctors);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [refreshTrigger]);

  const getDocStatus = (doctorId) => {
    if (approvedId === doctorId) return 'approved';
    if (pendingId === doctorId) return 'pending';
    return null;
  };

  const sendRequest = async (doctorId) => {
    try {
      await API.post('/requests/', { doctorId, message: "I would like you to monitor my ECG data." });
      showToast("Request sent successfully!", "success");
      setRefreshTrigger(prev => !prev);
    } catch (err) {
      showToast(err.response?.data?.message || "Error sending request", "error");
    }
  };

  const sampleData = [0, 0.2, 0.5, 0.1, -0.2, 0.8, 0.1, 0.2, 0.5, 0];

  return (
    <div className="bg-slate-50 min-h-screen pb-12 text-left font-sans">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Health Overview</h1>
            <p className="text-slate-500 font-medium">Real-time ECG monitoring & AI Analysis</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100 shadow-inner">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Patient Portal
            </div>

            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl border border-slate-200 hover:border-red-200 transition-all duration-200 shadow-sm active:scale-95"
            >
              <span className="text-sm font-bold">Logout</span>
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<Heart className={latestReading?.abnormalDetected ? "animate-pulse text-red-500" : "text-red-500"} />} 
            title="Avg BPM" 
            value={latestReading ? "74" : "--"} 
            unit="bpm" 
          />
          <StatCard 
            icon={<Activity className={latestReading?.abnormalDetected ? "text-red-500" : "text-blue-500"} />} 
            title="AI Analysis" 
            value={latestReading ? (latestReading.abnormalDetected ? "Abnormal" : "Normal") : "No Data"} 
            color={latestReading?.abnormalDetected ? "text-red-600" : "text-emerald-600"}
            unit={latestReading?.abnormalDetected ? `(${latestReading.classLabel})` : ""}
          />
          <StatCard 
            icon={<Clock className="text-purple-500" />} 
            title="Last Sync" 
            value={latestReading ? new Date(latestReading.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"} 
            unit={latestReading ? "Today" : ""}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Activity className="text-blue-600" /> Live Waveform
              </h2>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              >
                View History
              </button>
            </div>
            <EcgChart readingData={latestReading || { dataPoints: sampleData }} />
            <div className="mt-8">
              <UploadReading onUploadSuccess={() => setRefreshTrigger(!refreshTrigger)} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <ShieldCheck className="text-blue-600" /> Verified Doctors
              </h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {doctors.map((doc) => {
                  const status = getDocStatus(doc.id);
                  return (
                    <div key={doc.id} className={`p-4 rounded-xl border transition-all ${
                      status === 'approved' ? 'bg-emerald-50 border-emerald-100 ring-1 ring-emerald-500/20' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                            status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {doc.firstName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 capitalize leading-tight">
                              Dr. {doc.firstName} {doc.lastName}
                            </p>
                            <div className="mt-1">
                              {status === 'approved' ? (
                                <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Active Monitor
                                </span>
                              ) : status === 'pending' ? (
                                <span className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
                                  <Hourglass size={12} className="animate-pulse" /> Request Pending
                                </span>
                              ) : (
                                <button
                                  onClick={() => setSelectedDoctor(doc)}
                                  className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:underline"
                                >
                                  View Profile
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10">
                          {status === 'approved' ? (
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shadow-sm">
                              <CheckCircle2 size={20} />
                            </div>
                          ) : status === 'pending' ? (
                            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg border border-amber-100 shadow-sm">
                              <Hourglass size={20} className="animate-spin-slow" />
                            </div>
                          ) : (
                            <button
                              onClick={() => sendRequest(doc.id)}
                              className="p-2.5 bg-white border border-slate-200 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 group"
                            >
                              <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Info Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative text-center">
            <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400">
              <X size={20} />
            </button>
            <div className="p-8">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4">
                {selectedDoctor.firstName[0]}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 capitalize">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h2>
              <div className="mt-6 space-y-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Specialization</span>
                  <span className="text-slate-900 font-semibold">{selectedDoctor.DoctorProfile?.specialization}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Clinic</span>
                  <span className="text-slate-900 font-semibold">{selectedDoctor.DoctorProfile?.clinicName}</span>
                </div>
              </div>
              {!getDocStatus(selectedDoctor.id) && (
                <button
                  onClick={() => { sendRequest(selectedDoctor.id); setSelectedDoctor(null); }}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <UserPlus size={18} /> Request Monitoring
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Slide-over Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Reading History</h2>
                <p className="text-xs text-slate-500 font-medium">Select a record to view details</p>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {allReadings.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-medium">No readings found</p>
                </div>
              ) : (
                allReadings.map((reading) => (
                  <div 
                    key={reading._id}
                    onClick={() => {
                      setLatestReading(reading);
                      setIsHistoryOpen(false);
                    }}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${reading.abnormalDetected ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Heart size={18} className={reading.abnormalDetected ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {reading.classLabel || (reading.abnormalDetected ? "Abnormal" : "Normal")}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={10} /> {new Date(reading.recordedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${
                        reading.abnormalDetected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {reading.abnormalDetected ? 'Critical' : 'Healthy'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Showing {allReadings.length} Total Records
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-semibold text-sm">{notification.message}</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, unit, color = "text-slate-900" }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>
          {value} <span className="text-xs font-normal text-slate-400 uppercase">{unit}</span>
        </p>
      </div>
    </div>
  );
}