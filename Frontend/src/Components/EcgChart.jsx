import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

export default function EcgChart({ dataPoints }) {
  // Format the simple array [0.1, 0.2...] into Recharts format [{ val: 0.1 }, { val: 0.2 }...]
  const formattedData = dataPoints.map((val, index) => ({
    time: index,
    value: val,
  }));

  return (
    <div className="h-64 w-full bg-slate-900 rounded-xl p-4 shadow-inner relative overflow-hidden">
      {/* Medical Grid Background Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <YAxis hide domain={[-1, 1]} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" // Emerald-500
            strokeWidth={2} 
            dot={false} 
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}