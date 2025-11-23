import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Heart, MessageCircle, TrendingUp, Shield,
  Settings, Activity, UserCheck, UserX, Crown, Trash2, RefreshCw,
  Eye, Search, Filter
} from 'lucide-react';
import { adminAPI } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchUser, setSearchUser] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Redirect si pas admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, memoriesData, logsData] = await Promise.all([
        adminAPI.getGlobalStats(),
        adminAPI.getAllUsers({ limit: 100 }),
        adminAPI.getAllMemories({ limit: 50 }),
        adminAPI.getActivityLogs(30)
      ]);

      setStats(statsData);
      setUsers(usersData.users);
      setMemories(memoriesData.memories);
      setLogs(logsData.logs);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const confirmMsg = currentRole === 'admin' 
      ? 'Rétrograder cet administrateur en utilisateur ?' 
      : 'Promouvoir cet utilisateur en administrateur ?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await adminAPI.toggleUserRole(userId);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleToggleStatus = async (userId, username) => {
    if (!window.confirm(`Changer le statut de ${username} ?`)) return;

    try {
      const response = await adminAPI.toggleUserStatus(userId);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`⚠️ ATTENTION ! Supprimer définitivement ${username} et tous ses souvenirs ?`)) return;
    if (!window.confirm('Êtes-vous vraiment sûr ? Cette action est irréversible !')) return;

    try {
      const response = await adminAPI.deleteUser(userId);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleDeleteMemory = async (memoryId, title) => {
    if (!window.confirm(`Supprimer le souvenir "${title}" ?`)) return;

    try {
      const response = await adminAPI.deleteMemory(memoryId);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
                       u.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchRole = filterRole ? u.role === filterRole : true;
    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                <Shield className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Dashboard Admin</h1>
                <p className="text-gray-400">Bienvenue {user.username} 👑</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="btn-primary flex items-center space-x-2"
            >
              <RefreshCw size={20} />
              <span>Actualiser</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="text-blue-400" size={24} />}
              label="Utilisateurs"
              value={stats.overview.totalUsers}
              subtext={`${stats.overview.activeUsers} actifs`}
              color="blue"
            />
            <StatCard
              icon={<FileText className="text-purple-400" size={24} />}
              label="Souvenirs"
              value={stats.overview.totalMemories}
              subtext={`${stats.recentActivity.newMemories} cette semaine`}
              color="purple"
            />
            <StatCard
              icon={<Heart className="text-red-400" size={24} />}
              label="Likes"
              value={stats.overview.totalLikes}
              subtext="Total sur le site"
              color="red"
            />
            <StatCard
              icon={<TrendingUp className="text-green-400" size={24} />}
              label="Karma Total"
              value={stats.overview.totalKarma}
              subtext={`${stats.overview.totalComments} commentaires`}
              color="green"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-3 border-b border-gray-700 pb-4">
            {[
              { id: 'overview', label: '📊 Vue d\'ensemble', icon: Activity },
              { id: 'users', label: '👥 Utilisateurs', icon: Users },
              { id: 'memories', label: '📝 Souvenirs', icon: FileText },
              { id: 'logs', label: '📋 Logs', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && stats && (
              <OverviewTab stats={stats} />
            )}

            {activeTab === 'users' && (
              <UsersTab
                users={filteredUsers}
                searchUser={searchUser}
                setSearchUser={setSearchUser}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
                onToggleRole={handleToggleRole}
                onToggleStatus={handleToggleStatus}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {activeTab === 'memories' && (
              <MemoriesTab
                memories={memories}
                onDeleteMemory={handleDeleteMemory}
              />
            )}

            {activeTab === 'logs' && (
              <LogsTab logs={logs} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, subtext, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`card border-2 border-${color}-500/20 hover:border-${color}-500/50 transition-all`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`bg-${color}-500/20 p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</div>
    <div className="text-sm text-gray-400">{label}</div>
    <div className="text-xs text-gray-500 mt-1">{subtext}</div>
  </motion.div>
);

// Overview Tab
const OverviewTab = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">📊 Répartition par Type</h3>
        <div className="space-y-3">
          {stats.distribution.memoriesByType.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-400">
                {item._id === 'photo' ? '📷 Photos' : 
                 item._id === 'video' ? '🎥 Vidéos' : '📝 Anecdotes'}
              </span>
              <span className="text-white font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">🏆 Top 5 Utilisateurs</h3>
        <div className="space-y-3">
          {stats.topUsers.map((user, index) => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖️'}
                </span>
                <span className="text-gray-300">{user.username}</span>
              </div>
              <span className="text-primary-400 font-bold">{user.karma} 🔥</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Users Tab
const UsersTab = ({ users, searchUser, setSearchUser, filterRole, setFilterRole, onToggleRole, onToggleStatus, onDeleteUser }) => (
  <div className="space-y-4">
    {/* Filters */}
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>
      <select
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
        className="input"
      >
        <option value="">Tous les rôles</option>
        <option value="user">👤 Utilisateurs</option>
        <option value="admin">👑 Admins</option>
      </select>
    </div>

    {/* Users Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-gray-400">Utilisateur</th>
            <th className="px-4 py-3 text-left text-gray-400">Email</th>
            <th className="px-4 py-3 text-center text-gray-400">Rôle</th>
            <th className="px-4 py-3 text-center text-gray-400">Statut</th>
            <th className="px-4 py-3 text-center text-gray-400">Karma</th>
            <th className="px-4 py-3 text-center text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-800/50">
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                  <span className="text-white font-medium">{user.username}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-400">{user.email}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'admin' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {user.isActive ? '✅ Actif' : '❌ Inactif'}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-white font-bold">{user.karma || 0}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => onToggleRole(user._id, user.role)}
                    className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all"
                    title="Toggle Role"
                  >
                    <Crown size={16} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(user._id, user.username)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                    title="Toggle Status"
                  >
                    {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                  </button>
                  <button
                    onClick={() => onDeleteUser(user._id, user.username)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Memories Tab
const MemoriesTab = ({ memories, onDeleteMemory }) => (
  <div className="space-y-4">
    {memories.map((memory) => (
      <div key={memory._id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-3xl">
            {memory.type === 'photo' ? '📷' : memory.type === 'video' ? '🎥' : '📝'}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">{memory.title}</h3>
            <p className="text-gray-400 text-sm">
              Par {memory.author?.username} • {new Date(memory.createdAt).toLocaleDateString('fr-FR')}
            </p>
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>❤️ {memory.likes?.length || 0}</span>
              <span>💬 {memory.comments?.length || 0}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDeleteMemory(memory._id, memory.title)}
          className="btn-ghost text-red-400 hover:bg-red-500/20"
        >
          <Trash2 size={20} />
        </button>
      </div>
    ))}
  </div>
);

// Logs Tab
const LogsTab = ({ logs }) => (
  <div className="space-y-2">
    {logs.map((log, index) => (
      <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
        <span className="text-2xl">{log.icon}</span>
        <div className="flex-1">
          <p className="text-white">
            <span className="font-bold text-primary-400">{log.user}</span>
            {' '}{log.action}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(log.timestamp).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default AdminDashboard;
