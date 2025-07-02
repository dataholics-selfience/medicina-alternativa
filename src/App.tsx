import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import EmailVerification from './components/auth/EmailVerification';
import AccountDeleted from './components/AccountDeleted';
import Plans from './components/Plans';
import UserManagement from './components/UserProfile/UserManagement';
import TreatmentResult from './components/TreatmentResult';
import LandingPage from './components/LandingPage';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().disabled) {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error('Error checking user status:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-green-600">Carregando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/app" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/app" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/app" replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/app" replace />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/account-deleted" element={<AccountDeleted />} />
        
        {/* Protected Routes */}
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/profile" element={user?.emailVerified ? <UserManagement /> : <Navigate to="/verify-email" replace />} />
        <Route path="/treatment-result" element={
          user?.emailVerified ? <TreatmentResult /> : <Navigate to="/verify-email" replace />
        } />
        <Route path="/app" element={
          user ? (
            user.emailVerified ? (
              <Layout />
            ) : (
              <Navigate to="/verify-email" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;