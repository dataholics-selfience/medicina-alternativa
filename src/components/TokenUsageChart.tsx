import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { format, addDays } from 'date-fns';
import { ptBR, enUS, fr, de, it } from 'date-fns/locale';

interface TokenUsageChartProps {
  totalTokens: number;
  usedTokens: number;
}

const TokenUsageChart = ({ totalTokens, usedTokens }: TokenUsageChartProps) => {
  const [renewalDate, setRenewalDate] = useState<Date | null>(null);
  const percentage = Math.min((usedTokens / totalTokens) * 100, 100);
  const remainingTokens = totalTokens - usedTokens;

  useEffect(() => {
    const fetchRenewalDate = async () => {
      if (!auth.currentUser) return;
      
      try {
        const tokenDoc = await getDoc(doc(db, 'tokenUsage', auth.currentUser.uid));
        if (tokenDoc.exists()) {
          const lastUpdated = new Date(tokenDoc.data().lastUpdated);
          setRenewalDate(addDays(lastUpdated, 30));
        }
      } catch (error) {
        console.error('Error fetching renewal date:', error);
      }
    };

    fetchRenewalDate();
  }, []);

  const getFormattedRenewalDate = () => {
    if (!renewalDate) return null;
    return format(renewalDate, "dd 'de' MMMM", { locale: ptBR });
  };

  const formattedRenewalDate = getFormattedRenewalDate();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700 font-medium">Uso de Tokens</span>
        <span className="text-sm text-green-600 font-semibold">{remainingTokens} restantes</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${100 - percentage}%` }}
        />
      </div>

      {formattedRenewalDate && (
        <div className="mt-2 text-xs text-gray-600">
          Renovação em {formattedRenewalDate}
        </div>
      )}

      <Link 
        to="/plans" 
        className="mt-3 block text-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
      >
        Atualizar plano
      </Link>
    </div>
  );
};

export default TokenUsageChart;