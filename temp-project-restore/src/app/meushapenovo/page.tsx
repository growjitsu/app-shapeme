'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  X,
  Loader2,
  Flame
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note: string | null;
}

interface CalorieEntry {
  id: string;
  date: string;
  image_url: string;
  calories: number;
  food_name: string;
  created_at: string;
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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntry[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Estados para modais
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showCalorieModal, setShowCalorieModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightNote, setNewWeightNote] = useState('');
  const [newGoalWeight, setNewGoalWeight] = useState('');
  const [newGoalType, setNewGoalType] = useState<'lose' | 'gain'>('lose');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [calorieResult, setCalorieResult] = useState<{
    calories: number;
    foodName: string;
    confidence: number;
  } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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
        } else {
          setUserData({
            id: session.user.id,
            email: session.user.email,
            name: session.user.email?.split('@')[0] || 'Usuário',
            created_at: session.user.created_at
          });
        }
      } catch (error) {
        setUserData({
          id: session.user.id,
          email: session.user.email,
          name: session.user.email?.split('@')[0] || 'Usuário',
          created_at: session.user.created_at
        });
      }

      await loadData(session.user.id);
    } catch (error) {
      console.error('Erro na autenticação:', error);
      router.push('/app');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (userId: string) => {
    try {
      try {
        const { data: weights } = await supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (weights) setWeightEntries(weights);
      } catch (error) {
        console.log('Tabela weight_entries não encontrada');
      }

      try {
        const { data: calories } = await supabase
          .from('calorie_entries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (calories) setCalorieEntries(calories);
      } catch (error) {
        console.log('Tabela calorie_entries não encontrada');
      }

      try {
        const { data: goalData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (goalData) setGoal(goalData);
      } catch (error) {
        console.log('Tabela goals não encontrada');
      }

      generateAchievements(weightEntries, calorieEntries);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const generateAchievements = (weights: WeightEntry[], calories: CalorieEntry[]) => {
    const achievementsList: Achievement[] = [
      {
        id: '1',
        title: 'Cadastro Concluído',
        description: 'Bem-vindo ao Meu Shape Novo!',
        icon: '🎉',
        unlocked: true,
      },
      {
        id: '2',
        title: 'Primeiro Dia Completo',
        description: 'Você acessou o app pela primeira vez',
        icon: '🌟',
        unlocked: true,
      },
      {
        id: '3',
        title: 'Primeiro Registro de Peso',
        description: 'Registrou seu primeiro peso',
        icon: '⚖️',
        unlocked: weights.length > 0,
      },
      {
        id: '4',
        title: 'Primeira Análise de Calorias',
        description: 'Analisou suas primeiras calorias',
        icon: '🔥',
        unlocked: calories.length > 0,
      },
      {
        id: '5',
        title: 'Consistente',
        description: 'Registrou peso por 7 dias seguidos',
        icon: '💪',
        unlocked: weights.length >= 7,
      },
      {
        id: '6',
        title: 'Nutricionista Digital',
        description: 'Analisou 10 refeições',
        icon: '🍽️',
        unlocked: calories.length >= 10,
      },
      {
        id: '7',
        title: 'Dedicado',
        description: 'Registrou peso por 30 dias',
        icon: '🏆',
        unlocked: weights.length >= 30,
      },
      {
        id: '8',
        title: 'Meta Alcançada',
        description: 'Atingiu seu objetivo de peso',
        icon: '👑',
        unlocked: false,
      },
    ];

    setAchievements(achievementsList);
  };

  const handleAddWeight = async () => {
    if (!user || !newWeight) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        router.push('/app');
        return;
      }

      const response = await fetch('/api/weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          weight: parseFloat(newWeight),
          note: newWeightNote || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.sqlNeeded) {
          console.error('❌ Tabela não existe. SQL necessário:');
          console.error(result.sqlNeeded);
          alert(`Erro: ${result.error}\n\nVeja o console do navegador para o SQL necessário.`);
        } else {
          alert(`Erro: ${result.error}\n${result.details || result.message || ''}`);
        }
        return;
      }

      setNewWeight('');
      setNewWeightNote('');
      setShowWeightModal(false);
      loadData(user.id);
      alert('Peso registrado com sucesso!');
    } catch (error: any) {
      console.error('💥 Erro ao adicionar peso:', error);
      alert(`Erro ao salvar peso: ${error.message}`);
    }
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
      loadData(user.id);
      alert('Meta definida com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      alert('Erro ao salvar meta. Verifique se as tabelas do banco estão configuradas.');
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeCalories = async () => {
    if (!user || !photoFile || !photoPreview) return;

    setAnalyzingPhoto(true);
    setCalorieResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        router.push('/app');
        return;
      }

      // Enviar imagem para análise
      const response = await fetch('/api/analyze-calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          image: photoPreview
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao analisar imagem');
      }

      setCalorieResult({
        calories: result.calories,
        foodName: result.foodName,
        confidence: result.confidence
      });

      // Salvar no banco de dados
      const { error: dbError } = await supabase
        .from('calorie_entries')
        .insert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            image_url: photoPreview,
            calories: result.calories,
            food_name: result.foodName,
          },
        ]);

      if (dbError) {
        console.error('Erro ao salvar no banco:', dbError);
      }

      loadData(user.id);
    } catch (error: any) {
      console.error('Erro ao analisar calorias:', error);
      alert(`Erro ao analisar imagem: ${error.message}`);
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/app');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando seu aplicativo...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecionando para login...</div>
      </div>
    );
  }

  const currentWeight = weightEntries[0]?.weight || 0;
  const startWeight = weightEntries[weightEntries.length - 1]?.weight || currentWeight;
  const weightLost = startWeight - currentWeight;
  const daysActive = userData?.created_at 
    ? Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const workoutsCompleted = Math.floor(daysActive * 0.8);
  const totalCalories = calorieEntries.reduce((sum, entry) => sum + entry.calories, 0);

  const chartData = weightEntries
    .slice(0, 30)
    .reverse()
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: entry.weight,
    }));

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
                <p className="text-xs text-gray-400">Premium</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/meushapenovo/configuracoes')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={handleSignOut} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
            Olá, {userData?.name || 'Usuário'}! 👋
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
                {weightLost > 0 ? `-${weightLost.toFixed(1)}kg` : weightLost < 0 ? `+${Math.abs(weightLost).toFixed(1)}kg` : '0kg'}
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
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-400">
                {totalCalories}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Calorias Analisadas</h3>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weight Progress */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Progresso de Peso</h3>
              <button 
                onClick={() => setShowWeightModal(true)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            
            <div className="space-y-4">
              {weightEntries.length > 0 ? (
                <>
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
                  
                  {goal && (
                    <div className="pt-4">
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, Math.max(0, ((startWeight - currentWeight) / (startWeight - goal.target_weight) * 100)))}%` 
                          }}
                        />
                      </div>
                      <p className="text-center text-sm text-gray-400 mt-2">
                        {Math.min(100, Math.max(0, ((startWeight - currentWeight) / (startWeight - goal.target_weight) * 100))).toFixed(0)}% da meta alcançada
                      </p>
                    </div>
                  )}

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
                </>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Comece registrando seu peso atual
                  </p>
                  <button 
                    onClick={() => setShowWeightModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Registrar Primeiro Peso
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowWeightModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Registrar Peso
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setShowCalorieModal(true)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-3">
                  <Camera className="w-5 h-5" />
                  Analisar Calorias
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => router.push('/meushapenovo/treinos')}
                className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5" />
                  Ver Treinos
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => router.push('/meushapenovo/plano-alimentar')}
                className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-between group"
              >
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
            onClick={() => setShowCalorieModal(true)}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Análise de Calorias</h3>
            <p className="text-gray-400 text-sm">
              Tire uma foto do seu prato e descubra quantas calorias tem.
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

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
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

        {/* Histórico de Análises de Calorias */}
        {calorieEntries.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Histórico de Análises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calorieEntries.slice(0, 6).map((entry) => (
                <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{entry.food_name}</h4>
                      <p className="text-2xl font-bold text-orange-400 mb-1">{entry.calories} kcal</p>
                      <p className="text-xs text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Registrar Peso */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Registrar Peso</h3>
              <button 
                onClick={() => setShowWeightModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="75.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Observação (opcional)
                </label>
                <textarea
                  value={newWeightNote}
                  onChange={(e) => setNewWeightNote(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Como você está se sentindo?"
                  rows={3}
                />
              </div>

              <button
                onClick={handleAddWeight}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Salvar Peso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Analisar Calorias */}
      {showCalorieModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Analisar Calorias</h3>
              <button 
                onClick={() => {
                  setShowCalorieModal(false);
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setCalorieResult(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {!photoPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                  <Camera className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-400 mb-2">Tire uma foto do seu prato</p>
                  <p className="text-sm text-gray-500">ou selecione uma imagem</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  {!calorieResult && !analyzingPhoto && (
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {analyzingPhoto && (
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4 flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  <div>
                    <p className="text-blue-400 font-semibold">Analisando imagem...</p>
                    <p className="text-sm text-gray-400">Isso pode levar alguns segundos</p>
                  </div>
                </div>
              )}

              {calorieResult && (
                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                      <Flame className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">{calorieResult.calories} kcal</h4>
                      <p className="text-orange-300">{calorieResult.foodName}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      Confiança: <span className="font-semibold text-white">{(calorieResult.confidence * 100).toFixed(0)}%</span>
                    </p>
                  </div>
                </div>
              )}

              {photoPreview && !calorieResult && !analyzingPhoto && (
                <button
                  onClick={handleAnalyzeCalories}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Flame className="w-5 h-5" />
                  Analisar Calorias
                </button>
              )}

              {calorieResult && (
                <button
                  onClick={() => {
                    setShowCalorieModal(false);
                    setPhotoFile(null);
                    setPhotoPreview(null);
                    setCalorieResult(null);
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  Concluir
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

              {currentWeight > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-400 text-sm">
                    Seu peso atual: <strong>{currentWeight.toFixed(1)}kg</strong>
                  </p>
                </div>
              )}

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
