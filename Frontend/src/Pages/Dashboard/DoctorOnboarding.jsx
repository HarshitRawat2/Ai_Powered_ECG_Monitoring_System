export default function DoctorOnboarding({ onComplete }) {
  const [profile, setProfile] = useState({ specialization: '', experience: '', clinicName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/doctors', profile); // Matches your JSON structure
    onComplete(); // Reload the dashboard
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl border shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Complete Your Professional Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fields for specialization, experience, clinicName */}
        <input placeholder="Specialization (e.g. Cardiologist)" className="w-full p-3 border rounded-lg" 
          onChange={(e) => setProfile({...profile, specialization: e.target.value})} />
        <input type="number" placeholder="Years of Experience" className="w-full p-3 border rounded-lg" 
          onChange={(e) => setProfile({...profile, experience: parseInt(e.target.value)})} />
        <input placeholder="Clinic/Hospital Name" className="w-full p-3 border rounded-lg" 
          onChange={(e) => setProfile({...profile, clinicName: e.target.value})} />
        
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Save Profile</button>
      </form>
    </div>
  );
}