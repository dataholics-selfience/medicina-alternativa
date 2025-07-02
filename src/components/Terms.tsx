import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Terms = () => {
  const navigate = useNavigate();

  // Scroll para o topo quando o componente for montado
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <Heart size={32} className="text-green-600" />
            <span className="text-xl font-bold text-gray-900">Medicina Integrativa</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Termos de Uso da Plataforma de Aconselhamento Integrativo com IA
          </h1>
          <p className="text-gray-600 mb-8">Última atualização: 1º de julho de 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Seja bem-vindo(a) à nossa plataforma de aconselhamento em saúde integrativa com inteligência artificial. 
              Antes de utilizar nossos serviços, por favor leia atentamente os presentes Termos de Uso. 
              Ao utilizar esta plataforma, você concorda com todas as condições aqui descritas.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Objetivo da Plataforma</h2>
            <p className="text-gray-700 mb-4">
              Este software foi criado com o objetivo de fornecer aconselhamento complementar baseado em diversos sistemas terapêuticos não alopáticos, como:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-6">
              <li>Fitoterapia</li>
              <li>Medicina Tradicional Chinesa</li>
              <li>Medicina Ayurvédica</li>
              <li>Homeopatia</li>
              <li>Medicina Antroposófica</li>
              <li>Ortomolecular</li>
              <li>Cura Xamânica</li>
              <li>Aromaterapia</li>
              <li>Cromoterapia</li>
              <li>Medicina Biofísica</li>
              <li>Saberes Ancestrais</li>
              <li>Aparelhos de Frequência e outras práticas integrativas</li>
            </ul>
            <p className="text-gray-700 mb-6">
              As recomendações geradas são produzidas por um modelo de linguagem avançado (IA) e visam oferecer apoio ao raciocínio clínico ou terapêutico de profissionais habilitados.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Natureza do Conteúdo</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>A plataforma não realiza diagnósticos médicos e não substitui consultas com profissionais da saúde.</li>
              <li>As informações fornecidas têm caráter informativo e complementar, e devem ser interpretadas por profissionais capacitados, em conformidade com os princípios da medicina integrativa, ética e boas práticas clínicas.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Público-alvo</h2>
            <p className="text-gray-700 mb-4">A plataforma destina-se a:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Médicos, terapeutas, psicólogos e demais profissionais da saúde integrativa</li>
              <li>Pesquisadores ou estudantes de práticas não convencionais</li>
              <li>Pessoas interessadas em cuidados complementares, desde que com orientação profissional adequada</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Usuários sem formação clínica não devem aplicar diretamente as orientações sugeridas sem acompanhamento especializado.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Responsabilidade do Usuário</h2>
            <p className="text-gray-700 mb-4">
              O uso do software implica a total responsabilidade do usuário pela interpretação e aplicação dos conteúdos gerados, assumindo que:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Toda informação será avaliada em conjunto com outros recursos terapêuticos</li>
              <li>Nenhuma decisão crítica será tomada com base única no sistema</li>
              <li>O usuário respeita os princípios éticos e legais do seu país, respeitando os limites da prática clínica autorizada</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitações Tecnológicas</h2>
            <p className="text-gray-700 mb-4">
              A plataforma utiliza modelos de linguagem treinados até determinada data, baseando-se em bases de dados públicas, repertórios clássicos e instruções internas do modelo de IA.
            </p>
            <p className="text-gray-700 mb-6">
              Por esse motivo, as respostas podem conter imprecisões, interpretações culturais ou espirituais que não são universalmente aceitas. O sistema não tem acesso em tempo real a bancos científicos atualizados ou registros médicos oficiais.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Privacidade e Dados</h2>
            <p className="text-gray-700 mb-4">
              A plataforma não armazena nem processa dados pessoais de pacientes diretamente, salvo em ambientes controlados pelos próprios usuários ou parceiros que integram suas próprias bases de dados.
            </p>
            <p className="text-gray-700 mb-6">
              É de responsabilidade do usuário garantir que quaisquer informações sensíveis inseridas estejam de acordo com a LGPD (Lei Geral de Proteção de Dados) e com outras legislações de privacidade aplicáveis.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Propriedade Intelectual</h2>
            <p className="text-gray-700 mb-6">
              Todo o conteúdo gerado, interface da plataforma e tecnologia subjacente são de propriedade dos desenvolvedores do sistema, sendo vedada a reprodução não autorizada ou o uso comercial do conteúdo sem prévia autorização.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Atualizações e Interrupções</h2>
            <p className="text-gray-700 mb-6">
              O sistema está em constante evolução. Podemos suspender temporariamente o acesso para atualizações, testes ou melhoria da qualidade do serviço. A continuidade do uso implica aceitação automática de novas versões destes Termos.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Isenção de Garantias</h2>
            <p className="text-gray-700 mb-6">
              O software é fornecido "como está", sem garantias explícitas ou implícitas. Não garantimos cura, alívio completo de sintomas ou resultados clínicos específicos. As recomendações são baseadas em saberes tradicionais, populares e científicos complementares.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Foro e Legislação</h2>
            <p className="text-gray-700 mb-6">
              Em caso de eventual controvérsia, as partes elegem o foro da comarca de São Paulo/SP, com renúncia a qualquer outro, sendo aplicável a legislação brasileira.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <Heart size={24} className="text-green-600" />
                ✨ Considerações Finais
              </h2>
              <p className="text-green-700 leading-relaxed">
                Acreditamos que a tecnologia pode servir à cura e à consciência. Esta plataforma não substitui o cuidado humano, mas o amplia — com respeito, ética e visão integrativa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;