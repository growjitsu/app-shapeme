'use client';

import { useState, useEffect } from 'react';
import { 
  Check, 
  Star, 
  TrendingUp, 
  Users, 
  Award, 
  Zap,
  Shield,
  Heart,
  Target,
  ChevronRight,
  Play,
  Quote,
  Sparkles,
  Crown,
  ArrowRight,
  X,
  Camera,
  Activity,
  Calendar,
  Dumbbell
} from 'lucide-react';

export default function LandingPage() {
  const [showVideo, setShowVideo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Silenciar erros do MetaMask e outras extensões do navegador
  useEffect(() => {
    // Interceptar erros não tratados de promises
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || '';
      const errorStack = event.reason?.stack || '';
      
      // Lista de padrões de erros de extensões que devem ser silenciados
      const extensionErrorPatterns = [
        'MetaMask',
        'chrome-extension://',
        'moz-extension://',
        'safari-extension://',
        'inpage.js',
        'content-script',
        'Failed to connect to'
      ];
      
      // Verificar se o erro é de alguma extensão
      const isExtensionError = extensionErrorPatterns.some(pattern => 
        errorMessage.includes(pattern) || errorStack.includes(pattern)
      );
      
      if (isExtensionError) {
        // Prevenir que o erro apareça no console
        event.preventDefault();
        // Opcional: log silencioso para debug (comentado por padrão)
        // console.debug('Extension error silenced:', errorMessage);
      }
    };

    // Interceptar erros globais do window
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || '';
      const errorFilename = event.filename || '';
      
      const extensionErrorPatterns = [
        'chrome-extension://',
        'moz-extension://',
        'safari-extension://'
      ];
      
      const isExtensionError = extensionErrorPatterns.some(pattern => 
        errorMessage.includes(pattern) || errorFilename.includes(pattern)
      );
      
      if (isExtensionError) {
        event.preventDefault();
        return true;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Auto-advance slides no vídeo
  useEffect(() => {
    if (showVideo) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 6);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showVideo]);

  const videoSlides = [
    {
      title: 'Acompanhe Seu Progresso',
      description: 'Registre peso, medidas e veja sua evolução em gráficos detalhados',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
      icon: <TrendingUp className="w-12 h-12" />
    },
    {
      title: 'Fotos de Evolução',
      description: 'Compare seu antes e depois com fotos organizadas por data',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
      icon: <Camera className="w-12 h-12" />
    },
    {
      title: 'Treinos Personalizados',
      description: 'Rotinas completas para casa, rua e academia adaptadas ao seu nível',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      icon: <Dumbbell className="w-12 h-12" />
    },
    {
      title: 'Planos Alimentares',
      description: 'Dietas balanceadas e personalizadas para seu objetivo',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
      icon: <Activity className="w-12 h-12" />
    },
    {
      title: 'Maria Perdeu 15kg',
      description: '"Minha vida mudou completamente! Me sinto mais confiante e saudável"',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop',
      icon: <Star className="w-12 h-12" />,
      isTestimonial: true
    },
    {
      title: 'João Ganhou 8kg de Massa',
      description: '"Resultados incríveis em apenas 3 meses! Recomendo para todos"',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop',
      icon: <Award className="w-12 h-12" />,
      isTestimonial: true
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Perdeu 15kg em 4 meses',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      text: 'O Meu Shape Novo mudou minha vida! Consegui perder peso de forma saudável e sustentável. Os planos alimentares são incríveis!'
    },
    {
      name: 'João Santos',
      role: 'Ganhou 8kg de massa muscular',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      text: 'Finalmente encontrei um app que realmente funciona. Os treinos são práticos e os resultados aparecem rápido!'
    },
    {
      name: 'Ana Costa',
      role: 'Mantém o peso ideal há 1 ano',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      text: 'Adoro a facilidade de acompanhar meu progresso. As fotos de evolução me motivam todos os dias!'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Usuários Ativos' },
    { value: '2M+', label: 'Kg Perdidos' },
    { value: '4.9/5', label: 'Avaliação' },
    { value: '95%', label: 'Taxa de Sucesso' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Mais de 50.000 pessoas transformadas</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Transforme Seu Corpo,
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Transforme Sua Vida
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              O app completo para você alcançar seus objetivos de forma inteligente, 
              com planos personalizados e acompanhamento profissional.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#planos"
                className="group w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => setShowVideo(true)}
                className="group w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Ver Como Funciona
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => {
                setShowVideo(false);
                setCurrentSlide(0);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30">
              {/* Video Content */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-purple-900">
                {/* Slide atual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-full h-full relative"
                    style={{
                      backgroundImage: `url(${videoSlides[currentSlide].image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Overlay escuro */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
                    
                    {/* Conteúdo do slide */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <div className={`mb-6 p-4 rounded-2xl ${videoSlides[currentSlide].isTestimonial ? 'bg-yellow-500/20' : 'bg-purple-500/20'} backdrop-blur-sm`}>
                        {videoSlides[currentSlide].icon}
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-4 max-w-2xl">
                        {videoSlides[currentSlide].title}
                      </h3>
                      <p className="text-xl text-gray-200 max-w-xl leading-relaxed">
                        {videoSlides[currentSlide].description}
                      </p>
                      
                      {videoSlides[currentSlide].isTestimonial && (
                        <div className="flex gap-1 mt-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {videoSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'w-12 bg-purple-500' 
                          : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + videoSlides.length) % videoSlides.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white rotate-180" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % videoSlides.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* CTA no vídeo */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
                <p className="text-white text-lg font-semibold mb-3">
                  Pronto para começar sua transformação?
                </p>
                <button
                  onClick={() => {
                    setShowVideo(false);
                    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform inline-flex items-center gap-2"
                >
                  Garantir Minha Vaga
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Por Que Escolher o Meu Shape Novo?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tecnologia de ponta combinada com ciência para resultados reais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-12 h-12" />,
                title: 'Planos Personalizados',
                description: 'Treinos e dietas adaptados ao seu objetivo, nível e rotina. Resultados garantidos.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: <TrendingUp className="w-12 h-12" />,
                title: 'Acompanhamento Inteligente',
                description: 'Gráficos detalhados, fotos de progresso e métricas que mostram sua evolução real.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: 'Resultados Rápidos',
                description: 'Metodologia comprovada que acelera seus resultados sem comprometer sua saúde.',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Comunidade Ativa',
                description: 'Junte-se a milhares de pessoas que estão transformando suas vidas.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: '100% Seguro',
                description: 'Planos validados por nutricionistas e educadores físicos certificados.',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: 'Suporte Dedicado',
                description: 'Equipe sempre disponível para te ajudar em cada passo da jornada.',
                gradient: 'from-pink-500 to-rose-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Histórias de Sucesso
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Veja como o Meu Shape Novo transformou a vida de milhares de pessoas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <Quote className="w-10 h-10 text-purple-400 mb-6" />
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-purple-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - PROMOÇÃO ÚNICA */}
      <section id="planos" className="py-24 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">OFERTA ESPECIAL POR TEMPO LIMITADO</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Transforme Sua Vida Hoje
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Acesso completo a todos os recursos premium com desconto exclusivo
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/50 border-2 border-yellow-400">
              {/* Badge de Promoção */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg animate-pulse">
                  <Crown className="w-5 h-5" />
                  PROMOÇÃO EXCLUSIVA - 86% OFF
                </div>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Plano Premium Completo
                </h3>
                
                {/* Preço Original Riscado */}
                <div className="mb-4">
                  <span className="text-2xl text-white/60 line-through">
                    De R$ 197,90
                  </span>
                </div>

                {/* Preço Promocional */}
                <div className="flex items-end justify-center gap-2 mb-2">
                  <span className="text-6xl font-bold text-white">
                    R$ 27,90
                  </span>
                  <span className="text-xl mb-3 text-white/90">
                    /mês
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2 mb-6">
                  <span className="text-green-300 font-bold text-sm">
                    💰 Economize R$ 170,00 por mês
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Registro ilimitado de peso e medidas',
                  'Gráficos avançados de evolução',
                  'Cálculo de IMC e composição corporal',
                  'Fotos ilimitadas de progresso',
                  'Definição e acompanhamento de metas',
                  'Planos alimentares personalizados',
                  'Rotinas de treino completas',
                  'Treinos para casa, rua e academia',
                  'Planos alimentares avançados',
                  'Relatórios detalhados de progresso',
                  'Acesso prioritário a novos recursos'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 flex-shrink-0 text-yellow-300" />
                    <span className="text-sm text-white font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="https://pay.kiwify.com.br/VFeDoCc"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 text-center bg-white text-purple-600 hover:shadow-2xl mb-4"
              >
                <span className="flex items-center justify-center gap-2">
                  Garantir Minha Vaga Agora
                  <ChevronRight className="w-6 h-6" />
                </span>
              </a>

              <div className="text-center text-white/90 text-sm">
                ⏰ Restam apenas 12 vagas com este preço especial
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl px-8 py-4">
              <Shield className="w-8 h-8 text-green-400" />
              <div className="text-left">
                <div className="font-bold text-white text-lg">Garantia de 7 Dias</div>
                <div className="text-green-300 text-sm">100% do seu dinheiro de volta se não ficar satisfeito</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl shadow-purple-500/50">
            <Award className="w-20 h-20 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Pronto Para Sua Transformação?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Junte-se a mais de 50.000 pessoas que já transformaram suas vidas com o Meu Shape Novo. 
              Sua melhor versão está a um clique de distância.
            </p>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Começar Minha Jornada
              <ArrowRight className="w-6 h-6" />
            </a>
            <p className="text-white/80 text-sm mt-6">
              ✨ Sem compromisso • Cancele quando quiser • Garantia de 7 dias
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Meu Shape Novo</h3>
            <p className="text-gray-400 mb-6">Transforme seu corpo, transforme sua vida</p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
            <p className="text-gray-600 text-sm mt-8">
              © 2024 Meu Shape Novo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
