'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Apple, Coffee, Sun, Sunset, Moon, ChevronDown, ChevronUp } from 'lucide-react';

interface Meal {
  name: string;
  time: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MealPlan {
  [key: string]: Meal[];
}

const mealPlans: { [key: string]: MealPlan } = {
  'perder-peso': {
    'cafe-manha': [
      {
        name: 'Café da Manhã',
        time: '07:00 - 08:00',
        foods: [
          '2 ovos mexidos',
          '2 fatias de pão integral',
          '1 banana',
          'Café sem açúcar',
        ],
        calories: 350,
        protein: 20,
        carbs: 45,
        fats: 10,
      },
    ],
    'almoco': [
      {
        name: 'Almoço',
        time: '12:00 - 13:00',
        foods: [
          '150g de frango grelhado',
          '4 colheres de arroz integral',
          'Salada verde à vontade',
          '2 colheres de feijão',
          '1 colher de azeite',
        ],
        calories: 450,
        protein: 40,
        carbs: 50,
        fats: 12,
      },
    ],
    'lanche-tarde': [
      {
        name: 'Lanche da Tarde',
        time: '15:00 - 16:00',
        foods: [
          '1 iogurte natural',
          '1 porção de frutas vermelhas',
          '10 amêndoas',
        ],
        calories: 200,
        protein: 10,
        carbs: 20,
        fats: 8,
      },
    ],
    'jantar': [
      {
        name: 'Jantar',
        time: '19:00 - 20:00',
        foods: [
          '150g de peixe grelhado',
          'Legumes assados',
          'Salada verde',
          '2 colheres de quinoa',
        ],
        calories: 400,
        protein: 35,
        carbs: 40,
        fats: 10,
      },
    ],
  },
  'ganhar-massa': {
    'cafe-manha': [
      {
        name: 'Café da Manhã',
        time: '07:00 - 08:00',
        foods: [
          '4 ovos mexidos',
          '3 fatias de pão integral',
          '1 banana',
          '1 copo de leite',
          '2 colheres de pasta de amendoim',
        ],
        calories: 600,
        protein: 35,
        carbs: 65,
        fats: 20,
      },
    ],
    'almoco': [
      {
        name: 'Almoço',
        time: '12:00 - 13:00',
        foods: [
          '200g de carne vermelha magra',
          '6 colheres de arroz integral',
          'Salada verde',
          '3 colheres de feijão',
          '1 batata doce média',
        ],
        calories: 700,
        protein: 50,
        carbs: 80,
        fats: 18,
      },
    ],
    'lanche-tarde': [
      {
        name: 'Lanche da Tarde',
        time: '15:00 - 16:00',
        foods: [
          '1 shake de whey protein',
          '1 banana',
          '2 colheres de aveia',
          '1 colher de pasta de amendoim',
        ],
        calories: 400,
        protein: 30,
        carbs: 45,
        fats: 12,
      },
    ],
    'jantar': [
      {
        name: 'Jantar',
        time: '19:00 - 20:00',
        foods: [
          '200g de frango',
          '1 batata doce grande',
          'Legumes no vapor',
          'Salada verde',
          '1 colher de azeite',
        ],
        calories: 550,
        protein: 45,
        carbs: 60,
        fats: 15,
      },
    ],
  },
  'manter': {
    'cafe-manha': [
      {
        name: 'Café da Manhã',
        time: '07:00 - 08:00',
        foods: [
          '3 ovos mexidos',
          '2 fatias de pão integral',
          '1 fruta',
          'Café com leite',
        ],
        calories: 450,
        protein: 25,
        carbs: 50,
        fats: 15,
      },
    ],
    'almoco': [
      {
        name: 'Almoço',
        time: '12:00 - 13:00',
        foods: [
          '180g de proteína (frango/peixe/carne)',
          '5 colheres de arroz integral',
          'Salada variada',
          '2 colheres de feijão',
          'Legumes',
        ],
        calories: 550,
        protein: 45,
        carbs: 60,
        fats: 15,
      },
    ],
    'lanche-tarde': [
      {
        name: 'Lanche da Tarde',
        time: '15:00 - 16:00',
        foods: [
          '1 iogurte grego',
          '1 porção de frutas',
          '1 punhado de castanhas',
        ],
        calories: 250,
        protein: 15,
        carbs: 25,
        fats: 10,
      },
    ],
    'jantar': [
      {
        name: 'Jantar',
        time: '19:00 - 20:00',
        foods: [
          '180g de proteína magra',
          'Salada completa',
          'Legumes variados',
          '3 colheres de arroz integral',
        ],
        calories: 500,
        protein: 40,
        carbs: 50,
        fats: 12,
      },
    ],
  },
};

export default function PlanoAlimentarPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<'perder-peso' | 'ganhar-massa' | 'manter'>('perder-peso');
  const [expandedMeal, setExpandedMeal] = useState<string | null>('cafe-manha');

  const currentPlan = mealPlans[selectedGoal];
  const totalCalories = Object.values(currentPlan).reduce(
    (sum, meals) => sum + meals.reduce((mealSum, meal) => mealSum + meal.calories, 0),
    0
  );
  const totalProtein = Object.values(currentPlan).reduce(
    (sum, meals) => sum + meals.reduce((mealSum, meal) => mealSum + meal.protein, 0),
    0
  );
  const totalCarbs = Object.values(currentPlan).reduce(
    (sum, meals) => sum + meals.reduce((mealSum, meal) => mealSum + meal.carbs, 0),
    0
  );
  const totalFats = Object.values(currentPlan).reduce(
    (sum, meals) => sum + meals.reduce((mealSum, meal) => mealSum + meal.fats, 0),
    0
  );

  const getMealIcon = (mealKey: string) => {
    switch (mealKey) {
      case 'cafe-manha':
        return <Coffee className="w-6 h-6" />;
      case 'almoco':
        return <Sun className="w-6 h-6" />;
      case 'lanche-tarde':
        return <Sunset className="w-6 h-6" />;
      case 'jantar':
        return <Moon className="w-6 h-6" />;
      default:
        return <Apple className="w-6 h-6" />;
    }
  };

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
            <h1 className="text-xl font-bold text-white">Plano Alimentar</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seleção de Objetivo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Qual seu objetivo?</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedGoal('perder-peso')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedGoal === 'perder-peso'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Perder Peso
            </button>
            <button
              onClick={() => setSelectedGoal('ganhar-massa')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedGoal === 'ganhar-massa'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Ganhar Massa
            </button>
            <button
              onClick={() => setSelectedGoal('manter')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedGoal === 'manter'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Manter Peso
            </button>
          </div>
        </div>

        {/* Resumo Nutricional */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Resumo Diário</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-4">
              <p className="text-sm text-gray-300 mb-1">Calorias</p>
              <p className="text-2xl font-bold text-white">{totalCalories}</p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/50 rounded-xl p-4">
              <p className="text-sm text-gray-300 mb-1">Proteínas</p>
              <p className="text-2xl font-bold text-white">{totalProtein}g</p>
              <p className="text-xs text-gray-400">{((totalProtein * 4 / totalCalories) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-xl p-4">
              <p className="text-sm text-gray-300 mb-1">Carboidratos</p>
              <p className="text-2xl font-bold text-white">{totalCarbs}g</p>
              <p className="text-xs text-gray-400">{((totalCarbs * 4 / totalCalories) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/50 rounded-xl p-4">
              <p className="text-sm text-gray-300 mb-1">Gorduras</p>
              <p className="text-2xl font-bold text-white">{totalFats}g</p>
              <p className="text-xs text-gray-400">{((totalFats * 9 / totalCalories) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Refeições */}
        <div className="space-y-4">
          {Object.entries(currentPlan).map(([mealKey, meals]) => (
            <div
              key={mealKey}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedMeal(expandedMeal === mealKey ? null : mealKey)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                    {getMealIcon(mealKey)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">{meals[0].name}</h3>
                    <p className="text-sm text-gray-400">{meals[0].time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{meals[0].calories} kcal</p>
                    <p className="text-sm text-gray-400">
                      P: {meals[0].protein}g | C: {meals[0].carbs}g | G: {meals[0].fats}g
                    </p>
                  </div>
                  {expandedMeal === mealKey ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedMeal === mealKey && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <div className="pt-6 space-y-3">
                    <h4 className="text-lg font-semibold text-white mb-3">Alimentos:</h4>
                    {meals[0].foods.map((food, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-white">{food}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Calorias</p>
                      <p className="text-lg font-bold text-white">{meals[0].calories}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Proteínas</p>
                      <p className="text-lg font-bold text-blue-400">{meals[0].protein}g</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Carboidratos</p>
                      <p className="text-lg font-bold text-green-400">{meals[0].carbs}g</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Gorduras</p>
                      <p className="text-lg font-bold text-orange-400">{meals[0].fats}g</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dicas */}
        <div className="mt-8 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">💡 Dicas Importantes</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Beba pelo menos 2-3 litros de água por dia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Faça as refeições nos horários indicados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Evite alimentos processados e industrializados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Ajuste as porções de acordo com sua fome e saciedade</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Consulte um nutricionista para um plano personalizado</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
