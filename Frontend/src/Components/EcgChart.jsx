import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, ShieldCheck, AlertCircle, Zap, Info, TrendingUp } from 'lucide-react';

export default function EcgChart({ readingData }) {
const dataPoints = 
    readingData?.dataPoints || 
    readingData?.ecgReading?.dataPoints || 
    readingData?.data?.ecgReading?.dataPoints;

  const isAbnormal = readingData?.abnormalDetected ?? false;
  const classLabel = readingData?.classLabel || (isAbnormal ? "Arrhythmia Detected" : "Normal Sinus Rhythm");

  // If we still have no data points, only then use sample
  const finalPoints = dataPoints && dataPoints.length > 0 
    ? dataPoints 
    : [0, 0.1, -0.1, 0.5, 0]; 

  const chartData = finalPoints.map((val, i) => ({ index: i, voltage: val }));

  return (
    <div className="relative group">
      {/* Background Glow for Abnormalities */}
      {isAbnormal && (
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
      )}

      <div className={`relative bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden ${
        isAbnormal ? 'border-red-100 shadow-2xl shadow-red-900/5' : 'border-slate-100 shadow-xl shadow-blue-900/5'
      }`}>
        
        {/* Top Section: Facts & Classification */}
        <div className="p-8 pb-4 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isAbnormal ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Signal Analysis</h3>
            </div>
            <p className="text-slate-500 font-medium text-sm ml-6 uppercase tracking-widest flex items-center gap-2">
              Status: <span className={isAbnormal ? 'text-red-600 font-black' : 'text-emerald-600 font-black'}>
                {isAbnormal ? 'Abnormality Flagged' : 'Optimal'}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <div className={`px-4 py-2 rounded-2xl border flex flex-col items-end ${
              isAbnormal ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
            }`}>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Classification</span>
              <span className={`text-sm font-black ${isAbnormal ? 'text-red-700' : 'text-blue-700'}`}>
                {classLabel}
              </span>
            </div>
            
           
          </div>
        </div>

        {/* The ECG Visualization - With Medical Grid Background */}
        <div className="h-72 w-full relative px-4">
          {/* Medical Grid Simulation */}
          <div className="absolute inset-0 m-8 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
          />
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isAbnormal ? "#ef4444" : "#3b82f6"} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={isAbnormal ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip 
                cursor={{ stroke: isAbnormal ? '#ef4444' : '#3b82f6', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Voltage</p>
                        <p className="text-lg font-black">{payload[0].value.toFixed(3)} mV</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="voltage" 
                stroke={isAbnormal ? '#ef4444' : '#2563eb'} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorWave)" 
                animationDuration={2500}
                // Add a subtle glow to the line
                filter="drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="bg-slate-50/50 p-6 flex flex-wrap gap-6 items-center border-t border-slate-100">
       

          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Info size={14} className="text-purple-500" />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase">Detection ID</p>
               <p className="text-xs font-bold text-slate-700">#{readingData?._id?.slice(-6).toUpperCase() || "DEMO"}</p>
             </div>
          </div>

          {isAbnormal && (
            <div className="ml-auto">
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-95">
                <Zap size={16} fill="white" />
                Emergency Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}