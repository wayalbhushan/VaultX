import { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";
import { Shield, Settings, Home, Activity } from "lucide-react";

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await API.get("/activity");
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-green-500 p-6 flex flex-col justify-between shadow-lg fixed top-0 left-0 bottom-0 z-10">
        <div>
          <h1 className="text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.7)]">
            VaultX
          </h1>
          <nav className="flex flex-col gap-4 mt-6">
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-300 transition"><Home size={18} /> Dashboard</Link>
            <Link to="/dashboard/secrets" className="flex items-center gap-2 hover:text-green-300 transition"><Shield size={18} /> My Secrets</Link>
            <Link to="/dashboard/activity" className="flex items-center gap-2 text-green-200 font-bold"><Activity size={18} /> Activity</Link>
            <Link to="/dashboard/settings" className="flex items-center gap-2 hover:text-green-300 transition"><Settings size={18} /> Settings</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 ml-64">
        <h1 className="text-4xl font-bold text-green-300 mb-8">Activity Log</h1>
        
        <div className="bg-gray-900/80 border border-green-500 rounded-lg p-6 shadow-lg">
          {isLoading ? (
            <p>Loading activity...</p>
          ) : activities.length > 0 ? (
            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity._id} className="flex items-start gap-4 pb-4 border-b border-green-500/20 last:border-b-0">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500">
                    <Activity size={16} className="text-green-400"/>
                  </div>
                  <div>
                    <p className="text-green-300">{activity.action}</p>
                    <p className="text-sm text-green-500/80">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-500/70 text-center py-8">No activity has been recorded yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
