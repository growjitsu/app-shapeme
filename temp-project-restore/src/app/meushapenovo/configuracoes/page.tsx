'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  Lock, 
  CheckCircle,
  Edit,
  Save,
  X
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/app');
        return;
      }

      setUser(session.user);
      
      try {
        const { data: userDataResult } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userDataResult) {
          setUserData(userDataResult);
          setEditedName(userDataResult.name || '');
        } else {
          const defaultData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.email?.split('@')[0] || 'Usuário',
            created_at: session.user.created_at
          };
          setUserData(defaultData);
          setEditedName(defaultData.name);
        }
      } catch (error) {
        const defaultData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.email?.split('@')[0] || 'Usuário',
          created_at: session.user.created_at
        };
        setUserData(defaultData);
        setEditedName(defaultData.name);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!user || !editedName) return;

    try {
      const { error } = await supabase
        .from('users')
        .upsert([
          {
            id: user.id,
            email: user.email,
            name: editedName,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      setUserData({ ...userData, name: editedName });
      setEditMode(false);
      alert('Nome atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      alert('Erro ao atualizar nome. Tente novamente.');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  const accountAge = userData?.created_at 
    ? Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl font-bold text-white">Configurações</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dados Pessoais */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Dados Pessoais</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Editar</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveName}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditedName(userData?.name || '');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Nome</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-white font-semibold">{userData?.name || 'Não informado'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">E-mail</p>
                <p className="text-white font-semibold">{userData?.email || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Membro desde</p>
                <p className="text-white font-semibold">
                  {userData?.created_at 
                    ? new Date(userData.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plano e Assinatura */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Plano e Assinatura</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">Plano Atual</p>
                <p className="text-white font-bold text-lg">Premium</p>
              </div>
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">Ativo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Duração da Assinatura</p>
                <p className="text-white font-semibold text-lg">{accountAge} dias</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Status da Conta</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-green-400 font-semibold">Ativa e Funcional</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Benefícios do Plano Premium:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Acesso ilimitado a todos os treinos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Planos alimentares personalizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Acompanhamento de progresso com gráficos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Sistema de conquistas e gamificação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Segurança</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Senha</p>
                  <p className="text-sm text-gray-400">••••••••</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Alterar Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Alterar Senha</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite a senha novamente"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Salvar Nova Senha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
