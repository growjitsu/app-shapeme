// Sample data for ShapeMe app

import { Meal, WorkoutRoutine, SubscriptionPlan } from './types';

// Meal Plans Data
export const sampleMeals: Record<string, Meal[]> = {
  weight_loss: [
    // Breakfast options
    {
      id: 'wl-b1',
      name: 'Omelete com Vegetais',
      calories: 280,
      protein: 22,
      carbs: 12,
      fats: 16,
      description: 'Omelete de 3 ovos com espinafre, tomate e cebola',
      ingredients: ['3 ovos', 'Espinafre', 'Tomate', 'Cebola', 'Azeite']
    },
    {
      id: 'wl-b2',
      name: 'Iogurte com Frutas',
      calories: 220,
      protein: 15,
      carbs: 28,
      fats: 5,
      description: 'Iogurte natural com morangos e granola',
      ingredients: ['Iogurte natural', 'Morangos', 'Granola', 'Mel']
    },
    // Lunch options
    {
      id: 'wl-l1',
      name: 'Frango Grelhado com Salada',
      calories: 380,
      protein: 42,
      carbs: 18,
      fats: 14,
      description: 'Peito de frango grelhado com salada verde e batata doce',
      ingredients: ['Peito de frango', 'Alface', 'Tomate', 'Batata doce', 'Azeite']
    },
    {
      id: 'wl-l2',
      name: 'Peixe ao Forno com Legumes',
      calories: 350,
      protein: 38,
      carbs: 22,
      fats: 12,
      description: 'Tilápia ao forno com brócolis e cenoura',
      ingredients: ['Tilápia', 'Brócolis', 'Cenoura', 'Limão', 'Ervas']
    },
    // Dinner options
    {
      id: 'wl-d1',
      name: 'Sopa de Legumes',
      calories: 180,
      protein: 8,
      carbs: 28,
      fats: 4,
      description: 'Sopa nutritiva com legumes variados',
      ingredients: ['Abóbora', 'Cenoura', 'Chuchu', 'Cebola', 'Alho']
    },
    {
      id: 'wl-d2',
      name: 'Salada de Atum',
      calories: 240,
      protein: 28,
      carbs: 15,
      fats: 8,
      description: 'Atum com folhas verdes e grão de bico',
      ingredients: ['Atum', 'Alface', 'Rúcula', 'Grão de bico', 'Azeite']
    },
    // Snacks
    {
      id: 'wl-s1',
      name: 'Frutas com Castanhas',
      calories: 150,
      protein: 4,
      carbs: 18,
      fats: 8,
      description: 'Mix de frutas frescas com castanhas',
      ingredients: ['Maçã', 'Banana', 'Castanhas', 'Amêndoas']
    },
    {
      id: 'wl-s2',
      name: 'Cenoura com Homus',
      calories: 120,
      protein: 5,
      carbs: 14,
      fats: 6,
      description: 'Palitos de cenoura com pasta de grão de bico',
      ingredients: ['Cenoura', 'Grão de bico', 'Tahine', 'Limão']
    }
  ],
  
  muscle_gain: [
    // Breakfast
    {
      id: 'mg-b1',
      name: 'Panqueca de Aveia',
      calories: 420,
      protein: 28,
      carbs: 48,
      fats: 12,
      description: 'Panqueca proteica com banana e mel',
      ingredients: ['Aveia', 'Ovos', 'Banana', 'Whey protein', 'Mel']
    },
    {
      id: 'mg-b2',
      name: 'Tapioca com Frango',
      calories: 380,
      protein: 32,
      carbs: 42,
      fats: 8,
      description: 'Tapioca recheada com frango desfiado',
      ingredients: ['Tapioca', 'Frango desfiado', 'Queijo', 'Tomate']
    },
    // Lunch
    {
      id: 'mg-l1',
      name: 'Arroz com Carne e Feijão',
      calories: 580,
      protein: 48,
      carbs: 62,
      fats: 16,
      description: 'Prato completo com arroz integral, carne e feijão',
      ingredients: ['Arroz integral', 'Carne moída', 'Feijão', 'Salada']
    },
    {
      id: 'mg-l2',
      name: 'Macarrão com Frango',
      calories: 620,
      protein: 52,
      carbs: 68,
      fats: 14,
      description: 'Macarrão integral com frango e molho de tomate',
      ingredients: ['Macarrão integral', 'Frango', 'Molho de tomate', 'Queijo']
    },
    // Dinner
    {
      id: 'mg-d1',
      name: 'Salmão com Batata Doce',
      calories: 520,
      protein: 42,
      carbs: 48,
      fats: 18,
      description: 'Salmão grelhado com batata doce assada',
      ingredients: ['Salmão', 'Batata doce', 'Aspargos', 'Azeite']
    },
    {
      id: 'mg-d2',
      name: 'Frango com Quinoa',
      calories: 480,
      protein: 46,
      carbs: 44,
      fats: 12,
      description: 'Frango grelhado com quinoa e legumes',
      ingredients: ['Frango', 'Quinoa', 'Brócolis', 'Cenoura']
    },
    // Snacks
    {
      id: 'mg-s1',
      name: 'Shake Proteico',
      calories: 280,
      protein: 32,
      carbs: 24,
      fats: 6,
      description: 'Shake com whey, banana e aveia',
      ingredients: ['Whey protein', 'Banana', 'Aveia', 'Leite']
    },
    {
      id: 'mg-s2',
      name: 'Sanduíche Natural',
      calories: 320,
      protein: 24,
      carbs: 36,
      fats: 8,
      description: 'Pão integral com peito de peru e queijo',
      ingredients: ['Pão integral', 'Peito de peru', 'Queijo branco', 'Alface']
    }
  ],
  
  maintenance: [
    // Breakfast
    {
      id: 'm-b1',
      name: 'Pão Integral com Ovo',
      calories: 320,
      protein: 18,
      carbs: 38,
      fats: 10,
      description: 'Pão integral com ovo mexido e abacate',
      ingredients: ['Pão integral', 'Ovos', 'Abacate', 'Tomate']
    },
    {
      id: 'm-b2',
      name: 'Mingau de Aveia',
      calories: 280,
      protein: 12,
      carbs: 42,
      fats: 8,
      description: 'Mingau cremoso com frutas',
      ingredients: ['Aveia', 'Leite', 'Banana', 'Canela']
    },
    // Lunch
    {
      id: 'm-l1',
      name: 'Prato Balanceado',
      calories: 480,
      protein: 32,
      carbs: 52,
      fats: 14,
      description: 'Arroz, feijão, frango e salada',
      ingredients: ['Arroz', 'Feijão', 'Frango', 'Salada mista']
    },
    {
      id: 'm-l2',
      name: 'Risoto de Frango',
      calories: 460,
      protein: 28,
      carbs: 54,
      fats: 12,
      description: 'Risoto cremoso com frango e legumes',
      ingredients: ['Arroz arbóreo', 'Frango', 'Cogumelos', 'Queijo']
    },
    // Dinner
    {
      id: 'm-d1',
      name: 'Wrap de Frango',
      calories: 380,
      protein: 28,
      carbs: 42,
      fats: 10,
      description: 'Wrap integral com frango e vegetais',
      ingredients: ['Tortilha integral', 'Frango', 'Alface', 'Tomate']
    },
    {
      id: 'm-d2',
      name: 'Omelete com Salada',
      calories: 320,
      protein: 24,
      carbs: 18,
      fats: 16,
      description: 'Omelete recheado com salada verde',
      ingredients: ['Ovos', 'Queijo', 'Alface', 'Tomate']
    },
    // Snacks
    {
      id: 'm-s1',
      name: 'Frutas Variadas',
      calories: 120,
      protein: 2,
      carbs: 28,
      fats: 1,
      description: 'Mix de frutas da estação',
      ingredients: ['Maçã', 'Banana', 'Laranja', 'Uvas']
    },
    {
      id: 'm-s2',
      name: 'Iogurte com Granola',
      calories: 180,
      protein: 10,
      carbs: 24,
      fats: 5,
      description: 'Iogurte natural com granola caseira',
      ingredients: ['Iogurte', 'Granola', 'Mel']
    }
  ]
};

