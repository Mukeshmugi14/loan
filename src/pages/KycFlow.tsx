import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Input } from '../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Fingerprint, Search, FileText, CheckCircle2, 
  Camera, FileBox, ScanFace, Lock, RefreshCcw, Building2, Zap, ArrowRight
} from 'lucide-react';

export default function KycFlow() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);

  // States
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [gst, setGst] = useState('');
  
  const [panVerified, setPanVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [selfieVerified, setSelfieVerified] = useState(false);
  const [ocrVerified, setOcrVerified] = useState(false);

  const simulateVerification = (callback: () => void, delay = 2000) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      callback();
    }, delay);
  };

  const currentStepData = [
    { title: "PAN Verification", icon: FileText, desc: "Verify identity with NSDL database" },
    { title: "Aadhaar eKYC", icon: Fingerprint, desc: "UIDAI offline XML processing" },
    { title: "GST Integration", icon: Building2, desc: "Retrieve business intelligence" },
    { title: "Liveness Check", icon: ScanFace, desc: "AI-powered biometric validation" },
    { title: "Document OCR", icon: FileBox, desc: "Automated statement extraction" },
    { title: "AI Fraud Review", icon: ShieldCheck, desc: "Validating trust vectors" }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        
        {/* Header Indicator */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 text-xs font-bold uppercase tracking-widest leading-none">RBI Compliant KYC</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Identity Verification</h1>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-white font-display tracking-tighter">0{step}</span>
            <span className="text-dark-400 font-bold">/06</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-900 h-1.5 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-brand-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        <Card className="bg-dark-900 border border-white/5 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-8 flex-1">
            <AnimatePresence mode="wait">
              {/* STEP 1: PAN */}
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-brand-400" /> Permanent Account Number
                    </h3>
                    <p className="text-sm text-dark-300">To establish primary financial identity, enter your business or personal PAN.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-dark-400">PAN Number</label>
                    <div className="relative">
                      <Input 
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                        placeholder="ABCDE1234F"
                        className={`font-mono text-xl tracking-[0.2em] h-14 uppercase ${panVerified ? 'border-brand-500 bg-brand-500/5 text-brand-400' : ''}`}
                        disabled={isVerifying || panVerified}
                        autoFocus
                      />
                      {panVerified && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <CheckCircle2 className="w-5 h-5 text-brand-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {!panVerified ? (
                    <Button 
                      className="w-full h-12 text-sm font-bold bg-white text-black hover:bg-brand-500 hover:text-white"
                      disabled={pan.length < 10 || isVerifying}
                      onClick={() => simulateVerification(() => setPanVerified(true))}
                    >
                      {isVerifying ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Ping NSDL Database'}
                    </Button>
                  ) : (
                    <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-brand-400 font-bold uppercase tracking-widest mb-1">Match Complete</p>
                        <p className="text-white text-sm font-medium">MSMERAISE INNOVATIONS PVT LTD</p>
                      </div>
                      <Button size="sm" onClick={() => setStep(2)}>Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: AADHAAR */}
              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-blue-400" /> Aadhaar eKYC (UIDAI)
                    </h3>
                    <p className="text-sm text-dark-300">Enter authorized representative Aadhaar for digital xml verification.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Aadhaar Number</label>
                    <div className="relative">
                      <Input 
                        value={aadhaar}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9A-Za-z ]/g, '').slice(0, 14);
                          setAadhaar(val);
                        }}
                        placeholder="XXXX XXXX XXXX"
                        className={`font-mono text-xl tracking-widest h-14 ${aadhaarVerified ? 'border-blue-500 bg-blue-500/5 text-blue-400' : ''}`}
                        disabled={isVerifying || aadhaarVerified || aadhaarOtpSent}
                        autoFocus
                      />
                      {aadhaarVerified && <CheckCircle2 className="w-5 h-5 text-blue-400 absolute right-4 top-1/2 -translate-y-1/2" />}
                    </div>
                  </div>

                  {aadhaarOtpSent && !aadhaarVerified && (
                    <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-dark-400">UIDAI OTP</label>
                       <Input
                         value={aadhaarOtp}
                         onChange={(e) => setAadhaarOtp(e.target.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 6))}
                         placeholder="000000"
                         className="font-mono text-xl tracking-[0.5em] h-14"
                         disabled={isVerifying}
                       />
                    </div>
                  )}

                  {!aadhaarVerified ? (
                    !aadhaarOtpSent ? (
                      <Button 
                        className="w-full h-12 text-sm font-bold"
                        disabled={aadhaar.replace(/\D/g, '').length < 12 || isVerifying}
                        onClick={() => simulateVerification(() => setAadhaarOtpSent(true), 1500)}
                      >
                        {isVerifying ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Request OTP'}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full h-12 text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={aadhaarOtp.length < 6 || isVerifying}
                        onClick={() => simulateVerification(() => setAadhaarVerified(true), 1500)}
                      >
                        {isVerifying ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
                      </Button>
                    )
                  ) : (
                    <Button className="w-full h-12" onClick={() => setStep(3)}>Proceed to Business Link</Button>
                  )}
                </motion.div>
              )}

              {/* STEP 3: GST */}
              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-400" /> GSTN Integration
                    </h3>
                    <p className="text-sm text-dark-300">Fetch business intelligence metrics securely.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-dark-400">GSTIN</label>
                    <div className="relative">
                      <Input 
                        value={gst}
                        onChange={(e) => setGst(e.target.value.toUpperCase().slice(0, 15))}
                        placeholder="27ABCDE1234F1Z5"
                        className={`font-mono text-lg tracking-widest h-14 uppercase ${gstVerified ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' : ''}`}
                        disabled={isVerifying || gstVerified}
                      />
                    </div>
                  </div>

                  {!gstVerified ? (
                    <Button 
                      className="w-full h-12"
                      disabled={gst.length < 15 || isVerifying}
                      onClick={() => simulateVerification(() => setGstVerified(true))}
                    >
                      {isVerifying ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Extract GST Data'}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 border border-indigo-500/30 rounded-xl bg-indigo-500/10">
                        <div className="flex justify-between text-sm mb-2"><span className="text-dark-300">Annual Return</span><span className="text-white font-medium">Verified Filing</span></div>
                        <div className="flex justify-between text-sm"><span className="text-dark-300">Entity Status</span><span className="text-green-400 font-medium tracking-wide">ACTIVE</span></div>
                      </div>
                      <Button className="w-full h-12 bg-white text-black hover:bg-brand-500 hover:text-white" onClick={() => setStep(4)}>Confirm & Proceed</Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: Liveness */}
              {step === 4 && (
                <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-dark-800 rounded-full mb-4">
                    <ScanFace className="w-12 h-12 text-brand-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Biometric Liveness Check</h3>
                  <p className="text-sm text-dark-300 mb-6">Position your face within the frame. Our AI matches this against Aadhaar identity profiles instantly.</p>
                  
                  {!selfieVerified ? (
                    <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-dashed border-dark-700 bg-dark-800 overflow-hidden group hover:border-brand-500 transition-colors cursor-pointer" onClick={() => simulateVerification(() => setSelfieVerified(true), 2500)}>
                       {isVerifying ? (
                         <div className="absolute inset-0 flex items-center justify-center bg-brand-500/20 backdrop-blur-sm">
                           <ScanFace className="w-12 h-12 text-brand-400 animate-pulse" />
                           <div className="absolute top-0 w-full h-2 bg-brand-400/50 blur-[2px] animate-[scan_2s_ease-in-out_infinite]" />
                         </div>
                       ) : (
                         <div className="absolute inset-0 flex flex-col items-center justify-center opacity-70 group-hover:opacity-100">
                           <Camera className="w-8 h-8 text-white mb-2" />
                           <span className="text-xs font-bold text-white">CLICK TO START</span>
                         </div>
                       )}
                    </div>
                  ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                      </div>
                      <Button className="w-full h-12" onClick={() => setStep(5)}>Proceed to OCR Setup</Button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 5: OCR Document Match */}
              {step === 5 && (
                 <motion.div key="5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <FileBox className="w-5 h-5 text-brand-400" /> Smart OCR Autofill
                    </h3>
                    <p className="text-sm text-dark-300 mb-6">Upload Bank Statements. AI will extract financial markers.</p>

                    <div 
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${isVerifying ? 'border-brand-500 bg-brand-500/5' : 'border-dark-700 hover:border-dark-500'}`}
                      onClick={() => !ocrVerified && simulateVerification(() => setOcrVerified(true), 3000)}
                    >
                      {!isVerifying && !ocrVerified && (
                        <div className="flex flex-col items-center">
                          <FileText className="w-10 h-10 text-dark-400 mb-3" />
                          <p className="text-white font-medium">Click to upload statement PDF</p>
                          <p className="text-xs text-dark-400 mt-1">Up to 6 months • Max 10MB</p>
                        </div>
                      )}
                      
                      {isVerifying && (
                        <div className="flex flex-col items-center">
                          <Zap className="w-10 h-10 text-brand-400 animate-bounce mb-3" />
                          <p className="text-brand-400 font-bold uppercase tracking-widest text-sm mb-2">Extracting Intelligence</p>
                          <div className="w-32 h-1 bg-dark-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 w-1/2 animate-pulse" />
                          </div>
                        </div>
                      )}

                      {ocrVerified && (
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="w-10 h-10 text-green-400 mb-3" />
                          <p className="text-white font-medium">6 Months Data Parsed</p>
                          <p className="text-xs text-brand-400 mt-1">Found optimal cashflow volume</p>
                        </div>
                      )}
                    </div>

                    {ocrVerified && (
                      <Button className="w-full h-12 mt-6" onClick={() => setStep(6)}>Final AI Verification</Button>
                    )}
                 </motion.div>
              )}

              {/* STEP 6: AI Fraud & Analytics */}
              {step === 6 && (
                <motion.div key="6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-6">
                  <div className="relative mb-8">
                     <div className="w-24 h-24 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                     <ShieldCheck className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    onAnimationComplete={() => {
                      setTimeout(() => navigate(`/apply/${loanId}/form`), 2500);
                    }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">Verifying Trust Vectors</h3>
                    <p className="text-brand-400 font-bold text-sm uppercase tracking-widest">Generating Application Form</p>
                    
                    <div className="mt-8 space-y-3 font-mono text-xs text-left max-w-xs mx-auto border border-dark-800 bg-dark-950 p-4 rounded-xl">
                      <p className="text-dark-400">{'>'} Identity Hash ... <span className="text-green-400">Match</span></p>
                      <p className="text-dark-400">{'>'} GST Turnover ... <span className="text-green-400">Verified</span></p>
                      <p className="text-dark-400">{'>'} Fraud Score ... <span className="text-green-400">0.02 (Safe)</span></p>
                    </div>
                  </motion.div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Secure Footer */}
          <div className="px-8 py-4 bg-dark-950/50 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-medium text-dark-400">
            <Lock className="w-3 h-3" /> 256-bit AES End-to-End Encryption
          </div>
        </Card>
      </div>

      {/* Button to cancel/exit */}
      <Button variant="ghost" className="absolute top-6 right-6 text-dark-400 hover:text-white" onClick={() => navigate(-1)}>
        Exit Process
      </Button>
    </div>
  );
}

