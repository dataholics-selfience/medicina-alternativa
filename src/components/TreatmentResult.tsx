import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Heart, Leaf, Sparkles, Brain, Zap, Palette, Waves, Eye, Flower, Mountain, Utensils, RotateCcw, AlertTriangle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { TreatmentResultType, UserType } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TreatmentResultProps {
  result: TreatmentResultType;
  caso: string;
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

const TreatmentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const { result, caso } = location.state as TreatmentResultProps;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserType);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const generatePDF = async () => {
    if (!userData || !result) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let yPosition = 30;

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PLANO DE TRATAMENTO HOLÍSTICO', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Dr(a). ${userData.name} - CRM: ${userData.crm}`, margin, yPosition);
      
      yPosition += 10;
      pdf.text(`Clínica: ${userData.company}`, margin, yPosition);
      
      yPosition += 10;
      pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
      
      yPosition += 20;
      
      // Disclaimer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 0, 0);
      const disclaimerText = 'IMPORTANTE: Este documento contém sugestões de medicina alternativa e não substitui tratamento médico alopático. Consulte sempre um médico qualificado.';
      const disclaimerLines = pdf.splitTextToSize(disclaimerText, pageWidth - 2 * margin);
      pdf.text(disclaimerLines, margin, yPosition);
      yPosition += disclaimerLines.length * 5 + 10;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      // Caso do paciente
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CASO DO PACIENTE:', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const casoLines = pdf.splitTextToSize(caso, pageWidth - 2 * margin);
      pdf.text(casoLines, margin, yPosition);
      yPosition += casoLines.length * 5 + 15;
      
      // Function to add new page if needed
      const checkPageBreak = (additionalHeight: number) => {
        if (yPosition + additionalHeight > pdf.internal.pageSize.height - 20) {
          pdf.addPage();
          yPosition = 30;
        }
      };
      
      // Function to add section
      const addSection = (title: string, items: any[]) => {
        if (items.length === 0) return;
        
        checkPageBreak(30);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        items.forEach((item, index) => {
          checkPageBreak(15);
          
          if (typeof item === 'string') {
            const lines = pdf.splitTextToSize(`• ${item}`, pageWidth - 2 * margin - 10);
            pdf.text(lines, margin + 5, yPosition);
            yPosition += lines.length * 5;
          } else if (item.planta || item.suplemento || item.pratica || item.medicamento || item.tecnologia || item.cor || item.oleo) {
            const name = item.planta || item.suplemento || item.pratica || item.medicamento || item.tecnologia || item.cor || item.oleo;
            const desc = item.descricao || '';
            
            pdf.setFont('helvetica', 'bold');
            const nameLines = pdf.splitTextToSize(`• ${name}`, pageWidth - 2 * margin - 10);
            pdf.text(nameLines, margin + 5, yPosition);
            yPosition += nameLines.length * 5;
            
            if (desc) {
              pdf.setFont('helvetica', 'normal');
              const descLines = pdf.splitTextToSize(`  ${desc}`, pageWidth - 2 * margin - 15);
              pdf.text(descLines, margin + 10, yPosition);
              yPosition += descLines.length * 5;
            }
          } else if (item.ponto) {
            pdf.setFont('helvetica', 'bold');
            const pointLines = pdf.splitTextToSize(`• ${item.ponto}`, pageWidth - 2 * margin - 10);
            pdf.text(pointLines, margin + 5, yPosition);
            yPosition += pointLines.length * 5;
            
            if (item.descricao) {
              pdf.setFont('helvetica', 'normal');
              const descLines = pdf.splitTextToSize(`  ${item.descricao}`, pageWidth - 2 * margin - 15);
              pdf.text(descLines, margin + 10, yPosition);
              yPosition += descLines.length * 5;
            }
          }
          
          yPosition += 3;
        });
        
        yPosition += 10;
      };

      // Add sections
      if (result.fitoterapia?.length > 0) {
        addSection('FITOTERAPIA', result.fitoterapia);
      }
      
      if (result.medicina_oriental?.diagnostico || result.medicina_oriental?.acupuntura?.length > 0 || result.medicina_oriental?.praticas?.length > 0) {
        checkPageBreak(30);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MEDICINA ORIENTAL', margin, yPosition);
        yPosition += 10;
        
        if (result.medicina_oriental.diagnostico) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Diagnóstico:', margin + 5, yPosition);
          yPosition += 7;
          pdf.setFont('helvetica', 'normal');
          const diagLines = pdf.splitTextToSize(result.medicina_oriental.diagnostico, pageWidth - 2 * margin - 10);
          pdf.text(diagLines, margin + 5, yPosition);
          yPosition += diagLines.length * 5 + 5;
        }
        
        if (result.medicina_oriental.acupuntura?.length > 0) {
          addSection('Pontos de Acupuntura:', result.medicina_oriental.acupuntura);
        }
        
        if (result.medicina_oriental.praticas?.length > 0) {
          addSection('Práticas:', result.medicina_oriental.praticas);
        }
      }
      
      if (result.medicina_ortomolecular?.length > 0) {
        addSection('MEDICINA ORTOMOLECULAR', result.medicina_ortomolecular);
      }
      
      if (result.medicina_antroposofica?.length > 0) {
        addSection('MEDICINA ANTROPOSÓFICA', result.medicina_antroposofica);
      }
      
      if (result.homeopatia?.length > 0) {
        addSection('HOMEOPATIA', result.homeopatia);
      }
      
      if (result.medicina_ayurvedica?.diagnostico || result.medicina_ayurvedica?.tratamentos?.length > 0) {
        checkPageBreak(30);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MEDICINA AYURVÉDICA', margin, yPosition);
        yPosition += 10;
        
        if (result.medicina_ayurvedica.diagnostico) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Diagnóstico:', margin + 5, yPosition);
          yPosition += 7;
          pdf.setFont('helvetica', 'normal');
          const diagLines = pdf.splitTextToSize(result.medicina_ayurvedica.diagnostico, pageWidth - 2 * margin - 10);
          pdf.text(diagLines, margin + 5, yPosition);
          yPosition += diagLines.length * 5 + 5;
        }
        
        if (result.medicina_ayurvedica.tratamentos?.length > 0) {
          addSection('Tratamentos:', result.medicina_ayurvedica.tratamentos);
        }
      }
      
      if (result.cura_xamanica?.length > 0) {
        addSection('CURA XAMÂNICA', result.cura_xamanica);
      }
      
      if (result.medicina_biofisica?.length > 0) {
        addSection('MEDICINA BIOFÍSICA', result.medicina_biofisica);
      }
      
      if (result.aparelhos_frequencia?.length > 0) {
        addSection('APARELHOS DE FREQUÊNCIA', result.aparelhos_frequencia);
      }
      
      if (result.cromoterapia?.length > 0) {
        addSection('CROMOTERAPIA', result.cromoterapia);
      }
      
      if (result.aromaterapia?.length > 0) {
        addSection('AROMATERAPIA', result.aromaterapia);
      }
      
      if (result.acupuntura?.length > 0) {
        addSection('ACUPUNTURA', result.acupuntura);
      }
      
      if (result.saberes_ancestrais?.length > 0) {
        addSection('SABERES ANCESTRAIS', result.saberes_ancestrais);
      }
      
      if (result.alimentacao?.indicada?.length > 0 || result.alimentacao?.contraindicada?.length > 0) {
        checkPageBreak(30);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ORIENTAÇÕES ALIMENTARES', margin, yPosition);
        yPosition += 10;
        
        if (result.alimentacao.indicada?.length > 0) {
          addSection('Alimentos Indicados:', result.alimentacao.indicada);
        }
        
        if (result.alimentacao.contraindicada?.length > 0) {
          addSection('Alimentos Contraindicados:', result.alimentacao.contraindicada);
        }
      }
      
      if (result.mudancas_rotina?.length > 0) {
        addSection('MUDANÇAS NA ROTINA', result.mudancas_rotina);
      }
      
      if (result.mensagem_final) {
        checkPageBreak(30);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MENSAGEM DE CUIDADO', margin, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        const msgLines = pdf.splitTextToSize(result.mensagem_final, pageWidth - 2 * margin);
        pdf.text(msgLines, margin, yPosition);
      }
      
      // Save PDF
      const fileName = `plano_tratamento_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!result || !userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-green-600 text-lg">Carregando resultado...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com informações do médico e disclaimer */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Botões de ação */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Voltar
            </button>
            
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
                isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Salvar em PDF
                </>
              )}
            </button>
          </div>
          
          {/* Título principal */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart size={32} className="text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Plano de Tratamento Holístico</h1>
            </div>
          </div>
          
          {/* Informações do médico */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Dr(a). {userData.name} - CRM: {userData.crm}
            </h2>
            <p className="text-gray-700">{userData.company}</p>
            <p className="text-sm text-gray-600 mt-2">
              Data: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle size={20} className="text-red-600" />
              <h3 className="font-bold text-red-800">IMPORTANTE</h3>
            </div>
            <p className="text-red-700 text-sm text-center">
              Este documento contém <strong>sugestões de medicina alternativa</strong> e não substitui tratamento médico alopático. 
              Consulte sempre um médico qualificado para diagnóstico e tratamento adequados.
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Caso do Paciente */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Caso do Paciente</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caso}</p>
        </div>

        {/* Seções de Tratamento */}
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
      </div>
    </div>
  );
};

export default TreatmentResult;