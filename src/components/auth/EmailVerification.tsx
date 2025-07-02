import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Heart } from 'lucide-react';

const EmailVerification = () => {
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (user.emailVerified) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            activated: true,
            activatedAt: new Date().toISOString(),
            email: user.email,
            uid: user.uid
          }, { merge: true });

          await setDoc(doc(db, 'gdprCompliance', 'emailVerified'), {
            uid: user.uid,
            email: user.email,
            emailVerified: true,
            verifiedAt: new Date().toISOString(),
            type: 'email_verification',
            transactionId: crypto.randomUUID()
          });

          navigate('/');
        } catch (error) {
          console.error('Error updating user activation:', error);
          setError('Erro ao ativar conta. Por favor, tente novamente.');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const sendWhatsAppVerification = async (user: any, verificationLink: string) => {
    try {
      // Buscar dados do usuário para obter o telefone
      const userDoc = doc(db, 'users', user.uid);
      const userData = await getDoc(userDoc);
      
      if (!userData.exists()) {
        console.error('Dados do usuário não encontrados');
        return;
      }

      const phone = userData.data().phone;
      const name = userData.data().name;
      
      if (!phone) {
        console.error('Telefone não encontrado nos dados do usuário');
        return;
      }

      const formatPhoneForWhatsApp = (phone: string): string => {
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (cleanPhone.startsWith('55')) {
          return cleanPhone;
        }
        
        if (cleanPhone.length === 11) {
          return '55' + cleanPhone;
        }
        
        if (cleanPhone.length === 10) {
          return '55' + cleanPhone;
        }
        
        if (cleanPhone.length === 9) {
          return '5511' + cleanPhone;
        }
        
        if (cleanPhone.length === 8) {
          return '5511' + cleanPhone;
        }
        
        return cleanPhone;
      };

      const formattedPhone = formatPhoneForWhatsApp(phone);
      const firstName = name.split(' ')[0];
      
      const whatsappMessage = `Olá, ${firstName}! 🌿

Reenvio do link de ativação da sua conta na Medicina Integrativa:

${verificationLink}

Clique no link acima para ativar sua conta e começar a usar nossa plataforma de medicina integrativa.

Medicina Integrativa - Cura através da sabedoria ancestral`;

      const evolutionPayload = {
        number: formattedPhone,
        text: whatsappMessage
      };

      const response = await fetch('https://evolution-api-production-f719.up.railway.app/message/sendText/215D70C6CC83-4EE4-B55A-DE7D4146CBF1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': '215D70C6CC83-4EE4-B55A-DE7D4146CBF1'
        },
        body: JSON.stringify(evolutionPayload)
      });

      if (response.ok) {
        console.log('WhatsApp reenviado com sucesso');
        
        await setDoc(doc(collection(db, 'whatsappLogs'), crypto.randomUUID()), {
          userId: user.uid,
          userEmail: user.email,
          phone: formattedPhone,
          messageType: 'email_verification_resend',
          sentAt: new Date().toISOString(),
          status: 'sent'
        });
      } else {
        const errorText = await response.text();
        console.error('Erro ao reenviar WhatsApp:', errorText);
      }
    } catch (error) {
      console.error('Erro ao reenviar WhatsApp:', error);
    }
  };

  const handleResendEmail = async () => {
    if (resendDisabled) return;

    try {
      if (auth.currentUser) {
        // Define known production domains
        const productionDomains = [
          'medicina-alternativa-ac0d5.firebaseapp.com',
          'genoi.net'
        ];
        
        const currentHostname = window.location.hostname;
        const isProductionDomain = productionDomains.includes(currentHostname);

        // Only use actionCodeSettings for verified production domains
        if (isProductionDomain) {
          const actionCodeSettings = {
            url: `${window.location.origin}/verify-email`,
            handleCodeInApp: true,
            iOS: {
              bundleId: 'com.medicina.integrativa'
            },
            android: {
              packageName: 'com.medicina.integrativa',
              installApp: true,
              minimumVersion: '12'
            },
            dynamicLinkDomain: 'medicina-integrativa.page.link'
          };

          await sendEmailVerification(auth.currentUser, actionCodeSettings);
        } else {
          // For development and other domains, use simple verification without actionCodeSettings
          await sendEmailVerification(auth.currentUser);
        }

        // Send WhatsApp notification
        try {
          const userDoc = doc(db, 'users', auth.currentUser.uid);
          const userData = await getDoc(userDoc);
          
          if (userData.exists()) {
            const phone = userData.data().phone;
            const name = userData.data().name;
            
            if (phone) {
              const formatPhoneForWhatsApp = (phone: string): string => {
                const cleanPhone = phone.replace(/\D/g, '');
                
                if (cleanPhone.startsWith('55')) {
                  return cleanPhone;
                }
                
                if (cleanPhone.length === 11) {
                  return '55' + cleanPhone;
                }
                
                if (cleanPhone.length === 10) {
                  return '55' + cleanPhone;
                }
                
                if (cleanPhone.length === 9) {
                  return '5511' + cleanPhone;
                }
                
                if (cleanPhone.length === 8) {
                  return '5511' + cleanPhone;
                }
                
                return cleanPhone;
              };

              const formattedPhone = formatPhoneForWhatsApp(phone);
              const firstName = name.split(' ')[0];
              
              const whatsappMessage = `Olá, ${firstName}! 🌿

Reenviamos o email de verificação para ativar sua conta na Medicina Integrativa.

Por favor, verifique seu email (incluindo a caixa de spam) e clique no link de ativação.

Medicina Integrativa - Cura através da sabedoria ancestral`;

              const evolutionPayload = {
                number: formattedPhone,
                text: whatsappMessage
              };

              await fetch('https://evolution-api-production-f719.up.railway.app/message/sendText/215D70C6CC83-4EE4-B55A-DE7D4146CBF1', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': '215D70C6CC83-4EE4-B55A-DE7D4146CBF1'
                },
                body: JSON.stringify(evolutionPayload)
              });

              await setDoc(doc(collection(db, 'whatsappLogs'), crypto.randomUUID()), {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                phone: formattedPhone,
                messageType: 'email_verification_resend',
                sentAt: new Date().toISOString(),
                status: 'sent'
              });
            }
          }
        } catch (whatsappError) {
          console.error('Error sending WhatsApp notification:', whatsappError);
          // Don't fail the entire operation if WhatsApp fails
        }

        setError('Email de verificação reenviado. Verifique também seu WhatsApp!');
        setResendDisabled(true);
        setCountdown(300);
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      if (error instanceof Error && error.message.includes('too-many-requests')) {
        setError('Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.');
        setResendDisabled(true);
        setCountdown(300);
      } else {
        setError('Erro ao reenviar email. Por favor, tente novamente.');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart size={48} className="text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Medicina Integrativa</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verifique seu email</h2>
          <p className="mt-2 text-gray-600">
            Por favor, verifique seu email para ativar sua conta. 
            Você também recebeu uma notificação no WhatsApp.
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-md border ${
            error.includes('reenviado') || error.includes('WhatsApp')
              ? 'bg-green-50 text-green-600 border-green-200'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Voltar para o login
          </button>

          <div className="text-center">
            <button
              onClick={handleResendEmail}
              disabled={resendDisabled}
              className="text-green-600 hover:text-green-700 text-lg"
            >
              {resendDisabled 
                ? `Aguarde ${formatTime(countdown)} para reenviar` 
                : 'Reenviar email de verificação'
              }
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            💡 <strong>Dica:</strong> Verifique também seu WhatsApp! Enviamos uma notificação por lá também.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;