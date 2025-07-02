import { useState } from 'react';
import { Search, Loader2, Heart, Leaf, Sparkles, Brain, Zap, Palette, Waves, Eye, Flower, Mountain, Utensils, RotateCcw } from 'lucide-react';
import { TreatmentResultType, TokenUsageType } from '../types';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface MedicalConsultationProps {
  onConsultation: (caso: string, sessionId: string) => Promise<TreatmentResultType>;
  tokenUsage: TokenUsageType | null;
}

const TreatmentSection = ({ 
  title, 
  icon: Icon, 
  color, 
  children 
}: { 
  title: string; 
  icon: any; 
  color: string; 
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon size={24} className={color} />
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const MedicalConsultation = ({ onConsultation, tokenUsage }: MedicalConsultationProps) => {
  const [caso, setCaso] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TreatmentResultType | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caso.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const sessionId = uuidv4().replace(/-/g, '');
      const resultado = await onConsultation(caso.trim(), sessionId);
      setResult(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar tratamento');
    } finally {
      setIsLoading(false);
    }
  };

  const remainingTokens = tokenUsage ? tokenUsage.totalTokens - tokenUsage.usedTokens : 0;

  return (
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

        {isLoading && (
          <div className="text-center py-12">
            <Loader2 size={48} className="animate-spin text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analisando o caso</h3>
            <p className="text-gray-600">Consultando conhecimentos de medicina alternativa...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Fitoterapia */}
            {result.fitoterapia && result.fitoterapia.length > 0 && (
              <TreatmentSection title="Fitoterapia" icon={Leaf} color="text-green-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.fitoterapia.map((item, index) => (
                    <div key={index} className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">{item.planta}</h4>
                      <p className="text-green-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Medicina Oriental */}
            {result.medicina_oriental && (result.medicina_oriental.diagnostico || result.medicina_oriental.acupuntura?.length > 0 || result.medicina_oriental.praticas?.length > 0) && (
              <TreatmentSection title="Medicina Oriental" icon={Brain} color="text-purple-600">
                <div className="space-y-4">
                  {result.medicina_oriental.diagnostico && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Diagnóstico</h4>
                      <p className="text-purple-700">{result.medicina_oriental.diagnostico}</p>
                    </div>
                  )}
                  {result.medicina_oriental.acupuntura && result.medicina_oriental.acupuntura.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-3">Pontos de Acupuntura</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.medicina_oriental.acupuntura.map((item, index) => (
                          <div key={index} className="bg-purple-50 p-3 rounded-lg">
                            <h5 className="font-medium text-purple-800">{item.ponto}</h5>
                            <p className="text-purple-700 text-sm">{item.descricao}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.medicina_oriental.praticas && result.medicina_oriental.praticas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-3">Práticas Recomendadas</h4>
                      <ul className="space-y-2">
                        {result.medicina_oriental.praticas.map((pratica, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-purple-700">{pratica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TreatmentSection>
            )}

            {/* Medicina Ortomolecular */}
            {result.medicina_ortomolecular && result.medicina_ortomolecular.length > 0 && (
              <TreatmentSection title="Medicina Ortomolecular" icon={Zap} color="text-blue-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.medicina_ortomolecular.map((item, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">{item.suplemento}</h4>
                      <p className="text-blue-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Medicina Antroposófica */}
            {result.medicina_antroposofica && result.medicina_antroposofica.length > 0 && (
              <TreatmentSection title="Medicina Antroposófica" icon={Mountain} color="text-amber-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.medicina_antroposofica.map((item, index) => (
                    <div key={index} className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-2">{item.pratica}</h4>
                      <p className="text-amber-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Homeopatia */}
            {result.homeopatia && result.homeopatia.length > 0 && (
              <TreatmentSection title="Homeopatia" icon={Heart} color="text-pink-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.homeopatia.map((item, index) => (
                    <div key={index} className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-pink-800 mb-2">{item.medicamento}</h4>
                      <p className="text-pink-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Medicina Ayurvédica */}
            {result.medicina_ayurvedica && (result.medicina_ayurvedica.diagnostico || result.medicina_ayurvedica.tratamentos?.length > 0) && (
              <TreatmentSection title="Medicina Ayurvédica" icon={Sparkles} color="text-orange-600">
                <div className="space-y-4">
                  {result.medicina_ayurvedica.diagnostico && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Diagnóstico</h4>
                      <p className="text-orange-700">{result.medicina_ayurvedica.diagnostico}</p>
                    </div>
                  )}
                  {result.medicina_ayurvedica.tratamentos && result.medicina_ayurvedica.tratamentos.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-3">Tratamentos</h4>
                      <ul className="space-y-2">
                        {result.medicina_ayurvedica.tratamentos.map((tratamento, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-orange-700">{tratamento}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TreatmentSection>
            )}

            {/* Cura Xamânica */}
            {result.cura_xamanica && result.cura_xamanica.length > 0 && (
              <TreatmentSection title="Cura Xamânica" icon={Flower} color="text-emerald-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.cura_xamanica.map((item, index) => (
                    <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-emerald-800 mb-2">{item.pratica}</h4>
                      <p className="text-emerald-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Medicina Biofísica */}
            {result.medicina_biofisica && result.medicina_biofisica.length > 0 && (
              <TreatmentSection title="Medicina Biofísica" icon={Waves} color="text-cyan-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.medicina_biofisica.map((item, index) => (
                    <div key={index} className="bg-cyan-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-800 mb-2">{item.tecnologia}</h4>
                      <p className="text-cyan-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Aparelhos de Frequência */}
            {result.aparelhos_frequencia && result.aparelhos_frequencia.length > 0 && (
              <TreatmentSection title="Aparelhos de Frequência" icon={Zap} color="text-violet-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.aparelhos_frequencia.map((item, index) => (
                    <div key={index} className="bg-violet-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-violet-800 mb-2">{item.tecnologia}</h4>
                      <p className="text-violet-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Cromoterapia */}
            {result.cromoterapia && result.cromoterapia.length > 0 && (
              <TreatmentSection title="Cromoterapia" icon={Palette} color="text-rose-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.cromoterapia.map((item, index) => (
                    <div key={index} className="bg-rose-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-rose-800 mb-2">{item.cor}</h4>
                      <p className="text-rose-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Aromaterapia */}
            {result.aromaterapia && result.aromaterapia.length > 0 && (
              <TreatmentSection title="Aromaterapia" icon={Flower} color="text-indigo-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.aromaterapia.map((item, index) => (
                    <div key={index} className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-2">{item.oleo}</h4>
                      <p className="text-indigo-700 text-sm">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </TreatmentSection>
            )}

            {/* Acupuntura */}
            {result.acupuntura && result.acupuntura.length > 0 && (
              <TreatmentSection title="Acupuntura" icon={Brain} color="text-slate-600">
                <ul className="space-y-3">
                  {result.acupuntura.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </TreatmentSection>
            )}

            {/* Saberes Ancestrais */}
            {result.saberes_ancestrais && result.saberes_ancestrais.length > 0 && (
              <TreatmentSection title="Saberes Ancestrais" icon={Mountain} color="text-stone-600">
                <ul className="space-y-3">
                  {result.saberes_ancestrais.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-stone-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </TreatmentSection>
            )}

            {/* Alimentação */}
            {result.alimentacao && (result.alimentacao.indicada?.length > 0 || result.alimentacao.contraindicada?.length > 0) && (
              <TreatmentSection title="Orientações Alimentares" icon={Utensils} color="text-emerald-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.alimentacao.indicada && result.alimentacao.indicada.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-emerald-800 mb-3">Alimentos Indicados</h4>
                      <ul className="space-y-2">
                        {result.alimentacao.indicada.map((alimento, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-emerald-700">{alimento}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.alimentacao.contraindicada && result.alimentacao.contraindicada.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3">Alimentos Contraindicados</h4>
                      <ul className="space-y-2">
                        {result.alimentacao.contraindicada.map((alimento, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-red-700">{alimento}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TreatmentSection>
            )}

            {/* Mudanças na Rotina */}
            {result.mudancas_rotina && result.mudancas_rotina.length > 0 && (
              <TreatmentSection title="Mudanças na Rotina" icon={RotateCcw} color="text-teal-600">
                <ul className="space-y-3">
                  {result.mudancas_rotina.map((mudanca, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-teal-700">{mudanca}</span>
                    </li>
                  ))}
                </ul>
              </TreatmentSection>
            )}

            {/* Mensagem Final */}
            {result.mensagem_final && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mensagem de Cuidado</h3>
                <p className="text-gray-700 leading-relaxed italic">{result.mensagem_final}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalConsultation;