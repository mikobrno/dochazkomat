import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type UserRole = 'admin' | 'employee' | null;

export const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, isLoading } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    // Pre-fill email based on role for demo purposes
    if (role === 'admin') {
      setEmail('admin@firma.cz');
    } else if (role === 'employee') {
      setEmail('jan.novak@firma.cz');
    }
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Prosím vyberte svou roli');
      return;
    }

    if (!email || !password) {
      setError('Prosím vyplňte všechna pole');
      return;
    }
    
    const success = await login(email, password);
    if (!success) {
      setError('Neplatné přihlašovací údaje nebo neaktivní účet.');
    }
  };

  // Role Selection Step
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Evidence docházky
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Jako kdo přistupujete?
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Administrátor
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">
                    Test účet: admin@firma.cz
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('employee')}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Zaměstnanec
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">
                    Test účet: jan.novak@firma.cz
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500 space-y-2">
                <p className="font-medium">Testovací hesla:</p>
                <div className="space-y-1">
                  <p><strong>Administrátor:</strong> admin123</p>
                  <p><strong>Zaměstnanci:</strong> heslo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Form Step
  const roleTitle = selectedRole === 'admin' ? 'Administrátor' : 'Zaměstnanec';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Evidence docházky
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Přihlášení jako {roleTitle}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Role Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Přihlášení jako {roleTitle}
              </h3>
            </div>
            <button
              onClick={handleBackToRoleSelection}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Změnit roli
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="vas.email@firma.cz"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Heslo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Zadejte heslo"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Přihlašování...
                </>
              ) : (
                'Přihlásit se'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 space-y-2">
              <p className="font-medium">Testovací účty pro roli {roleTitle}:</p>
              <div className="space-y-1">
                {selectedRole === 'admin' ? (
                  <p><strong>Admin:</strong> admin@firma.cz / admin123</p>
                ) : (
                  <>
                    <p><strong>Jan Novák:</strong> jan.novak@firma.cz / heslo123</p>
                    <p><strong>Marie Svobodová:</strong> marie.svobodova@firma.cz / heslo123</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};