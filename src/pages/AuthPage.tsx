import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { motion } from 'motion/react';
import { ShieldCheck, Info } from 'lucide-react';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate redirection to the Google OAuth consent page
    setTimeout(() => {
      const consentUrl = `/auth/consent?redirect_uri=${encodeURIComponent('/auth/callback')}`;
      navigate(consentUrl);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-dark-950">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          {/* MSMERAISE Icon Branding */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 text-dark-950 font-display font-black text-3xl">
            M
          </div>
        </div>

        <Card className="glass-panel p-8 border border-dark-850 bg-dark-900/60 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-white mb-2">MSMERAISE</h1>
            <p className="text-brand-400 text-sm font-semibold tracking-wide uppercase mb-3">Financial Intelligence</p>
            <p className="text-dark-300 text-sm leading-relaxed">
              Helping MSMEs Discover Government Opportunities
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 px-6 rounded-xl font-bold transition-all bg-white text-dark-950 hover:bg-dark-100 hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed border border-[#dadce0]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-dark-900 border-t-brand-500 rounded-full animate-spin" />
                  Connecting to Google...
                </span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5">
                    <path fill="#ea4335" d="M12 5.04c1.9 0 3.63.65 5 1.74l3.75-3.75C18.47 1.15 15.42 0 12 0 7.33 0 3.32 2.68 1.4 6.6l4.24 3.29C6.63 7.03 9.1 5.04 12 5.04z" />
                    <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2 3.7-4.96 3.7-8.62z" />
                    <path fill="#fbbc05" d="M5.64 14.88c-.24-.72-.37-1.49-.37-2.28s.13-1.56.37-2.28L1.4 7.03C.51 8.81 0 10.8 0 12.92s.51 4.11 1.4 5.89l4.24-3.93z" />
                    <path fill="#34a853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.73-2.89c-1.03.69-2.35 1.1-4.2 1.1-2.9 0-5.37-1.99-6.24-4.66L1.4 17.93C3.32 21.32 7.33 24 12 24z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            
            <div className="flex gap-2.5 bg-dark-950/50 border border-dark-850 p-4 rounded-xl text-xs text-dark-400 leading-relaxed items-start">
              <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                Secure single sign-on is enforced. No demo accounts or unprotected OTP accesses are permitted in this environment.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
