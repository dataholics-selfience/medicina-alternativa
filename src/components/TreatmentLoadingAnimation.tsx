import { useState, useEffect } from 'react';
import { 
  Search, 
  Brain, 
  Sparkles, 
  Heart, 
  Flower, 
  Zap, 
  Waves, 
  Mountain, 
  CheckCircle 
} from 'lucide-react';

interface LoadingFrame {
  id: number;
  title: string;
  icon: any;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

const loadingFrames: LoadingFrame[] = [
  {
    id: 1,
    title: "Analisando o caso do paciente",
    icon: Search,
    bgColor: "from-blue-900 via-blue-800 to-blue-900",
    iconColor: "text-blue-300",
    textColor: "text-blue-100"
  },
  {
    id: 2,
    title: "Buscando tratamentos de Medicina Oriental e Medicina Ortomolecular",
    icon: Brain,
    bgColor: "from-purple-900 via-purple-800 to-purple-900",
    iconColor: "text-purple-300",
    textColor: "text-purple-100"
  },
  {
    id: 3,
    title: "Vasculhando formas de tratar por Medicina Antroposófica e terapêutica Homeopática",
    icon: Heart,
    bgColor: "from-pink-900 via-pink-800 to-pink-900",
    iconColor: "text-pink-300",
    textColor: "text-pink-100"
  },
  {
    id: 4,
    title: "Explorando tratamentos da Ayurveda",
    icon: Sparkles,
    bgColor: "from-orange-900 via-orange-800 to-orange-900",
    iconColor: "text-orange-300",
    textColor: "text-orange-100"
  },
  {
    id: 5,
    title: "Plasmando as potenciais da Cura Xamânica",
    icon: Flower,
    bgColor: "from-emerald-900 via-emerald-800 to-emerald-900",
    iconColor: "text-emerald-300",
    textColor: "text-emerald-100"
  },
  {
    id: 6,
    title: "Mergulhando fundo na Medicina Biofísica e Aparelhos de Frequência",
    icon: Waves,
    bgColor: "from-cyan-900 via-cyan-800 to-cyan-900",
    iconColor: "text-cyan-300",
    textColor: "text-cyan-100"
  },
  {
    id: 7,
    title: "Observando tratativas de Aparelhos de Frequência e Aromaterapia",
    icon: Zap,
    bgColor: "from-violet-900 via-violet-800 to-violet-900",
    iconColor: "text-violet-300",
    textColor: "text-violet-100"
  },
  {
    id: 8,
    title: "Decifrando Saberes Ancestrais, Orientações Alimentares e Mudanças na Rotina",
    icon: Mountain,
    bgColor: "from-amber-900 via-amber-800 to-amber-900",
    iconColor: "text-amber-300",
    textColor: "text-amber-100"
  },
  {
    id: 9,
    title: "Finalizando as indicações de tratamentos alternativos",
    icon: CheckCircle,
    bgColor: "from-green-900 via-green-800 to-green-900",
    iconColor: "text-green-300",
    textColor: "text-green-100"
  }
];

interface TreatmentLoadingAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

const TreatmentLoadingAnimation = ({ isVisible, onComplete }: TreatmentLoadingAnimationProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    setIsAnimating(true);
    setCurrentFrame(0);

    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => {
        if (prev >= loadingFrames.length - 1) {
          clearInterval(frameInterval);
          setTimeout(() => {
            setIsAnimating(false);
            onComplete();
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 3300); // 3.3 segundos por frame

    return () => {
      clearInterval(frameInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible || !isAnimating) return null;

  const frame = loadingFrames[currentFrame];
  const Icon = frame.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background com gradiente animado */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${frame.bgColor} transition-all duration-1000 ease-in-out`}
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      />
      
      {/* Efeitos de partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${frame.iconColor} rounded-full opacity-30 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Círculos concêntricos animados */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-96 h-96 border-2 ${frame.iconColor} rounded-full opacity-20 animate-ping`} />
        <div className={`absolute w-64 h-64 border-2 ${frame.iconColor} rounded-full opacity-30 animate-ping`} 
             style={{ animationDelay: '0.5s' }} />
        <div className={`absolute w-32 h-32 border-2 ${frame.iconColor} rounded-full opacity-40 animate-ping`} 
             style={{ animationDelay: '1s' }} />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* Ícone principal com animação */}
        <div className="mb-8 relative">
          <div className={`inline-flex items-center justify-center w-32 h-32 ${frame.iconColor} rounded-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 shadow-2xl`}>
            <Icon 
              size={64} 
              className={`${frame.iconColor} animate-pulse`}
              style={{
                filter: 'drop-shadow(0 0 20px currentColor)',
                animation: 'pulse 2s ease-in-out infinite, rotate 8s linear infinite'
              }}
            />
          </div>
          
          {/* Halo de luz ao redor do ícone */}
          <div 
            className={`absolute inset-0 w-32 h-32 ${frame.iconColor} rounded-full opacity-20 animate-ping`}
            style={{ animationDuration: '3s' }}
          />
        </div>

        {/* Título com efeito de digitação */}
        <h2 className={`text-3xl md:text-4xl font-bold ${frame.textColor} mb-6 leading-tight`}>
          <span 
            className="inline-block"
            style={{
              animation: 'fadeInUp 1s ease-out',
              textShadow: '0 0 30px currentColor'
            }}
          >
            {frame.title}
          </span>
        </h2>

        {/* Barra de progresso */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${frame.textColor} opacity-80`}>
              Etapa {currentFrame + 1} de {loadingFrames.length}
            </span>
            <span className={`text-sm ${frame.textColor} opacity-80`}>
              {Math.round(((currentFrame + 1) / loadingFrames.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 backdrop-blur-sm">
            <div 
              className={`h-2 bg-gradient-to-r from-white to-current ${frame.iconColor} rounded-full transition-all duration-1000 ease-out shadow-lg`}
              style={{ 
                width: `${((currentFrame + 1) / loadingFrames.length) * 100}%`,
                boxShadow: '0 0 20px currentColor'
              }}
            />
          </div>
        </div>

        {/* Indicadores de etapas */}
        <div className="flex justify-center space-x-2 mb-8">
          {loadingFrames.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index <= currentFrame 
                  ? `${frame.iconColor} shadow-lg` 
                  : 'bg-white bg-opacity-30'
              }`}
              style={{
                boxShadow: index <= currentFrame ? '0 0 10px currentColor' : 'none'
              }}
            />
          ))}
        </div>

        {/* Texto de status */}
        <p className={`text-lg ${frame.textColor} opacity-80 animate-pulse`}>
          Processando conhecimentos de medicina alternativa...
        </p>
      </div>

      {/* Efeitos de luz nas bordas */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30 animate-pulse" />
      <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30 animate-pulse" />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TreatmentLoadingAnimation;