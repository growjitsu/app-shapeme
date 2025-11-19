'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  LogOut,
  Home,
  BarChart3,
  Settings,
  UserPlus,
  Crown,
  Shield,
  Menu,
  X
} from 'lucide-react';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Simples' | 'Médio' | 'Top';
  status: 'Ativo' | 'Inativo' | 'Cancelado';
  joinDate: string;
  lastAccess: string;
  weight: number;
  goal: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'stats'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);

  // Dados mockados (em produção, buscar do Supabase)
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        plan: 'Top',
        status: 'Ativo',
        joinDate: '2024-01-15',
        lastAccess: '2024-03-20',
        weight: 68,
        goal: 'Perder peso'
      },
      {
        id: '2',
        name: 'João Santos',
        email: 'joao@email.com',
        plan: 'Médio',
        status: 'Ativo',
        joinDate: '2024-02-10',
        lastAccess: '2024-03-19',
        weight: 82,
        goal: 'Ganhar massa'
      },
      {
        id: '3',
        name: 'Ana Costa',
        email: 'ana@email.com',
        plan: 'Simples',
        status: 'Ativo',
        joinDate: '2024-03-01',
        lastAccess: '2024-03-20',
        weight: 62,
        goal: 'Manter peso'
      },
      {
        id: '4',
        name: 'Pedro Oliveira',
        email: 'pedro@email.com',
        plan: 'Top',
        status: 'Ativo',
        joinDate: '2024-01-20',
        lastAccess: '2024-03-18',
        weight: 90,
        goal: 'Perder peso'
      },
      {
        id: '5',
        name: 'Carla Mendes',
        email: 'carla@email.com',
        plan: 'Médio',
        status: 'Inativo',
        joinDate: '2024-02-15',
        lastAccess: '2024-03-10',
        weight: 58,
        goal: 'Ganhar massa'
      }
    ];
    setUsers(mockUsers);
  }, []);

  // Estatísticas
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'Ativo').length,
    newThisMonth: users.filter(u => new Date(u.joinDate).getMonth() === new Date().getMonth()).length,
    revenue: users.filter(u => u.status === 'Ativo').reduce((acc, u) => {
      const prices = { 'Simples': 19.90, 'Médio': 27.90, 'Top': 39.90 };
      return acc + prices[u.plan];
    }, 0)
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    router.push('/admin/login');
  };

  // Plan badge color
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Top': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'Médio': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Simples': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inativo': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Cancelado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-950/95 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold">Admin Panel</h2>
                <p className="text-xs text-gray-400">Meu Shape Novo</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Usuários</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Estatísticas</span>
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-950/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl text-white"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-slate-950/50 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'users' && 'Gerenciar Usuários'}
                {activeTab === 'stats' && 'Estatísticas'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Bem-vindo ao painel administrativo
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">+12%</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</h3>
                  <p className="text-gray-400 text-sm">Total de Usuários</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">+8%</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stats.activeUsers}</h3>
                  <p className="text-gray-400 text-sm">Usuários Ativos</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">+24%</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stats.newThisMonth}</h3>
                  <p className="text-gray-400 text-sm">Novos Este Mês</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">+18%</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">R$ {stats.revenue.toFixed(2)}</h3>
                  <p className="text-gray-400 text-sm">Receita Mensal</p>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Usuários Recentes</h2>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{user.name}</h3>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)} text-white`}>
                          {user.plan}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar usuário..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select
                    value={filterPlan}
                    onChange={(e) => setFilterPlan(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos os Planos</option>
                    <option value="Simples">Simples</option>
                    <option value="Médio">Médio</option>
                    <option value="Top">Top</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Usuário</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Plano</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Data de Entrada</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Último Acesso</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.name}</div>
                                <div className="text-gray-400 text-sm">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)} text-white inline-flex items-center gap-1`}>
                              {user.plan === 'Top' && <Crown className="w-3 h-3" />}
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {new Date(user.lastAccess).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Plan Distribution */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Distribuição por Plano</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {['Simples', 'Médio', 'Top'].map((plan) => {
                    const count = users.filter(u => u.plan === plan).length;
                    const percentage = ((count / users.length) * 100).toFixed(1);
                    return (
                      <div key={plan} className="bg-white/5 rounded-xl p-6">
                        <div className={`w-12 h-12 ${getPlanColor(plan)} rounded-xl flex items-center justify-center mb-4`}>
                          {plan === 'Top' && <Crown className="w-6 h-6 text-white" />}
                          {plan === 'Médio' && <TrendingUp className="w-6 h-6 text-white" />}
                          {plan === 'Simples' && <Users className="w-6 h-6 text-white" />}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{count}</h3>
                        <p className="text-gray-400 text-sm mb-2">Plano {plan}</p>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getPlanColor(plan)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">{percentage}% do total</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Status dos Usuários</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {['Ativo', 'Inativo', 'Cancelado'].map((status) => {
                    const count = users.filter(u => u.status === status).length;
                    return (
                      <div key={status} className="bg-white/5 rounded-xl p-6">
                        <h3 className="text-2xl font-bold text-white mb-1">{count}</h3>
                        <p className={`text-sm font-medium ${getStatusColor(status).split(' ')[1]}`}>
                          {status}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
