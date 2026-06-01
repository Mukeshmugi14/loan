import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying -> creating -> done

  useEffect(() => {
    const code = searchParams.get('code');
    const name = searchParams.get('name') || 'Google User';
    const email = searchParams.get('email') || 'user@gmail.com';
    const picture = searchParams.get('picture') || 'https://api.dicebear.com/7.x/avataaars/svg';
    const id = searchParams.get('id') || 'google_' + Math.random().toString(36).substring(7);

    if (!code) {
      navigate('/auth');
      return;
    }

    // Step 1: Simulating code verification with Google Auth Server
    const timer1 = setTimeout(() => {
      setStatus('creating');
      
      // Step 2: Login Google user in AuthContext (creates token, user database record, updates last_login_at)
      loginWithGoogle({ id, name, email, picture });
    }, 1200);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    // Once status is 'creating' and the user object is set in our context, we set status to 'done'
    if (status === 'creating' && user) {
      setStatus('done');
    }
  }, [status, user]);

  useEffect(() => {
    if (status === 'done') {
      const timer = setTimeout(() => {
        if (user) {
          if (!user.onboarded) {
            navigate('/document-collection');
          } else {
            navigate('/dashboard');
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, user, navigate]);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md text-center space-y-8 relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="w-16 h-16 mx-auto rounded-full border-t-2 border-r-2 border-brand-400 flex items-center justify-center"
          >
            <ShieldCheck className="w-6 h-6 text-brand-400" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">Authenticating with Google</h2>
            
            <div className="h-10 overflow-hidden text-dark-400 font-mono text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
              {status === 'verifying' && <span>Verifying authorization code...</span>}
              {status === 'creating' && <span>Exchanging code for secure JWT...</span>}
              {status === 'done' && <span className="text-brand-400 font-semibold">Verification complete! Redirecting...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
