'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Home, MapPin, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    rest: string;
  }[];
}

const workoutPlans = {
  academia: {
    iniciante: [
      {
        id: 'gym-beginner-1',
        name: 'Treino A - Peito e Tríceps',
        exercises: [
          { name: 'Supino Reto', sets: '3', reps: '12', rest: '60s' },
          { name: 'Supino Inclinado', sets: '3', reps: '12', rest: '60s' },
          { name: 'Crucifixo', sets: '3', reps: '15', rest: '45s' },
          { name: 'Tríceps Pulley', sets: '3', reps: '12', rest: '45s' },
          { name: 'Tríceps Testa', sets: '3', reps: '12', rest: '45s' },
        ],
      },
      {
        id: 'gym-beginner-2',
        name: 'Treino B - Costas e Bíceps',
        exercises: [
          { name: 'Puxada Frontal', sets: '3', reps: '12', rest: '60s' },
          { name: 'Remada Curvada', sets: '3', reps: '12', rest: '60s' },
          { name: 'Remada Cavalinho', sets: '3', reps: '12', rest: '45s' },
          { name: 'Rosca Direta', sets: '3', reps: '12', rest: '45s' },
          { name: 'Rosca Martelo', sets: '3', reps: '12', rest: '45s' },
        ],
      },
      {
        id: 'gym-beginner-3',
        name: 'Treino C - Pernas e Ombros',
        exercises: [
          { name: 'Agachamento Livre', sets: '4', reps: '12', rest: '90s' },
          { name: 'Leg Press', sets: '3', reps: '15', rest: '60s' },
          { name: 'Cadeira Extensora', sets: '3', reps: '15', rest: '45s' },
          { name: 'Desenvolvimento', sets: '3', reps: '12', rest: '60s' },
          { name: 'Elevação Lateral', sets: '3', reps: '15', rest: '45s' },
        ],
      },
    ],
    intermediario: [
      {
        id: 'gym-inter-1',
        name: 'Treino A - Peito',
        exercises: [
          { name: 'Supino Reto', sets: '4', reps: '10', rest: '90s' },
          { name: 'Supino Inclinado', sets: '4', reps: '10', rest: '90s' },
          { name: 'Crucifixo Inclinado', sets: '3', reps: '12', rest: '60s' },
          { name: 'Crossover', sets: '3', reps: '15', rest: '60s' },
          { name: 'Flexão Declinada', sets: '3', reps: 'Máx', rest: '60s' },
        ],
      },
      {
        id: 'gym-inter-2',
        name: 'Treino B - Costas',
        exercises: [
          { name: 'Barra Fixa', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Remada Curvada', sets: '4', reps: '10', rest: '90s' },
          { name: 'Puxada Frontal', sets: '3', reps: '12', rest: '60s' },
          { name: 'Remada Unilateral', sets: '3', reps: '12', rest: '60s' },
          { name: 'Pullover', sets: '3', reps: '15', rest: '60s' },
        ],
      },
      {
        id: 'gym-inter-3',
        name: 'Treino C - Pernas',
        exercises: [
          { name: 'Agachamento Livre', sets: '5', reps: '8-10', rest: '120s' },
          { name: 'Leg Press 45°', sets: '4', reps: '12', rest: '90s' },
          { name: 'Stiff', sets: '4', reps: '10', rest: '90s' },
          { name: 'Cadeira Extensora', sets: '3', reps: '15', rest: '60s' },
          { name: 'Cadeira Flexora', sets: '3', reps: '15', rest: '60s' },
        ],
      },
      {
        id: 'gym-inter-4',
        name: 'Treino D - Ombros e Trapézio',
        exercises: [
          { name: 'Desenvolvimento', sets: '4', reps: '10', rest: '90s' },
          { name: 'Elevação Lateral', sets: '4', reps: '12', rest: '60s' },
          { name: 'Elevação Frontal', sets: '3', reps: '12', rest: '60s' },
          { name: 'Crucifixo Inverso', sets: '3', reps: '15', rest: '60s' },
          { name: 'Encolhimento', sets: '4', reps: '12', rest: '60s' },
        ],
      },
      {
        id: 'gym-inter-5',
        name: 'Treino E - Braços',
        exercises: [
          { name: 'Rosca Direta', sets: '4', reps: '10', rest: '60s' },
          { name: 'Rosca Alternada', sets: '3', reps: '12', rest: '60s' },
          { name: 'Rosca Scott', sets: '3', reps: '12', rest: '60s' },
          { name: 'Tríceps Testa', sets: '4', reps: '10', rest: '60s' },
          { name: 'Tríceps Corda', sets: '3', reps: '12', rest: '60s' },
          { name: 'Mergulho', sets: '3', reps: 'Máx', rest: '60s' },
        ],
      },
    ],
    avancado: [
      {
        id: 'gym-adv-1',
        name: 'Treino A - Peito e Tríceps',
        exercises: [
          { name: 'Supino Reto', sets: '5', reps: '6-8', rest: '120s' },
          { name: 'Supino Inclinado', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Supino Declinado', sets: '4', reps: '10', rest: '90s' },
          { name: 'Crucifixo Inclinado', sets: '3', reps: '12', rest: '60s' },
          { name: 'Crossover', sets: '3', reps: '15', rest: '60s' },
          { name: 'Tríceps Testa', sets: '4', reps: '10', rest: '60s' },
          { name: 'Tríceps Corda', sets: '4', reps: '12', rest: '60s' },
        ],
      },
      {
        id: 'gym-adv-2',
        name: 'Treino B - Costas e Bíceps',
        exercises: [
          { name: 'Barra Fixa (Peso)', sets: '5', reps: '6-8', rest: '120s' },
          { name: 'Remada Curvada', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Puxada Frontal', sets: '4', reps: '10', rest: '90s' },
          { name: 'Remada Unilateral', sets: '3', reps: '12', rest: '60s' },
          { name: 'Pullover', sets: '3', reps: '15', rest: '60s' },
          { name: 'Rosca Direta', sets: '4', reps: '10', rest: '60s' },
          { name: 'Rosca Scott', sets: '4', reps: '12', rest: '60s' },
        ],
      },
      {
        id: 'gym-adv-3',
        name: 'Treino C - Pernas (Quadríceps)',
        exercises: [
          { name: 'Agachamento Livre', sets: '6', reps: '6-8', rest: '150s' },
          { name: 'Leg Press 45°', sets: '5', reps: '10', rest: '120s' },
          { name: 'Hack Machine', sets: '4', reps: '12', rest: '90s' },
          { name: 'Cadeira Extensora', sets: '4', reps: '15', rest: '60s' },
          { name: 'Afundo', sets: '3', reps: '12', rest: '60s' },
        ],
      },
      {
        id: 'gym-adv-4',
        name: 'Treino D - Ombros',
        exercises: [
          { name: 'Desenvolvimento', sets: '5', reps: '8-10', rest: '120s' },
          { name: 'Desenvolvimento Arnold', sets: '4', reps: '10', rest: '90s' },
          { name: 'Elevação Lateral', sets: '4', reps: '12', rest: '60s' },
          { name: 'Elevação Frontal', sets: '4', reps: '12', rest: '60s' },
          { name: 'Crucifixo Inverso', sets: '4', reps: '15', rest: '60s' },
          { name: 'Encolhimento', sets: '4', reps: '12', rest: '60s' },
        ],
      },
      {
        id: 'gym-adv-5',
        name: 'Treino E - Pernas (Posterior)',
        exercises: [
          { name: 'Stiff', sets: '5', reps: '8-10', rest: '120s' },
          { name: 'Cadeira Flexora', sets: '4', reps: '12', rest: '90s' },
          { name: 'Mesa Flexora', sets: '4', reps: '12', rest: '90s' },
          { name: 'Levantamento Terra', sets: '4', reps: '8', rest: '120s' },
          { name: 'Panturrilha em Pé', sets: '5', reps: '15', rest: '60s' },
        ],
      },
    ],
  },
  rua: {
    iniciante: [
      {
        id: 'street-beginner-1',
        name: 'Treino A - Superior',
        exercises: [
          { name: 'Flexão de Braço', sets: '3', reps: '10-15', rest: '60s' },
          { name: 'Flexão Inclinada', sets: '3', reps: '10-15', rest: '60s' },
          { name: 'Mergulho em Banco', sets: '3', reps: '10', rest: '60s' },
          { name: 'Prancha', sets: '3', reps: '30s', rest: '45s' },
        ],
      },
      {
        id: 'street-beginner-2',
        name: 'Treino B - Inferior',
        exercises: [
          { name: 'Agachamento Livre', sets: '4', reps: '15', rest: '60s' },
          { name: 'Afundo', sets: '3', reps: '12/perna', rest: '60s' },
          { name: 'Elevação de Panturrilha', sets: '3', reps: '20', rest: '45s' },
          { name: 'Ponte Glúteo', sets: '3', reps: '15', rest: '45s' },
        ],
      },
      {
        id: 'street-beginner-3',
        name: 'Treino C - Core',
        exercises: [
          { name: 'Prancha Frontal', sets: '3', reps: '30-45s', rest: '60s' },
          { name: 'Prancha Lateral', sets: '3', reps: '20s/lado', rest: '45s' },
          { name: 'Mountain Climbers', sets: '3', reps: '20', rest: '45s' },
          { name: 'Bicicleta no Ar', sets: '3', reps: '20', rest: '45s' },
        ],
      },
    ],
    intermediario: [
      {
        id: 'street-inter-1',
        name: 'Treino A - Push',
        exercises: [
          { name: 'Flexão Diamante', sets: '4', reps: '12-15', rest: '60s' },
          { name: 'Flexão Declinada', sets: '4', reps: '10-12', rest: '60s' },
          { name: 'Pike Push-up', sets: '3', reps: '10', rest: '60s' },
          { name: 'Mergulho em Paralelas', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Prancha com Toque', sets: '3', reps: '20', rest: '45s' },
        ],
      },
      {
        id: 'street-inter-2',
        name: 'Treino B - Pull',
        exercises: [
          { name: 'Barra Fixa Pronada', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Barra Fixa Supinada', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Remada Australiana', sets: '4', reps: '12', rest: '60s' },
          { name: 'Prancha Superman', sets: '3', reps: '10', rest: '45s' },
        ],
      },
      {
        id: 'street-inter-3',
        name: 'Treino C - Legs',
        exercises: [
          { name: 'Pistol Squat', sets: '4', reps: '8/perna', rest: '90s' },
          { name: 'Afundo Búlgaro', sets: '4', reps: '12/perna', rest: '60s' },
          { name: 'Agachamento Jump', sets: '3', reps: '15', rest: '60s' },
          { name: 'Nordic Curl', sets: '3', reps: '6-8', rest: '90s' },
          { name: 'Panturrilha Unilateral', sets: '3', reps: '15/perna', rest: '45s' },
        ],
      },
    ],
    avancado: [
      {
        id: 'street-adv-1',
        name: 'Treino A - Push Avançado',
        exercises: [
          { name: 'Flexão Arqueira', sets: '4', reps: '8/lado', rest: '90s' },
          { name: 'Pseudo Planche Push-up', sets: '4', reps: '10', rest: '90s' },
          { name: 'Handstand Push-up', sets: '4', reps: '6-8', rest: '120s' },
          { name: 'Flexão Explosiva', sets: '3', reps: '10', rest: '90s' },
          { name: 'L-Sit', sets: '3', reps: '20-30s', rest: '60s' },
        ],
      },
      {
        id: 'street-adv-2',
        name: 'Treino B - Pull Avançado',
        exercises: [
          { name: 'Muscle Up', sets: '5', reps: '5-8', rest: '120s' },
          { name: 'Barra Fixa (Peso)', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Front Lever Progressão', sets: '4', reps: '10s', rest: '90s' },
          { name: 'Barra Fixa Explosiva', sets: '3', reps: '8', rest: '90s' },
          { name: 'Skin the Cat', sets: '3', reps: '6', rest: '60s' },
        ],
      },
      {
        id: 'street-adv-3',
        name: 'Treino C - Legs Avançado',
        exercises: [
          { name: 'Pistol Squat (Peso)', sets: '5', reps: '8/perna', rest: '120s' },
          { name: 'Shrimp Squat', sets: '4', reps: '10/perna', rest: '90s' },
          { name: 'Box Jump Alto', sets: '4', reps: '10', rest: '90s' },
          { name: 'Nordic Curl Completo', sets: '4', reps: '8-10', rest: '120s' },
          { name: 'Sissy Squat', sets: '3', reps: '12', rest: '60s' },
        ],
      },
    ],
  },
  casa: {
    iniciante: [
      {
        id: 'home-beginner-1',
        name: 'Treino A - Corpo Todo',
        exercises: [
          { name: 'Agachamento', sets: '3', reps: '15', rest: '60s' },
          { name: 'Flexão (Joelhos)', sets: '3', reps: '10', rest: '60s' },
          { name: 'Prancha', sets: '3', reps: '20-30s', rest: '45s' },
          { name: 'Polichinelo', sets: '3', reps: '20', rest: '45s' },
          { name: 'Abdominal', sets: '3', reps: '15', rest: '45s' },
        ],
      },
      {
        id: 'home-beginner-2',
        name: 'Treino B - Cardio e Core',
        exercises: [
          { name: 'Burpee', sets: '3', reps: '10', rest: '60s' },
          { name: 'Mountain Climbers', sets: '3', reps: '20', rest: '45s' },
          { name: 'Prancha Lateral', sets: '3', reps: '15s/lado', rest: '45s' },
          { name: 'High Knees', sets: '3', reps: '30s', rest: '45s' },
          { name: 'Russian Twist', sets: '3', reps: '20', rest: '45s' },
        ],
      },
    ],
    intermediario: [
      {
        id: 'home-inter-1',
        name: 'Treino A - Superior',
        exercises: [
          { name: 'Flexão Normal', sets: '4', reps: '15', rest: '60s' },
          { name: 'Flexão Diamante', sets: '3', reps: '12', rest: '60s' },
          { name: 'Mergulho em Cadeira', sets: '3', reps: '12', rest: '60s' },
          { name: 'Prancha com Rotação', sets: '3', reps: '10/lado', rest: '45s' },
          { name: 'Superman', sets: '3', reps: '15', rest: '45s' },
        ],
      },
      {
        id: 'home-inter-2',
        name: 'Treino B - Inferior',
        exercises: [
          { name: 'Agachamento Jump', sets: '4', reps: '15', rest: '60s' },
          { name: 'Afundo Alternado', sets: '4', reps: '12/perna', rest: '60s' },
          { name: 'Ponte Glúteo', sets: '4', reps: '15', rest: '45s' },
          { name: 'Panturrilha', sets: '3', reps: '20', rest: '45s' },
          { name: 'Wall Sit', sets: '3', reps: '30-45s', rest: '60s' },
        ],
      },
      {
        id: 'home-inter-3',
        name: 'Treino C - HIIT',
        exercises: [
          { name: 'Burpee', sets: '4', reps: '15', rest: '60s' },
          { name: 'Mountain Climbers', sets: '4', reps: '30', rest: '45s' },
          { name: 'Jump Squat', sets: '4', reps: '15', rest: '60s' },
          { name: 'Prancha Dinâmica', sets: '3', reps: '20', rest: '45s' },
          { name: 'High Knees', sets: '3', reps: '45s', rest: '45s' },
        ],
      },
    ],
    avancado: [
      {
        id: 'home-adv-1',
        name: 'Treino A - Push Intenso',
        exercises: [
          { name: 'Flexão Arqueira', sets: '4', reps: '10/lado', rest: '90s' },
          { name: 'Flexão Explosiva', sets: '4', reps: '12', rest: '90s' },
          { name: 'Pike Push-up', sets: '4', reps: '12', rest: '60s' },
          { name: 'Mergulho Búlgaro', sets: '4', reps: '15', rest: '60s' },
          { name: 'Prancha com Peso', sets: '3', reps: '45-60s', rest: '60s' },
        ],
      },
      {
        id: 'home-adv-2',
        name: 'Treino B - Legs Intenso',
        exercises: [
          { name: 'Pistol Squat', sets: '5', reps: '8/perna', rest: '120s' },
          { name: 'Afundo Búlgaro', sets: '4', reps: '12/perna', rest: '90s' },
          { name: 'Jump Squat', sets: '4', reps: '20', rest: '60s' },
          { name: 'Nordic Curl', sets: '4', reps: '8', rest: '90s' },
          { name: 'Panturrilha Unilateral', sets: '4', reps: '20/perna', rest: '45s' },
        ],
      },
      {
        id: 'home-adv-3',
        name: 'Treino C - HIIT Extremo',
        exercises: [
          { name: 'Burpee com Flexão', sets: '5', reps: '15', rest: '60s' },
          { name: 'Mountain Climbers', sets: '4', reps: '40', rest: '45s' },
          { name: 'Jump Lunge', sets: '4', reps: '20', rest: '60s' },
          { name: 'Prancha com Salto', sets: '4', reps: '15', rest: '60s' },
          { name: 'Tuck Jump', sets: '4', reps: '15', rest: '60s' },
        ],
      },
    ],
  },
};

export default function TreinosPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<'academia' | 'rua' | 'casa'>('academia');
  const [selectedLevel, setSelectedLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const currentWorkouts = workoutPlans[selectedLocation][selectedLevel];

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
            <h1 className="text-xl font-bold text-white">Treinos</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seleção de Local */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Onde você vai treinar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedLocation('academia')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedLocation === 'academia'
                  ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Dumbbell className={`w-12 h-12 mx-auto mb-3 ${
                selectedLocation === 'academia' ? 'text-purple-400' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-bold text-white mb-1">Academia</h3>
              <p className="text-sm text-gray-400">Treinos com equipamentos</p>
            </button>

            <button
              onClick={() => setSelectedLocation('rua')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedLocation === 'rua'
                  ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <MapPin className={`w-12 h-12 mx-auto mb-3 ${
                selectedLocation === 'rua' ? 'text-purple-400' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-bold text-white mb-1">Rua</h3>
              <p className="text-sm text-gray-400">Calistenia e barras</p>
            </button>

            <button
              onClick={() => setSelectedLocation('casa')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedLocation === 'casa'
                  ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Home className={`w-12 h-12 mx-auto mb-3 ${
                selectedLocation === 'casa' ? 'text-purple-400' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-bold text-white mb-1">Casa</h3>
              <p className="text-sm text-gray-400">Sem equipamentos</p>
            </button>
          </div>
        </div>

        {/* Seleção de Nível */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Qual seu nível?</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedLevel('iniciante')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedLevel === 'iniciante'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Iniciante
            </button>
            <button
              onClick={() => setSelectedLevel('intermediario')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedLevel === 'intermediario'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Intermediário
            </button>
            <button
              onClick={() => setSelectedLevel('avancado')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedLevel === 'avancado'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Avançado
            </button>
          </div>
        </div>

        {/* Lista de Treinos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Seus Treinos</h2>
          {currentWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{workout.name}</h3>
                <button
                  onClick={() => setSelectedWorkout(workout)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Iniciar
                </button>
              </div>

              <div className="space-y-3">
                {workout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{exercise.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{exercise.sets} séries</span>
                      <span>{exercise.reps} reps</span>
                      <span>{exercise.rest} descanso</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Treino */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedWorkout.name}</h3>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="text-gray-400 hover:text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedWorkout.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">{exercise.name}</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Séries</p>
                          <p className="text-white font-semibold">{exercise.sets}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Repetições</p>
                          <p className="text-white font-semibold">{exercise.reps}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Descanso</p>
                          <p className="text-white font-semibold">{exercise.rest}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedWorkout(null)}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Concluir Treino
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
