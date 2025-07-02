import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { TreatmentResultType, TokenUsageType } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TreatmentLoadingAnimation from './TreatmentLoadingAnimation';

interface MedicalConsultationProps {
  onConsultation: (caso: string, sessionId: string) => Promise<TreatmentResultType>;
  tokenUsage: TokenUsageType | null;
}

const MedicalConsultation = ({ onConsultation, tokenUsage }: MedicalConsultationProps) => {
  const [caso, setCaso] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caso.trim() || isLoading) return;

    setIsLoading(true);
    setShowLoadingAnimation(true);
    setError('');

    try {
      const sessionId = uuidv4().replace(/-/g, '');
      
      // Inicia a consulta em paralelo com a animação
      const consultationPromise = onConsultation(caso.trim(), sessionId);
      
      // Aguarda o resultado da consulta
      const resultado = await consultationPromise;
      
      // Quando a consulta terminar, a animação vai completar seu ciclo
      // e então navegar para a página de resultados
      setShowLoadingAnimation(false);
      
      // Navigate to results page with data
      navigate('/treatment-result', { 
        state: { 
          result: resultado, 
          caso: caso.trim() 
        } 
      });
    } catch (err) {
      setShowLoadingAnimation(false);
      setError(err instanceof Error ? err.message : 'Erro ao consultar tratamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    // A animação completou, mas só navega se a consulta já terminou
    if (!isLoading) {
      setShowLoadingAnimation(false);
    }
  };

  const remainingTokens = tokenUsage ? tokenUsage.totalTokens - tokenUsage.usedTokens : 0;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nova Consulta de Medicina Alternativa</h2>
          <p className="text-gray-600">Descreva o caso do paciente para receber um plano de tratamento holístico personalizado</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <textarea
                value={caso}
                onChange={(e) => setCaso(e.target.value)}
                placeholder="Descreva detalhadamente o caso do paciente: sintomas, histórico médico, condições atuais, estilo de vida, etc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={6}
                disabled={isLoading || remainingTokens < 10}
              />
            </div>
            <button
              type="submit"
              disabled={!caso.trim() || isLoading || remainingTokens < 10}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analisando caso...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Gerar Plano de Tratamento
                </>
              )}
            </button>
            {remainingTokens < 10 && (
              <div className="mt-2 text-sm text-orange-600">
                Tokens insuficientes para consulta. <Link to="/plans" className="text-blue-600 hover:underline">Adquirir mais tokens</Link>
              </div>
            )}
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animação de carregamento em tela cheia */}
      <TreatmentLoadingAnimation 
        isVisible={showLoadingAnimation}
        onComplete={handleAnimationComplete}
      />
    </>
  );
};

export default MedicalConsultation;