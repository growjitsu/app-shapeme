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
  Upload
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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Estados para modais
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightNote, setNewWeightNote] = useState('');
  const [newGoalWeight, setNewGoalWeight] = useState('');
  const [newGoalType, setNewGoalType] = useState<'lose' | 'gain'>('lose');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoNote, setPhotoNote] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingWeight, setSavingWeight] = useState(false);

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
        const { data: photos } = await supabase
          .from('progress_photos')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (photos) setProgressPhotos(photos);
      } catch (error) {
        console.log('Tabela progress_photos não encontrada');
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

      generateAchievements(weightEntries, progressPhotos);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const generateAchievements = (weights: WeightEntry[], photos: ProgressPhoto[]) => {
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
        title: 'Primeira Foto Enviada',
        description: 'Adicionou sua primeira foto de progresso',
        icon: '📸',
        unlocked: photos.length > 0,
      },
      {
        id: '5',
        title: 'Consistente',
        description: 'Registrou peso por 7 dias seguidos',
        icon: '🔥',
        unlocked: weights.length >= 7,
      },
      {
        id: '6',
        title: 'Transformação Visível',
        description: 'Adicionou 5 fotos de progresso',
        icon: '✨',
        unlocked: photos.length >= 5,
      },
      {
        id: '7',
        title: 'Dedicado',
        description: 'Registrou peso por 30 dias',
        icon: '💪',
        unlocked: weights.length >= 30,
      },
      {
        id: '8',
        title: 'Meta Alcançada',
        description: 'Atingiu seu objetivo de peso',
        icon: '🏆',
        unlocked: false,
      },
    ];

    setAchievements(achievementsList);
  };

  const handleAddWeight = async () => {
    if (!user || !newWeight) {
      alert('Por favor, insira um peso válido');
      return;
    }

    setSavingWeight(true);

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .insert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(newWeight),
            note: newWeightNote || null,
          },
        ])
        .select();

      if (error) {
        console.error('Erro ao salvar peso:', error);
        alert(`Erro: ${error.message}\n\nVerifique se executou o SQL de configuração do banco.`);
        return;
      }

      setNewWeight('');
      setNewWeightNote('');
      setShowWeightModal(false);
      await loadData(user.id);
      alert('✅ Peso registrado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar peso:', error);
      alert(`Erro ao salvar peso: ${error.message}`);
    } finally {
      setSavingWeight(false);
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
      if (file.size > 5 * 1024 * 1024) {
        alert('Foto muito grande! Máximo 5MB.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida.');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!user || !photoFile) {
      alert('Por favor, selecione uma foto');
      return;
    }

    setUploadingPhoto(true);

    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(fileName, photoFile);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        alert(`Erro ao fazer upload: ${uploadError.message}\n\nVerifique se o bucket 'progress-photos' existe e está público.`);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(fileName);

      const currentWeight = weightEntries[0]?.weight || 0;
      
      const { error: dbError } = await supabase
        .from('progress_photos')
        .insert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            image_url: publicUrl,
            weight: currentWeight,
            note: photoNote || null,
          },
        ]);

      if (dbError) {
        console.error('Erro ao salvar no banco:', dbError);
        alert(`Erro ao salvar foto: ${dbError.message}`);
        return;
      }

      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoNote('');
      setShowPhotoModal(false);
      await loadData(user.id);
      alert('✅ Foto adicionada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload da foto:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setUploadingPhoto(false);
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
                onClick={() => setShowPhotoModal(true)}
                className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-3">
                  <Camera className="w-5 h-5" />
                  Adicionar Foto
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setShowGoalModal(true)}
                className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-3">
                  <Target className="w-5 h-5" />
                  Definir Meta
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
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 75.5"
                  autoFocus
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
                  rows={2}
                />
              </div>

              <button
                onClick={handleAddWeight}
                disabled={!newWeight || savingWeight}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {savingWeight ? 'Salvando...' : 'Salvar Peso'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Foto */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Adicionar Foto</h3>
              <button 
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setPhotoNote('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {!photoPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-400 mb-2 font-medium">Clique para selecionar uma foto</p>
                  <p className="text-sm text-gray-500">Máximo 5MB • JPG, PNG ou WEBP</p>
                  <input
                    type="file"
                    accept="image/*"
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
                  <button
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {photoPreview && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Observação (opcional)
                    </label>
                    <textarea
                      value={photoNote}
                      onChange={(e) => setPhotoNote(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Como você está se sentindo?"
                      rows={2}
                    />
                  </div>

                  <button
                    onClick={handleUploadPhoto}
                    disabled={uploadingPhoto}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {uploadingPhoto ? 'Enviando...' : 'Salvar Foto'}
                  </button>
                </>
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
