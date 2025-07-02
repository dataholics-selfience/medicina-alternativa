import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Leaf, 
  Sparkles, 
  Brain, 
  Zap, 
  Mountain, 
  Flower, 
  Eye,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Shield,
  Clock,
  Award,
  ChevronDown,
  Play,
  Quote
} from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Inteligência Artificial Especializada",
      description: "Nossa IA foi treinada com conhecimentos milenares e práticas contemporâneas de medicina alternativa, oferecendo análises precisas e personalizadas."
    },
    {
      icon: Leaf,
      title: "Fitoterapia Avançada",
      description: "Recomendações baseadas em propriedades farmacológicas de plantas medicinais, considerando interações e dosagens adequadas."
    },
    {
      icon: Sparkles,
      title: "Medicina Ayurvédica",
      description: "Diagnósticos baseados nos doshas e constituições individuais, com tratamentos personalizados segundo a tradição védica."
    },
    {
      icon: Mountain,
      title: "Saberes Ancestrais",
      description: "Integração de conhecimentos tradicionais de diversas culturas, preservando a sabedoria milenar da humanidade."
    },
    {
      icon: Zap,
      title: "Medicina Biofísica",
      description: "Aplicação de frequências terapêuticas e tecnologias quânticas para harmonização energética do organismo."
    },
    {
      icon: Heart,
      title: "Abordagem Holística",
      description: "Tratamento integral que considera corpo, mente e espírito, promovendo cura em todos os níveis do ser."
    }
  ];

  const testimonials = [
    {
      name: "Dra. Renata Manoel Nogueira",
      role: "Médica Especialista em Medicina Integrativa",
      content: "A medicina do futuro vai precisar de outros conhecimentos, lampejos intuitivos e percepção extra sensorial",
      rating: 5
    },
    {
      name: "Dra. Renata Manoel Nogueira",
      role: "Médica Especialista em Medicina Integrativa",
      content: "Tecnologia é algo divino, que vai levar a medicina a dar um salto",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Consultas Realizadas" },
    { number: "500+", label: "Médicos Cadastrados" },
    { number: "98%", label: "Satisfação dos Usuários" },
    { number: "24/7", label: "Disponibilidade" }
  ];

  const modalidades = [
    { name: "Fitoterapia", icon: Leaf, color: "text-green-600" },
    { name: "Medicina Oriental", icon: Brain, color: "text-purple-600" },
    { name: "Homeopatia", icon: Heart, color: "text-pink-600" },
    { name: "Ayurveda", icon: Sparkles, color: "text-orange-600" },
    { name: "Medicina Antroposófica", icon: Mountain, color: "text-amber-600" },
    { name: "Cura Xamânica", icon: Flower, color: "text-emerald-600" },
    { name: "Medicina Biofísica", icon: Zap, color: "text-cyan-600" },
    { name: "Cromoterapia", icon: Eye, color: "text-indigo-600" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart size={32} className="text-green-600" />
            <span className="text-2xl font-bold text-gray-900">Medicina Alternativa</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-green-600 transition-colors">Como Funciona</a>
            <a href="#modalidades" className="text-gray-600 hover:text-green-600 transition-colors">Modalidades</a>
            <a href="#depoimentos" className="text-gray-600 hover:text-green-600 transition-colors">Depoimentos</a>
            <Link 
              to="/login" 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Acessar Plataforma
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  A Revolução da
                  <span className="text-green-600 block">Medicina Alternativa</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Onde a sabedoria ancestral encontra a inteligência artificial. 
                  Nossa plataforma integra conhecimentos milenares com tecnologia de ponta, 
                  oferecendo diagnósticos e tratamentos holísticos personalizados.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Começar Teste Gratuito
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Ver Demonstração
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Medicina Alternativa - Tratamentos Holísticos"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-green-200 to-blue-200 rounded-2xl -z-10"></div>
              
              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 bg-white p-4 rounded-xl shadow-lg">
                <Leaf size={24} className="text-green-600" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-xl shadow-lg">
                <Sparkles size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona Nossa Plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um processo intuitivo que combina a experiência clínica do profissional 
              com a precisão analítica da inteligência artificial especializada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Descrição do Caso</h3>
              <p className="text-gray-600 leading-relaxed">
                O profissional insere detalhadamente o caso do paciente, incluindo sintomas, 
                histórico médico, condições atuais e aspectos do estilo de vida que possam 
                influenciar o tratamento.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Análise Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Nossa IA processa as informações através de algoritmos especializados, 
                correlacionando sintomas com padrões energéticos, constituições ayurvédicas 
                e princípios da medicina tradicional.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plano Personalizado</h3>
              <p className="text-gray-600 leading-relaxed">
                Receba um plano de tratamento completo e personalizado, integrando múltiplas 
                modalidades terapêuticas com fundamentação científica e tradicional detalhada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section id="modalidades" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Modalidades Terapêuticas Integradas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma abrange um espectro completo de práticas terapêuticas, 
              desde tradições milenares até tecnologias quânticas contemporâneas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {modalidades.map((modalidade, index) => {
              const Icon = modalidade.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-xl text-center hover:bg-gray-100 transition-colors">
                  <Icon size={32} className={`${modalidade.color} mx-auto mb-3`} />
                  <h3 className="font-semibold text-gray-900">{modalidade.name}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://img.freepik.com/fotos-gratis/praticas-de-bem-estar-para-o-autocuidado-no-dia-mundial-da-saude_23-2151256774.jpg?ga=GA1.1.451806447.1751485457&semt=ais_hybrid&w=740" 
                alt="Tratamentos de Medicina Alternativa"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Metalinguística */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              A Metalinguística da Cura
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Nossa plataforma transcende a mera aplicação de protocolos terapêuticos. 
              Ela representa uma síntese epistemológica entre o conhecimento empírico ancestral 
              e a precisão algorítmica contemporânea, criando uma nova linguagem para a medicina integrativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Quote size={32} className="text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hermenêutica Terapêutica</h3>
              <p className="text-gray-600">
                Cada sintoma é interpretado como um signo dentro de um sistema semiótico complexo, 
                onde corpo, mente e espírito dialogam através de uma linguagem própria que nossa IA decodifica.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Brain size={32} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cognição Integrativa</h3>
              <p className="text-gray-600">
                A plataforma opera através de uma metacognição que reconhece padrões não apenas 
                nos dados clínicos, mas nas narrativas subjacentes que conectam sintoma e significado.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Sparkles size={32} className="text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ontologia da Cura</h3>
              <p className="text-gray-600">
                Reconhecemos que a cura não é apenas a ausência de doença, mas a restauração 
                de uma harmonia fundamental entre o ser e sua existência no mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O Que Dizem Nossos Profissionais
            </h2>
            <p className="text-xl text-gray-600">
              Experiências reais de médicos que transformaram sua prática clínica
            </p>
          </div>

          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-2xl text-gray-900 font-medium mb-6 leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Revolucionar sua Prática Médica?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Junte-se a centenas de profissionais que já descobriram o poder da medicina 
            alternativa integrada com inteligência artificial. Comece seu teste gratuito hoje.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Iniciar Teste Gratuito
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Já tenho conta
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span>100 consultas gratuitas</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={20} />
              <span>Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Heart size={32} className="text-green-400" />
                <span className="text-xl font-bold">Medicina Alternativa</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolucionando a medicina alternativa através da integração entre 
                sabedoria ancestral e inteligência artificial.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Cadastro</Link></li>
                <li><Link to="/plans" className="hover:text-white transition-colors">Planos</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Modalidades</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Fitoterapia</li>
                <li>Medicina Oriental</li>
                <li>Homeopatia</li>
                <li>Ayurveda</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>Termos de Uso</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Medicina Alternativa. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;