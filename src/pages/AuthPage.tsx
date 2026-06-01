import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-form'; // Note: React Hook form was requested, will use 'react-hook-form' and 'zod'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authAPI } from '../api/auth';
import { useForm as useHookForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';

// --- Zod Schemas ---
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(32, 'Password cannot exceed 32 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[\W_]/, 'Must contain at least one special character');

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: passwordSchema,
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

type AuthMode = 'login' | 'signup' | 'otp' | 'forgot' | 'reset';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [signupData, setSignupData] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');

  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();

  // Setup forms
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useHookForm({ resolver: zodResolver(loginSchema) });
  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors, dirtyFields }, watch: watchSignup } = useHookForm({ resolver: zodResolver(signupSchema) });
  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useHookForm({ resolver: zodResolver(otpSchema) });
  const { register: registerForgot, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useHookForm({ resolver: zodResolver(forgotPasswordSchema) });
  const { register: registerReset, handleSubmit: handleResetSubmit, formState: { errors: resetErrors }, watch: watchReset } = useHookForm({ resolver: zodResolver(resetPasswordSchema) });

  const watchSignupPassword = watchSignup('password', '');
  const watchResetPassword = watchReset('newPassword', '');

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[a-z]/.test(pass)) strength += 25;
    if (/[0-9\W_]/.test(pass)) strength += 25;
    return strength;
  };

  const onLogin = async (data: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Login failed');
    }
    setIsLoading(false);
  };

  const onSignup = async (data: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await authAPI.sendOtp({ email: data.email, type: 'signup' });
      setSignupData(data);
      setMode('otp');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to send OTP');
    }
    setIsLoading(false);
  };

  const onOtpVerify = async (data: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const emailToVerify = mode === 'otp' ? signupData.email : resetEmail;
      const res = await authAPI.verifyOtp({ email: emailToVerify, otp: data.otp });
      const vToken = res.data.verifiedToken;
      
      if (signupData) {
        // Complete Signup
        await signup({ ...signupData, verifiedToken: vToken });
        navigate('/document-collection'); // Or dashboard based on requirements
      } else {
        // Continue to reset password
        setVerifiedToken(vToken);
        setMode('reset');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Invalid OTP');
    }
    setIsLoading(false);
  };

  const onForgot = async (data: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await authAPI.sendOtp({ email: data.email, type: 'forgot' });
      setResetEmail(data.email);
      setMode('otp');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to send reset email');
    }
    setIsLoading(false);
  };

  const onReset = async (data: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await authAPI.resetPassword({ email: resetEmail, newPassword: data.newPassword, verifiedToken });
      setMode('login');
      setErrorMsg('Password reset successfully. Please login.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to reset password');
    }
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Google login failed');
    }
    setIsLoading(false);
  };

  const InputField = ({ label, type = "text", register, error }: any) => (
    <div className="mb-4 text-left">
      <label className="block text-sm font-medium text-dark-300 mb-1">{label}</label>
      <input 
        type={type} 
        {...register} 
        className="w-full bg-dark-900/50 border border-dark-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );

  const PasswordStrengthMeter = ({ password }: { password: string }) => {
    const strength = calculatePasswordStrength(password);
    let colorClass = "bg-red-500";
    if (strength > 50) colorClass = "bg-yellow-500";
    if (strength > 75) colorClass = "bg-green-500";
    
    return (
      <div className="mt-2">
        <div className="w-full bg-dark-800 rounded-full h-1.5 mb-1">
          <div className={`h-1.5 rounded-full ${colorClass} transition-all duration-300`} style={{ width: `${strength}%` }}></div>
        </div>
        <p className="text-xs text-dark-400 text-right">Strength: {strength}%</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-dark-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 text-dark-950 font-display font-black text-3xl">
            M
          </div>
        </div>

        <Card className="glass-panel p-8 border border-dark-850 bg-dark-900/60 backdrop-blur-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-white mb-2">MSMERAISE</h1>
            <p className="text-brand-400 text-sm font-semibold tracking-wide uppercase">Financial Intelligence</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {errorMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <InputField label="Email" register={registerLogin('email')} error={loginErrors.email} />
              <InputField label="Password" type="password" register={registerLogin('password')} error={loginErrors.password} />
              <div className="text-right">
                <button type="button" onClick={() => setMode('forgot')} className="text-sm text-brand-400 hover:text-brand-300">Forgot Password?</button>
              </div>
              <button disabled={isLoading} className="w-full h-12 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all disabled:opacity-70">
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
              <div className="text-center mt-4">
                <span className="text-dark-400 text-sm">Don't have an account? </span>
                <button type="button" onClick={() => setMode('signup')} className="text-brand-400 text-sm font-semibold hover:text-brand-300">Sign Up</button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
              <InputField label="Full Name" register={registerSignup('fullName')} error={signupErrors.fullName} />
              <InputField label="Email" register={registerSignup('email')} error={signupErrors.email} />
              <InputField label="Mobile Number" register={registerSignup('phone')} error={signupErrors.phone} />
              <InputField label="Password" type="password" register={registerSignup('password')} error={signupErrors.password} />
              {watchSignupPassword && <PasswordStrengthMeter password={watchSignupPassword} />}
              <button disabled={isLoading} className="w-full h-12 mt-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all disabled:opacity-70">
                {isLoading ? 'Creating Account...' : 'Continue to Verify OTP'}
              </button>
              <div className="text-center mt-4">
                <span className="text-dark-400 text-sm">Already have an account? </span>
                <button type="button" onClick={() => setMode('login')} className="text-brand-400 text-sm font-semibold hover:text-brand-300">Log In</button>
              </div>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleOtpSubmit(onOtpVerify)} className="space-y-4 text-center">
              <p className="text-dark-300 text-sm mb-4">We've sent a 6-digit OTP to your email.</p>
              <InputField label="Enter OTP" register={registerOtp('otp')} error={otpErrors.otp} />
              <button disabled={isLoading} className="w-full h-12 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all disabled:opacity-70">
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => setMode('login')} className="mt-4 text-sm text-dark-400 hover:text-white">Cancel</button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit(onForgot)} className="space-y-4 text-center">
              <p className="text-dark-300 text-sm mb-4">Enter your email to receive a password reset OTP.</p>
              <InputField label="Email" register={registerForgot('email')} error={forgotErrors.email} />
              <button disabled={isLoading} className="w-full h-12 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all disabled:opacity-70">
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
              <button type="button" onClick={() => setMode('login')} className="mt-4 text-sm text-dark-400 hover:text-white">Back to Login</button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit(onReset)} className="space-y-4 text-center">
              <p className="text-dark-300 text-sm mb-4">Enter your new secure password.</p>
              <InputField label="New Password" type="password" register={registerReset('newPassword')} error={resetErrors.newPassword} />
              {watchResetPassword && <PasswordStrengthMeter password={watchResetPassword} />}
              <button disabled={isLoading} className="w-full h-12 mt-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all disabled:opacity-70">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-900 text-dark-400">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setErrorMsg('Google login failed');
                  }}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </>
          )}
          
          <div className="flex gap-2.5 mt-6 bg-dark-950/50 border border-dark-850 p-4 rounded-xl text-xs text-dark-400 leading-relaxed items-start">
            <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div>
              Secure authentication with real-time OTP validation. Protected against automated attacks.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
