'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Camera, 
  Dumbbell, 
  Apple, 
  Target,
  Calendar,
  Award,
  User,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  Activity
} from 'lucide-react';

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dados de exemplo do usuário
  const userData = {
    name: 'João Silva',
    plan: 'Premium Completo',
    currentWeight: 85.5,
    goalWeight: 75.0,
    startWeight: 92.0,
    joinDate: '15/10/2024'
  };

  const progressData = {
    weightLost: userData.startWeight - userData.currentWeight,
    daysActive: 35,
    workoutsCompleted: 28,
    photosUploaded: 12
  };

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
                <p className="text-xs text-gray-400">{userData.plan}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                -{progressData.weightLost.toFixed(1)}kg
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
                {progressData.daysActive}
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
                {progressData.workoutsCompleted}
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
                {progressData.photosUploaded}
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
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">
                Ver Detalhes
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Peso Inicial</span>
                <span className="text-white font-bold">{userData.startWeight}kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Peso Atual</span>
                <span className="text-green-400 font-bold">{userData.currentWeight}kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Meta</span>
                <span className="text-purple-400 font-bold">{userData.goalWeight}kg</span>
              </div>
              
              {/* Progress Bar */}
              <div className="pt-4">
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((userData.startWeight - userData.currentWeight) / (userData.startWeight - userData.goalWeight) * 100).toFixed(0)}%` 
                    }}
                  />
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">
                  {((userData.startWeight - userData.currentWeight) / (userData.startWeight - userData.goalWeight) * 100).toFixed(0)}% da meta alcançada
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Registrar Peso
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <Camera className="w-5 h-5" />
                  Adicionar Foto
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gráficos de Evolução</h3>
            <p className="text-gray-400 text-sm">
              Acompanhe seu progresso com gráficos detalhados de peso, medidas e composição corporal.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Metas Personalizadas</h3>
            <p className="text-gray-400 text-sm">
              Defina e acompanhe suas metas de peso, medidas e objetivos específicos.
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

        {/* Coming Soon Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            🚀 Funcionalidades Completas em Breve!
          </h3>
          <p className="text-white/90 mb-4">
            Estamos finalizando todas as funcionalidades do aplicativo para você ter a melhor experiência possível.
          </p>
          <p className="text-white/80 text-sm">
            Em breve: Registro completo de medidas, fotos de evolução, treinos personalizados, planos alimentares e muito mais!
          </p>
        </div>
      </div>
    </div>
  );
}
