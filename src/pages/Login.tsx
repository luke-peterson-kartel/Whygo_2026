import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState, useContext } from 'react';
import { DevModeContext } from '@/contexts/DevModeContext';
import { Code } from 'lucide-react';

export function Login() {
  const { user, loading, error, signIn, devSignIn } = useAuth();
  const { isDevMode } = useContext(DevModeContext);
  const navigate = useNavigate();
  const [devEmail, setDevEmail] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (err) {
      // Error is handled in useAuth hook
    }
  };

  const handleDevSignIn = async () => {
    try {
      await devSignIn(devEmail);
    } catch (err) {
      // Error is handled in useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">WhyGo</h1>
          <p className="text-gray-600">Kartel AI Goal Management</p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-700">
            Sign in with your Kartel Google Workspace account
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error.message}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          {/* Dev Mode Login */}
          {isDevMode && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Dev Mode</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-yellow-700" />
                  <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
                    Dev Login
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="devEmail" className="block text-xs font-medium text-gray-700 mb-1">
                      Employee Email
                    </label>
                    <input
                      id="devEmail"
                      type="email"
                      value={devEmail}
                      onChange={(e) => setDevEmail(e.target.value)}
                      placeholder="employee.name@kartel.ai"
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && devEmail) {
                          handleDevSignIn();
                        }
                      }}
                    />
                  </div>

                  <button
                    onClick={handleDevSignIn}
                    disabled={loading || !devEmail}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Dev Login'}
                  </button>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-medium">Test Accounts:</p>
                    <div className="space-y-0.5 ml-2">
                      <p>• <button onClick={() => setDevEmail('emmet@kartel.ai')} className="text-blue-600 hover:underline">emmet@kartel.ai</button> (IC, Production)</p>
                      <p>• <button onClick={() => setDevEmail('noah.shields@kartel.ai')} className="text-blue-600 hover:underline">noah.shields@kartel.ai</button> (IC, Production)</p>
                      <p>• <button onClick={() => setDevEmail('kevin.reilly@kartel.ai')} className="text-blue-600 hover:underline">kevin.reilly@kartel.ai</button> (Executive)</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Only @kartel.ai accounts are authorized</p>
        </div>
      </div>
    </div>
  );
}
