import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { TreatmentResultType, TokenUsageType } from '../types';
import MedicalConsultation from './MedicalConsultation';
import UserProfile from './UserProfile';
import TokenUsageChart from './TokenUsageChart';
import { Menu, X, Heart, CreditCard, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const [tokenUsage, setTokenUsage] = useState<TokenUsageType | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setIsLoading(false);
      return;
    }

    // Fetch token usage
    const fetchTokenUsage = async () => {
      try {
        const tokenDoc = await getDoc(doc(db, 'tokenUsage', auth.currentUser!.uid));
        if (tokenDoc.exists()) {
          setTokenUsage(tokenDoc.data() as TokenUsageType);
        }
      } catch (error) {
        console.error('Error fetching token usage:', error);
      }
      setIsLoading(false);
    };

    fetchTokenUsage();
  }, []);

  const parseTreatmentResponse = (rawResponse: any): TreatmentResultType => {
    console.log('Raw response received:', rawResponse);
    
    let jsonString = '';
    
    // Handle nested array structure
    if (Array.isArray(rawResponse) && rawResponse.length > 0) {
      if (rawResponse[0].output) {
        jsonString = rawResponse[0].output;
      }
    }
    
    console.log('JSON string:', jsonString);
    
    // Parse the actual treatment data
    const parsedData = JSON.parse(jsonString);
    console.log('Parsed data:', parsedData);
    
    const resultado = parsedData.resultado;
    
    // Ensure all array properties exist and are arrays
    const safeResult: TreatmentResultType = {
      fitoterapia: Array.isArray(resultado?.fitoterapia) ? resultado.fitoterapia : [],
      medicina_oriental: resultado?.medicina_oriental || {
        diagnostico: '',
        acupuntura: [],
        praticas: []
      },
      medicina_ortomolecular: Array.isArray(resultado?.medicina_ortomolecular) ? resultado.medicina_ortomolecular : [],
      medicina_antroposofica: Array.isArray(resultado?.medicina_antroposofica) ? resultado.medicina_antroposofica : [],
      homeopatia: Array.isArray(resultado?.homeopatia) ? resultado.homeopatia : [],
      medicina_ayurvedica: resultado?.medicina_ayurvedica || {
        diagnostico: '',
        tratamentos: []
      },
      cura_xamanica: Array.isArray(resultado?.cura_xamanica) ? resultado.cura_xamanica : [],
      medicina_biofisica: Array.isArray(resultado?.medicina_biofisica) ? resultado.medicina_biofisica : [],
      aparelhos_frequencia: Array.isArray(resultado?.aparelhos_frequencia) ? resultado.aparelhos_frequencia : [],
      cromoterapia: Array.isArray(resultado?.cromoterapia) ? resultado.cromoterapia : [],
      aromaterapia: Array.isArray(resultado?.aromaterapia) ? resultado.aromaterapia : [],
      acupuntura: Array.isArray(resultado?.acupuntura) ? resultado.acupuntura : [],
      saberes_ancestrais: Array.isArray(resultado?.saberes_ancestrais) ? resultado.saberes_ancestrais : [],
      alimentacao: resultado?.alimentacao || {
        indicada: [],
        contraindicada: []
      },
      mudancas_rotina: Array.isArray(resultado?.mudancas_rotina) ? resultado.mudancas_rotina : [],
      mensagem_final: resultado?.mensagem_final || ''
    };
    
    return safeResult;
  };

  const handleConsultation = async (caso: string, sessionId: string): Promise<TreatmentResultType> => {
    if (!auth.currentUser || !tokenUsage) {
      throw new Error('Usuário não autenticado ou dados de token não encontrados');
    }

    const CONSULTATION_TOKEN_COST = 10;
    const remainingTokens = tokenUsage.totalTokens - tokenUsage.usedTokens;
    
    if (remainingTokens < CONSULTATION_TOKEN_COST) {
      throw new Error(`Tokens insuficientes. Você possui ${remainingTokens} tokens restantes. Esta consulta custa ${CONSULTATION_TOKEN_COST} tokens.`);
    }

    try {
      // Call webhook with sessionId
      const response = await fetch('https://primary-production-2e3b.up.railway.app/webhook/medicina-alternativa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caso: caso,
          sessionId: sessionId,
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar tratamento');
      }

      // Read response as text first to handle empty responses
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Resposta vazia do servidor');
      }

      let rawResponse;
      try {
        rawResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Resposta inválida do servidor');
      }
      
      console.log('Raw response:', rawResponse);
      
      // Parse the response using the improved parser
      const resultado = parseTreatmentResponse(rawResponse);
      
      console.log('Final resultado:', resultado);

      // Update token usage
      await updateDoc(doc(db, 'tokenUsage', auth.currentUser.uid), {
        usedTokens: tokenUsage.usedTokens + CONSULTATION_TOKEN_COST
      });

      setTokenUsage(prev => prev ? {
        ...prev,
        usedTokens: prev.usedTokens + CONSULTATION_TOKEN_COST
      } : null);

      return resultado;
    } catch (error) {
      console.error('Error in consultation:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-green-600 text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 text-gray-600 hover:text-green-600 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <Heart size={32} className="text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Medicina Integrativa</h1>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/plans"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CreditCard size={16} />
              Planos
            </Link>
            <UserProfile />
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 lg:hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart size={24} className="text-green-600" />
                  <span className="font-bold text-gray-900">Medicina Integrativa</span>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {/* Token Usage in Sidebar */}
              {tokenUsage && (
                <TokenUsageChart
                  totalTokens={tokenUsage.totalTokens}
                  usedTokens={tokenUsage.usedTokens}
                />
              )}
              
              <Link
                to="/plans"
                className="flex items-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setShowSidebar(false)}
              >
                <CreditCard size={16} />
                Planos
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <UserProfile />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1">
          {/* Consultation Panel */}
          <div className="w-full">
            <MedicalConsultation 
              onConsultation={handleConsultation}
              tokenUsage={tokenUsage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;