import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const AccountDeleted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart size={48} className="text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Medicina Alternativa</h1>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Conta Apagada</h2>
          <p className="mt-2 text-gray-600">
            A conta associada ao email {email} foi apagada anteriormente.
            Para reativar sua conta, entre em contato com o administrador do sistema.
          </p>
        </div>

        <Link 
          to="/login"
          className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/login';
          }}
        >
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
};

export default AccountDeleted;