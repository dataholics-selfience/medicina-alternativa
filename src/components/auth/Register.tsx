import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Heart, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    crm: '',
    company: '',
    email: '',
    phone: '',
    password: '',
    terms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Scroll para o topo quando o componente for montado
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const checkDeletedUser = async (email: string) => {
    const q = query(
      collection(db, 'deletedUsers'),
      where('email', '==', email.toLowerCase().trim())
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const validateCRM = (crm: string) => {
    // Remove caracteres não numéricos
    const cleanCRM = crm.replace(/\D/g, '');
    // CRM deve ter entre 4 e 6 dígitos
    return cleanCRM.length >= 4 && cleanCRM.length <= 6;
  };

  const formatPhoneForWhatsApp = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se já começa com 55, retorna como está
    if (cleanPhone.startsWith('55')) {
      return cleanPhone;
    }
    
    // Se tem 11 dígitos (celular com DDD), adiciona 55
    if (cleanPhone.length === 11) {
      return '55' + cleanPhone;
    }
    
    // Se tem 10 dígitos (telefone fixo com DDD), adiciona 55
    if (cleanPhone.length === 10) {
      return '55' + cleanPhone;
    }
    
    // Se tem 9 dígitos (celular sem DDD), assume DDD 11 (São Paulo)
    if (cleanPhone.length === 9) {
      return '5511' + cleanPhone;
    }
    
    // Se tem 8 dígitos (fixo sem DDD), assume DDD 11 (São Paulo)
    if (cleanPhone.length === 8) {
      return '5511' + cleanPhone;
    }
    
    // Para outros casos, retorna o número limpo
    return cleanPhone;
  };

  const sendWhatsAppVerification = async (user: any, verificationLink: string) => {
    try {
      const formattedPhone = formatPhoneForWhatsApp(formData.phone);
      const firstName = formData.name.split(' ')[0];
      
      const whatsappMessage = `Olá, ${firstName}! 🌿

Bem-vindo(a) à plataforma de Medicina Integrativa!

Para ativar sua conta, clique no link abaixo:
${verificationLink}

Após a ativação, você terá acesso a:
✨ Consultas de medicina integrativa
🌱 Tratamentos holísticos personalizados
💚 Planos de cura natural

Qualquer dúvida, estamos aqui para ajudar!

Medicina Integrativa - Cura através da sabedoria ancestral`;

      const evolutionPayload = {
        number: formattedPhone,
        text: whatsappMessage
      };

      console.log('Enviando WhatsApp para:', formattedPhone);
      console.log('Payload:', evolutionPayload);

      const response = await fetch('https://evolution-api-production-f719.up.railway.app/message/sendText/215D70C6CC83-4EE4-B55A-DE7D4146CBF1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': '215D70C6CC83-4EE4-B55A-DE7D4146CBF1'
        },
        body: JSON.stringify(evolutionPayload)
      });

      if (response.ok) {
        console.log('WhatsApp enviado com sucesso');
        
        // Registra o envio no Firestore para auditoria
        await setDoc(doc(collection(db, 'whatsappLogs'), crypto.randomUUID()), {
          userId: user.uid,
          userEmail: user.email,
          phone: formattedPhone,
          messageType: 'email_verification',
          sentAt: new Date().toISOString(),
          status: 'sent'
        });
      } else {
        const errorText = await response.text();
        console.error('Erro ao enviar WhatsApp:', errorText);
        
        // Registra o erro no Firestore
        await setDoc(doc(collection(db, 'whatsappLogs'), crypto.randomUUID()), {
          userId: user.uid,
          userEmail: user.email,
          phone: formattedPhone,
          messageType: 'email_verification',
          sentAt: new Date().toISOString(),
          status: 'failed',
          error: errorText
        });
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      
      // Registra o erro no Firestore
      await setDoc(doc(collection(db, 'whatsappLogs'), crypto.randomUUID()), {
        userId: user.uid,
        userEmail: user.email,
        phone: formatPhoneForWhatsApp(formData.phone),
        messageType: 'email_verification',
        sentAt: new Date().toISOString(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('Você precisa aceitar os termos de uso para continuar.');
      return;
    }

    if (!validateCRM(formData.crm)) {
      setError('CRM deve conter entre 4 e 6 dígitos.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Telefone/WhatsApp é obrigatório para receber o link de ativação.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const isDeleted = await checkDeletedUser(formData.email);
      if (isDeleted) {
        setError('Email e dados já excluídos da plataforma');
        setIsLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );
      const user = userCredential.user;

      const transactionId = crypto.randomUUID();
      const now = new Date();
      const expirationDate = new Date(now.setMonth(now.getMonth() + 1));

      const userData = {
        uid: user.uid,
        name: formData.name.trim(),
        cpf: formData.cpf.trim(),
        crm: formData.crm.trim(),
        company: formData.company.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        plan: 'Terapeuta Iniciante',
        acceptedTerms: true,
        createdAt: new Date().toISOString(),
        termsAcceptanceId: transactionId
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      await setDoc(doc(db, 'tokenUsage', user.uid), {
        uid: user.uid,
        email: formData.email.trim().toLowerCase(),
        plan: 'Terapeuta Iniciante',
        totalTokens: 100,
        usedTokens: 0,
        lastUpdated: new Date().toISOString(),
        expirationDate: expirationDate.toISOString()
      });

      await setDoc(doc(collection(db, 'gdprCompliance'), transactionId), {
        uid: user.uid,
        email: formData.email.trim().toLowerCase(),
        type: 'terms_acceptance',
        acceptedTerms: true,
        acceptedAt: new Date().toISOString(),
        transactionId
      });

      await setDoc(doc(collection(db, 'gdprCompliance'), crypto.randomUUID()), {
        uid: user.uid,
        email: formData.email.trim().toLowerCase(),
        type: 'registration',
        registeredAt: new Date().toISOString(),
        transactionId: crypto.randomUUID()
      });

      // Enviar email de verificação sem actionCodeSettings para evitar erro de domínio
      await sendEmailVerification(user);

      // Criar link de verificação manual para WhatsApp
      const verificationLink = `${window.location.origin}/verify-email`;

      // Enviar WhatsApp com o link de verificação
      await sendWhatsAppVerification(user, verificationLink);

      navigate('/verify-email');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso. Por favor, use outro email ou faça login.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido. Por favor, verifique o email informado.');
      } else if (error.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Erro ao criar conta. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Landing Page */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar ao início
          </Link>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart size={48} className="text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Medicina Integrativa</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Criar conta</h2>
          <p className="mt-2 text-gray-600">Registre-se para acessar tratamentos integrativos</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 text-center bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nome completo"
            />
            <input
              type="text"
              name="cpf"
              required
              value={formData.cpf}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="CPF"
            />
            <input
              type="text"
              name="crm"
              required
              value={formData.crm}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="CRM (apenas números)"
              maxLength={6}
            />
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Clínica/Consultório"
            />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Email"
            />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Telefone/WhatsApp (obrigatório para ativação)"
            />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Senha (mínimo 6 caracteres)"
              minLength={6}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                required
              />
              <label className="ml-2 block text-sm text-gray-700">
                Aceito os <Link to="/terms" target="_blank" className="text-green-600 hover:text-green-700 underline">termos de uso e política de privacidade</Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.terms}
            className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
              isLoading || !formData.terms ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-lg text-green-600 hover:text-green-700 font-medium">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;