// Workout Routines Data
export const workoutRoutines: WorkoutRoutine[] = [
  // Home Workouts
  {
    id: 'home-beginner-1',
    name: 'Treino em Casa - Iniciante',
    category: 'home',
    level: 'beginner',
    duration: '20-30 min',
    description: 'Exercícios simples sem equipamento para começar sua jornada',
    exercises: [
      { id: 'h1', name: 'Polichinelos', reps: '3x20', description: 'Aquecimento cardiovascular' },
      { id: 'h2', name: 'Agachamento', reps: '3x15', description: 'Fortalecimento de pernas' },
      { id: 'h3', name: 'Flexão de joelhos', reps: '3x10', description: 'Trabalho de peito e braços' },
      { id: 'h4', name: 'Prancha', duration: '3x30seg', description: 'Fortalecimento do core' },
      { id: 'h5', name: 'Abdominais', reps: '3x15', description: 'Trabalho abdominal' },
      { id: 'h6', name: 'Alongamento', duration: '5 min', description: 'Relaxamento muscular' }
    ]
  },
  {
    id: 'home-intermediate-1',
    name: 'Treino em Casa - Intermediário',
    category: 'home',
    level: 'intermediate',
    duration: '30-40 min',
    description: 'Treino mais intenso para quem já tem condicionamento',
    exercises: [
      { id: 'h7', name: 'Burpees', reps: '3x12', description: 'Exercício completo de corpo' },
      { id: 'h8', name: 'Agachamento búlgaro', reps: '3x12 cada', description: 'Trabalho unilateral de pernas' },
      { id: 'h9', name: 'Flexão tradicional', reps: '3x15', description: 'Peito, ombros e tríceps' },
      { id: 'h10', name: 'Mountain climbers', reps: '3x20', description: 'Cardio e core' },
      { id: 'h11', name: 'Prancha lateral', duration: '3x45seg cada', description: 'Oblíquos' },
      { id: 'h12', name: 'Afundo', reps: '3x12 cada', description: 'Pernas e glúteos' }
    ]
  },
  
  // Outdoor Workouts
  {
    id: 'outdoor-beginner-1',
    name: 'Treino ao Ar Livre - Iniciante',
    category: 'outdoor',
    level: 'beginner',
    duration: '30-40 min',
    description: 'Caminhada e exercícios funcionais ao ar livre',
    exercises: [
      { id: 'o1', name: 'Caminhada rápida', duration: '15 min', description: 'Aquecimento cardiovascular' },
      { id: 'o2', name: 'Agachamento no banco', reps: '3x12', description: 'Use um banco do parque' },
      { id: 'o3', name: 'Flexão inclinada', reps: '3x10', description: 'Use um banco ou muro' },
      { id: 'o4', name: 'Step no banco', reps: '3x15 cada', description: 'Subir e descer do banco' },
      { id: 'o5', name: 'Alongamento', duration: '5 min', description: 'Relaxamento ao ar livre' }
    ]
  },
  {
    id: 'outdoor-intermediate-1',
    name: 'Treino ao Ar Livre - Intermediário',
    category: 'outdoor',
    level: 'intermediate',
    duration: '40-50 min',
    description: 'Corrida e exercícios funcionais intensos',
    exercises: [
      { id: 'o6', name: 'Corrida leve', duration: '10 min', description: 'Aquecimento' },
      { id: 'o7', name: 'Tiros de velocidade', reps: '5x100m', description: 'Corrida intensa com descanso' },
      { id: 'o8', name: 'Burpees', reps: '3x15', description: 'Exercício completo' },
      { id: 'o9', name: 'Flexão com pés elevados', reps: '3x12', description: 'Use um banco' },
      { id: 'o10', name: 'Prancha', duration: '3x60seg', description: 'Core forte' },
      { id: 'o11', name: 'Corrida leve', duration: '10 min', description: 'Volta à calma' }
    ]
  },
  
  // Gym Workouts
  {
    id: 'gym-beginner-1',
    name: 'Treino Academia - Iniciante (Corpo Todo)',
    category: 'gym',
    level: 'beginner',
    duration: '45-60 min',
    description: 'Treino completo para iniciantes na academia',
    exercises: [
      { id: 'g1', name: 'Esteira', duration: '10 min', description: 'Aquecimento cardiovascular', muscleGroup: 'Cardio' },
      { id: 'g2', name: 'Leg Press', reps: '3x12', description: 'Pernas completas', muscleGroup: 'Pernas' },
      { id: 'g3', name: 'Supino reto', reps: '3x12', description: 'Peito e tríceps', muscleGroup: 'Peito' },
      { id: 'g4', name: 'Puxada frontal', reps: '3x12', description: 'Costas e bíceps', muscleGroup: 'Costas' },
      { id: 'g5', name: 'Desenvolvimento', reps: '3x12', description: 'Ombros', muscleGroup: 'Ombros' },
      { id: 'g6', name: 'Rosca direta', reps: '3x12', description: 'Bíceps', muscleGroup: 'Braços' },
      { id: 'g7', name: 'Tríceps pulley', reps: '3x12', description: 'Tríceps', muscleGroup: 'Braços' },
      { id: 'g8', name: 'Abdominal na máquina', reps: '3x15', description: 'Core', muscleGroup: 'Abdômen' }
    ]
  },
  {
    id: 'gym-intermediate-chest',
    name: 'Treino Academia - Peito e Tríceps',
    category: 'gym',
    level: 'intermediate',
    duration: '60-75 min',
    description: 'Treino focado em peito e tríceps',
    exercises: [
      { id: 'g9', name: 'Supino reto', reps: '4x10', description: 'Exercício principal', muscleGroup: 'Peito' },
      { id: 'g10', name: 'Supino inclinado', reps: '4x10', description: 'Peito superior', muscleGroup: 'Peito' },
      { id: 'g11', name: 'Crucifixo', reps: '3x12', description: 'Isolamento de peito', muscleGroup: 'Peito' },
      { id: 'g12', name: 'Paralelas', reps: '3x12', description: 'Peito inferior e tríceps', muscleGroup: 'Peito' },
      { id: 'g13', name: 'Tríceps testa', reps: '3x12', description: 'Isolamento de tríceps', muscleGroup: 'Braços' },
      { id: 'g14', name: 'Tríceps corda', reps: '3x15', description: 'Finalização', muscleGroup: 'Braços' }
    ]
  },
  {
    id: 'gym-intermediate-back',
    name: 'Treino Academia - Costas e Bíceps',
    category: 'gym',
    level: 'intermediate',
    duration: '60-75 min',
    description: 'Treino focado em costas e bíceps',
    exercises: [
      { id: 'g15', name: 'Barra fixa', reps: '4x8-10', description: 'Exercício principal', muscleGroup: 'Costas' },
      { id: 'g16', name: 'Remada curvada', reps: '4x10', description: 'Costas completas', muscleGroup: 'Costas' },
      { id: 'g17', name: 'Puxada aberta', reps: '3x12', description: 'Largura das costas', muscleGroup: 'Costas' },
      { id: 'g18', name: 'Remada baixa', reps: '3x12', description: 'Espessura das costas', muscleGroup: 'Costas' },
      { id: 'g19', name: 'Rosca direta', reps: '3x12', description: 'Bíceps', muscleGroup: 'Braços' },
      { id: 'g20', name: 'Rosca martelo', reps: '3x12', description: 'Bíceps e antebraço', muscleGroup: 'Braços' }
    ]
  },
  {
    id: 'gym-intermediate-legs',
    name: 'Treino Academia - Pernas',
    category: 'gym',
    level: 'intermediate',
    duration: '60-75 min',
    description: 'Treino completo de pernas',
    exercises: [
      { id: 'g21', name: 'Agachamento livre', reps: '4x10', description: 'Exercício principal', muscleGroup: 'Pernas' },
      { id: 'g22', name: 'Leg Press 45°', reps: '4x12', description: 'Pernas completas', muscleGroup: 'Pernas' },
      { id: 'g23', name: 'Cadeira extensora', reps: '3x15', description: 'Quadríceps', muscleGroup: 'Pernas' },
      { id: 'g24', name: 'Mesa flexora', reps: '3x15', description: 'Posteriores', muscleGroup: 'Pernas' },
      { id: 'g25', name: 'Stiff', reps: '3x12', description: 'Posteriores e glúteos', muscleGroup: 'Pernas' },
      { id: 'g26', name: 'Panturrilha em pé', reps: '4x20', description: 'Panturrilhas', muscleGroup: 'Pernas' }
    ]
  }
];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    type: 'simple',
    name: 'Plano Simples',
    monthlyPrice: 19.90,
    yearlyPrice: 199.00, // ~16.58/mês (17% desconto)
    features: [
      'Registro de peso',
      'Registro de medidas corporais',
      'Calculadora de IMC',
      'Gráficos básicos de progresso',
      'Até 10 fotos de evolução'
    ],
    limits: {
      progressPhotos: 10,
      workoutAccess: false,
      mealPlanAccess: false,
      advancedAnalytics: false,
      customization: false,
      smartGoals: false
    }
  },
  {
    type: 'medium',
    name: 'Plano Médio',
    monthlyPrice: 49.90,
    yearlyPrice: 499.00, // ~41.58/mês (17% desconto)
    features: [
      'Tudo do Plano Simples',
      'Rotinas de treino completas (casa, rua e academia)',
      'Planos alimentares personalizados',
      'Fotos de evolução ilimitadas',
      'Gráficos avançados de progresso'
    ],
    limits: {
      progressPhotos: 'unlimited',
      workoutAccess: true,
      mealPlanAccess: true,
      advancedAnalytics: true,
      customization: false,
      smartGoals: false
    }
  },
  {
    type: 'top',
    name: 'Plano Top',
    monthlyPrice: 97.90,
    yearlyPrice: 979.00, // ~81.58/mês (17% desconto)
    features: [
      'Tudo do Plano Médio',
      'Personalização completa das rotinas',
      'Sugestões avançadas de alimentação',
      'Ferramentas premium de análise corporal',
      'Acesso antecipado a novos recursos',
      'Sistema de metas inteligentes'
    ],
    limits: {
      progressPhotos: 'unlimited',
      workoutAccess: true,
      mealPlanAccess: true,
      advancedAnalytics: true,
      customization: true,
      smartGoals: true
    }
  }
];
