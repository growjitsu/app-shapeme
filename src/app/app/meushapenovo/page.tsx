'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  Camera, 
  Dumbbell, 
  Apple, 
  Target,
  Calendar,
  Award,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  Activity,
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note: string | null;
}

interface ProgressPhoto {
  id: string;
  date: string;
  image_url: string;
  weight: number;
  note: string | null;
}

interface Goal {
  id: string;
  type: 'lose' | 'gain';
  current_weight: number;
  target_weight: number;
  start_date: string;
  target_date: string | null;
  starting_weight: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function AppPage() {
  const { user, userData, subscription, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modais
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalWeight, setNewGoalWeight] = useState('');
  const [newGoalType, setNewGoalType] = useState<'lose' | 'gain'>('lose');

  useEffect(() => {
    if (user && !authLoading) {
      loadData();
    }
  }, [user, authLoading]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Carrega entradas de peso
      const { data: weights } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (weights) setWeightEntries(weights);

      // Carrega fotos de progresso
      const { data: photos } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (photos) setProgressPhotos(photos);

      // Carrega meta
      const { data: goalData } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (goalData) setGoal(goalData);

      // Gera conquistas baseadas no progresso
      generateAchievements(weights || [], photos || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = (weights: WeightEntry[], photos: ProgressPhoto[]) => {
    const achievementsList: Achievement[] = [
      {
        id: '1',
        title: 'Primeira Pesagem',
        description: 'Registrou seu primeiro peso',
        icon: '⚖️',
        unlocked: weights.length > 0,
      },
      {
        id: '2',
        title: 'Primeira Foto',
        description: 'Adicionou sua primeira foto de progresso',
        icon: '📸',
        unlocked: photos.length > 0,
      },
      {
        id: '3',
        title: 'Consistente',
        description: 'Registrou peso por 7 dias seguidos',
        icon: '🔥',
        unlocked: weights.length >= 7,
      },
      {
        id: '4',
        title: 'Transformação Visível',
        description: 'Adicionou 5 fotos de progresso',
        icon: '✨',
        unlocked: photos.length >= 5,
      },
      {
        id: '5',
        title: 'Dedicado',
        description: 'Registrou peso por 30 dias',
        icon: '💪',
        unlocked: weights.length >= 30,
      },
    ];

    setAchievements(achievementsList);
  };

  const handleAddGoal = async () => {
    if (!user || !newGoalWeight) return;

    const currentWeight = weightEntries[0]?.weight || 0;

    try {
      const { error } = await supabase
        .from('goals')
        .upsert([
          {
            user_id: user.id,
            type: newGoalType,
            current_weight: currentWeight,
            target_weight: parseFloat(newGoalWeight),
            start_date: new Date().toISOString().split('T')[0],
            starting_weight: currentWeight,
          },
        ]);

      if (error) throw error;

      setNewGoalWeight('');
      setShowGoalModal(false);
      loadData();
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  const currentWeight = weightEntries[0]?.weight || 0;
  const startWeight = weightEntries[weightEntries.length - 1]?.weight || currentWeight;
  const weightLost = startWeight - currentWeight;
  const daysActive = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const workoutsCompleted = Math.floor(daysActive * 0.8); // Estimativa

  // Dados para o gráfico
  const chartData = weightEntries
    .slice(0, 30)
    .reverse()
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: entry.weight,
    }));

  const planType = subscription?.plan_type === 'top' ? 'Premium Completo' : 'Premium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Meu Shape Novo</h1>
                <p className="text-xs text-gray-400">{planType}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={signOut} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Olá, {userData.name}! 👋
          </h2>
          <p className="text-gray-400">
            Bem-vindo de volta! Continue sua jornada de transformação.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {weightLost > 0 ? `-${weightLost.toFixed(1)}kg` : `+${Math.abs(weightLost).toFixed(1)}kg`}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Peso Perdido</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {daysActive}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Dias Ativos</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-400">
                {workoutsCompleted}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Treinos Completos</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-400">
                {progressPhotos.length}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Fotos de Evolução</h3>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weight Progress */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Progresso de Peso</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Peso Inicial</span>
                <span className="text-white font-bold">{startWeight.toFixed(1)}kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Peso Atual</span>
                <span className="text-green-400 font-bold">{currentWeight.toFixed(1)}kg</span>
              </div>
              {goal && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Meta</span>
                  <span className="text-purple-400 font-bold">{goal.target_weight.toFixed(1)}kg</span>
                </div>
              )}
              
              {/* Progress Bar */}
              {goal && (
                <div className="pt-4">
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, ((startWeight - currentWeight) / (startWeight - goal.target_weight) * 100))}%` 
                      }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    {Math.min(100, ((startWeight - currentWeight) / (startWeight - goal.target_weight) * 100)).toFixed(0)}% da meta alcançada
                  </p>
                </div>
              )}

              {/* Últimas pesagens */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Últimas Pesagens</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {weightEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-white font-medium">{entry.weight.toFixed(1)}kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5" />
                  Ver Treinos
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <Apple className="w-5 h-5" />
                  Plano Alimentar
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Gráfico de Evolução */}
        {chartData.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">Gráfico de Evolução</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => setActiveTab('progress')}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gráficos de Evolução</h3>
            <p className="text-gray-400 text-sm">
              Acompanhe seu progresso com gráficos detalhados de peso e composição corporal.
            </p>
          </div>

          <div 
            onClick={() => setShowGoalModal(true)}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Metas Personalizadas</h3>
            <p className="text-gray-400 text-sm">
              Defina e acompanhe suas metas de peso e objetivos específicos.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('achievements')}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Conquistas</h3>
            <p className="text-gray-400 text-sm">
              Desbloqueie conquistas e celebre cada marco da sua jornada de transformação.
            </p>
          </div>
        </div>

        {/* Conquistas */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Suas Conquistas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Award className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fotos de Progresso */}
        {progressPhotos.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Fotos de Progresso</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {progressPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img 
                    src={photo.image_url} 
                    alt="Progresso"
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center p-2">
                    <p className="text-white font-semibold">{photo.weight.toFixed(1)}kg</p>
                    <p className="text-gray-300 text-xs">
                      {new Date(photo.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Definir Meta */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Definir Meta</h3>
              <button 
                onClick={() => setShowGoalModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Meta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewGoalType('lose')}
                    className={`p-3 rounded-lg border transition-all ${
                      newGoalType === 'lose'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    Perder Peso
                  </button>
                  <button
                    onClick={() => setNewGoalType('gain')}
                    className={`p-3 rounded-lg border transition-all ${
                      newGoalType === 'gain'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    Ganhar Peso
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso Meta (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newGoalWeight}
                  onChange={(e) => setNewGoalWeight(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="70.0"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  Seu peso atual: <strong>{currentWeight.toFixed(1)}kg</strong>
                </p>
              </div>

              <button
                onClick={handleAddGoal}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Salvar Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
