import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Smartphone } from 'lucide-react';

export default function AuthPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(phone);
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 text-dark-950 font-display font-bold text-2xl">
            N
          </div>
        </div>

        <Card className="glass-panel p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-display font-bold text-white mb-2">Welcome to NeoFi AI</h1>
                  <p className="text-dark-300 text-sm">Enter your mobile number to get started. No KYC required yet.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dark-200">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Smartphone className="h-5 w-5 text-dark-400" />
                      </div>
                      <Input 
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-12"
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={phone.length < 10 || isLoading}>
                    {isLoading ? 'Sending OTP...' : 'Continue'}
                  </Button>
                </form>

                <div className="mt-8 flex items-center justify-center space-x-4">
                  <div className="flex-1 h-px bg-dark-800" />
                  <span className="text-xs text-dark-400 uppercase tracking-wider">or continue with</span>
                  <div className="flex-1 h-px bg-dark-800" />
                </div>
                
                <Button variant="secondary" className="w-full mt-6 bg-white text-dark-900 hover:bg-dark-100 font-semibold border-transparent">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </Button>

                <Button 
                  type="button"
                  onClick={() => {
                    login('9999999999');
                    navigate('/onboarding');
                  }}
                  variant="outline" 
                  className="w-full mt-4 text-brand-400 border-brand-500/30 hover:bg-brand-500/10"
                >
                  Quick Demo Login
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-display font-bold text-white mb-2">Verify Phone</h1>
                  <p className="text-dark-300 text-sm">Enter the 4-digit code sent to +91 {phone}</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {/* Simulated split inputs using a single input for simplicity in this demo, but styled normally */}
                    <Input 
                      type="text"
                      className="text-center tracking-[1em] font-mono text-xl"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      autoFocus
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={otp.length < 4 || isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify & Proceed'} <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  <div className="text-center">
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-brand-400 hover:text-brand-300">
                      Change mobile number
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
