import { useState } from 'react';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (mode === 'signup') {
    return <SignupForm onSwitchToLogin={() => setMode('login')} />;
  }

  return <LoginForm onSwitchToSignup={() => setMode('signup')} />;
}
