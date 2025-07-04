import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Heart, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Scroll para o topo quando o componente for montado
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateInputs = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor, preencha todos os campos.');
      return false;
    }
    if (!validateEmail(trimmedEmail)) {
      setError('Por favor, insira um email válido.');
      return false;
    }
    if (trimmedPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      
      if (!validateInputs()) {
        return;
      }

      setIsLoading(true);

      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      const user = userCredential.user;
      if (!user) {
        throw new Error('No user data available');
      }

      if (!user.emailVerified) {
        await auth.signOut();
        setError('Por favor, verifique seu email antes de fazer login.');
        navigate('/verify-email');
        return;
      }

      setError('');
      navigate('/app', { replace: true });
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'auth/invalid-credential': 'Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.',
        'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
        'auth/too-many-requests': 'Muitas tentativas de login. Por favor, aguarde alguns minutos e tente novamente.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet e tente novamente.',
        'auth/invalid-email': 'O formato do email é inválido.',
        'auth/user-not-found': 'Não existe uma conta com este email.',
        'auth/wrong-password': 'Senha incorreta.',
      };

      setError(
        errorMessages[error.code] || 
        'Ocorreu um erro ao fazer login. Por favor, verifique suas credenciais e tente novamente.'
      );
      
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Faça seu login</h2>
          <p className="mt-2 text-gray-600">Acesse sua conta para consultar tratamentos</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 text-center bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Email"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Senha"
                disabled={isLoading}
                minLength={6}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Link 
              to="/forgot-password" 
              className="text-sm text-green-600 hover:text-green-700"
              tabIndex={isLoading ? -1 : 0}
            >
              Esqueceu a senha?
            </Link>
            <Link 
              to="/register" 
              className="text-lg text-green-600 hover:text-green-700 font-medium"
              tabIndex={isLoading ? -1 : 0}
            >
              Criar conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;