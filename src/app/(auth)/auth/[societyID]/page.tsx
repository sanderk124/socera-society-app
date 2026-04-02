'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [hasError, setHasError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { societyID } = useParams<{ societyID: string }>();

  useEffect(() => {
    if (error) {
      setHasError(true);
      setIsChecking(false);
      return;
    }

    fetch('/api/auth/health/keycloak')
      .then(res => res.json())
      .then(data => {
        if (data.available) {
          setIsChecking(false);
          signIn('keycloak', { callbackUrl: `/society/${societyID}/dashboard` });
        } else {
          setHasError(true);
          setIsChecking(false);
        }
      })
      .catch(() => {
        setHasError(true);
        setIsChecking(false);
      });
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-indigo-100">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Login niet beschikbaar</h2>
          <p className="text-gray-600 mb-4">
            De login service is momenteel niet bereikbaar. Probeer het later opnieuw.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Terug naar home
          </button>
        </div>
      </div>
    );
  }

  else {
      return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-700">
          {isChecking ? 'Checking login service...' : 'Redirecting to login...'}
        </p>
      </div>
    </div>
  );
  }
}