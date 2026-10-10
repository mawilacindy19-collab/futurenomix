'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Activity,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Loader2,
  Flag
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserRole, useAuth } from '@/lib/auth-utils';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface Report {
  id: string;
  contentId: string;
  reason: string;
  reporterId: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

// Generate mock data for the last 30 days
const generateChartData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      registrations: Math.floor(Math.random() * 20) + 5,
      activity: Math.floor(Math.random() * 100) + 50,
    });
  }
  return data;
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!isAdmin) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersSnap, reportsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'reports'))
        ]);
        
        const fetchedUsers: UserProfile[] = [];
        usersSnap.forEach((doc) => fetchedUsers.push(doc.data() as UserProfile));
        setUsers(fetchedUsers);

        const fetchedReports: Report[] = [];
        reportsSnap.forEach((doc) => fetchedReports.push({ id: doc.id, ...doc.data() } as Report));
        setReports(fetchedReports);
        setChartData(generateChartData());
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, authLoading, roleLoading, router]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update role.');
    }
  };

  const handleReportAction = async (reportId: string, action: 'resolved' | 'dismissed') => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { status: action });
      setReports(reports.map(r => r.id === reportId ? { ...r, status: action } : r));
    } catch (err) {
      console.error('Error updating report:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  if (authLoading || roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-sm font-medium text-zinc-500">Loading administrative console...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">System Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Monitor, authorize, and manage ecosystem permissions and content.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">System Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={users.length.toString()} color="blue" />
        <StatCard icon={Shield} label="Admins" value={users.filter(u => u.role === 'Admin').length.toString()} color="red" />
        <StatCard icon={Flag} label="Pending Reports" value={reports.filter(r => r.status === 'pending').length.toString()} color="amber" />
        <StatCard icon={Activity} label="Active Today" value="12" color="emerald" />
      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
        <h3 className="text-base font-bold mb-6">User Registrations & Activity (30 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="registrations" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Community Reports
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Content ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Reason</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {reports.filter(r => r.status === 'pending').map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-4 text-sm">{r.contentId}</td>
                  <td className="px-6 py-4 text-sm">{r.reason}</td>
                  <td className="px-6 py-4 text-sm">{r.status}</td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <button onClick={() => handleReportAction(r.id, 'resolved')} className="text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-lg">Resolve</button>
                    <button onClick={() => handleReportAction(r.id, 'dismissed')} className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-lg">Dismiss</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admins</option>
              <option value="Member">Members</option>
              <option value="Guest">Guests</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">User</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status / Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Account ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{u.name}</p>
                          <p className="text-[10px] text-zinc-500">@{u.username} · {u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        u.role === 'Admin' ? "bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20" :
                        u.role === 'Member' ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20" :
                        "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">{u.id}</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="text-[10px] font-bold bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="Member">Set Member</option>
                          <option value="Admin">Set Admin</option>
                          <option value="Guest">Set Guest</option>
                        </select>
                        <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Notice */}
      <div className="mt-8 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <div className="text-xs text-zinc-500 leading-relaxed">
          <p className="font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">Administrative Security Notice</p>
          <p>
            This console provides access to sensitive ecosystem data and administrative privileges. Every action taken is logged for audit purposes under the FutureNomix Data Governance Framework. Please ensure all modifications comply with internal data privacy rules and user management standards.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-500/10",
    red: "text-red-600 bg-red-500/10",
    emerald: "text-emerald-600 bg-emerald-500/10",
    amber: "text-amber-600 bg-amber-500/10"
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4", colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-1">{value}</p>
    </div>
  );
}
