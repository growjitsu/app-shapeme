'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
  X,
  AlertCircle
} from 'lucide-react';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'Ativo' | 'Inativo';
  joinDate: string;
  lastAccess: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  registeredUsers: number;
  premiumUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'stats'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    registeredUsers: 0,
    premiumUsers: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticação
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);

  // Buscar dados reais do Supabase
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        // Buscar todos os usuários da tabela users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, email, name, created_at, last_sign_in_at')
          .order('created_at', { ascending: false });

        if (usersError) {
          console.error('Erro ao buscar usuários:', usersError);
          setError(`Erro ao buscar usuários: ${usersError.message}`);
          
          // Se a tabela não existir, mostrar mensagem específica
          if (usersError.message.includes('relation') || usersError.message.includes('does not exist')) {
            setError('Tabela "users" não encontrada. Execute o script CONFIGURAR_PAINEL_ADMIN.sql no Supabase.');
          }
          
          setLoading(false);
          return;
        }

        // Buscar assinaturas ativas
        const { data: subscriptionsData, error: subsError } = await supabase
          .from('subscriptions')
          .select('user_id, is_active, plan_type, amount, payment_status')
          .eq('is_active', true);

        if (subsError) {
          console.error('Erro ao buscar assinaturas:', subsError);
          // Não bloqueia se assinaturas não existirem, apenas não mostra dados premium
        }

        // Mapear usuários com informações de assinatura
        const mappedUsers: User[] = (usersData || []).map((user: any) => {
          const subscription = subscriptionsData?.find(sub => sub.user_id === user.id);
          const hasActiveSub = !!subscription;
          
          return {
            id: user.id,
            name: user.name || 'Sem nome',
            email: user.email || 'Sem email',
            plan: hasActiveSub ? 'Premium Completo' : 'Sem plano',
            status: hasActiveSub ? 'Ativo' : 'Inativo',
            joinDate: user.created_at || new Date().toISOString(),
            lastAccess: user.last_sign_in_at || user.created_at || new Date().toISOString()
          };
        });

        setUsers(mappedUsers);

        // Calcular estatísticas
        const totalUsers = mappedUsers.length;
        const activeUsers = mappedUsers.filter(u => u.status === 'Ativo').length;
        const registeredUsers = totalUsers; // Todos os usuários cadastrados
        const premiumUsers = mappedUsers.filter(u => u.plan === 'Premium Completo').length;

        setStats({
          totalUsers,
          activeUsers,
          registeredUsers,
          premiumUsers
        });

      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        setError(`Erro inesperado: ${error.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    router.push('/admin/login');
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inativo': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
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
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-bold mb-2">Erro ao carregar dados</h3>
                  <p className="text-red-300 text-sm mb-4">{error}</p>
                  <div className="bg-red-500/20 rounded-xl p-4 text-sm text-red-200">
                    <p className="font-bold mb-2">📋 Solução:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Abra o SQL Editor no dashboard do Supabase</li>
                      <li>Copie e cole o conteúdo do arquivo <code className="bg-red-500/30 px-2 py-1 rounded">CONFIGURAR_PAINEL_ADMIN.sql</code></li>
                      <li>Execute o script clicando em "Run"</li>
                      <li>Recarregue esta página</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-white text-lg">Carregando dados do banco...</div>
              </div>
            </div>
          ) : (
            <>
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
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stats.registeredUsers}</h3>
                      <p className="text-gray-400 text-sm">Usuários Cadastrados</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stats.activeUsers}</h3>
                      <p className="text-gray-400 text-sm">Usuários Ativos (Com Plano)</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stats.premiumUsers}</h3>
                      <p className="text-gray-400 text-sm">Plano Premium Completo</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">R$ {(stats.premiumUsers * 97).toFixed(2)}</h3>
                      <p className="text-gray-400 text-sm">Receita Estimada</p>
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Usuários Recentes</h2>
                    {users.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Nenhum usuário encontrado</p>
                        <p className="text-gray-500 text-sm mt-2">Execute o script SQL para criar dados de exemplo</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {users.slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-white font-medium">{user.name}</h3>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.plan === 'Premium Completo' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-gray-500/20 text-gray-400'}`}>
                                {user.plan}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Nenhum usuário encontrado</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Usuário</th>
                              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Plano</th>
                              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Data de Cadastro</th>
                              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Último Acesso</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                      {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="text-white font-medium">{user.name}</div>
                                      <div className="text-gray-400 text-sm">{user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.plan === 'Premium Completo' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white inline-flex items-center gap-1' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {user.plan === 'Premium Completo' && <Crown className="w-3 h-3" />}
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  {/* Plan Distribution */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Distribuição de Usuários</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-xl p-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stats.premiumUsers}</h3>
                        <p className="text-gray-400 text-sm mb-2">Plano Premium Completo</p>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                            style={{ width: `${stats.totalUsers > 0 ? (stats.premiumUsers / stats.totalUsers) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          {stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}% do total
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-4">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stats.totalUsers - stats.premiumUsers}</h3>
                        <p className="text-gray-400 text-sm mb-2">Sem Plano</p>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600"
                            style={{ width: `${stats.totalUsers > 0 ? ((stats.totalUsers - stats.premiumUsers) / stats.totalUsers) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          {stats.totalUsers > 0 ? (((stats.totalUsers - stats.premiumUsers) / stats.totalUsers) * 100).toFixed(1) : 0}% do total
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Overview */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Status dos Usuários</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-xl p-6">
                        <h3 className="text-2xl font-bold text-white mb-1">{stats.activeUsers}</h3>
                        <p className="text-sm font-medium text-green-400">Ativos (Com Plano Premium)</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-6">
                        <h3 className="text-2xl font-bold text-white mb-1">{stats.totalUsers - stats.activeUsers}</h3>
                        <p className="text-sm font-medium text-yellow-400">Inativos (Sem Plano)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
