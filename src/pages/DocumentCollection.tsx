import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, CheckCircle2, ChevronRight, Bot, User, FileText, Building2, CreditCard, Briefcase, X } from 'lucide-react';

type MessageRole = 'bot' | 'user';
interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string;
  component?: React.ReactNode;
  timestamp: Date;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileUploadZoneProps {
  label: string;
  docKey: string;
  onUpload: (key: string, file: UploadedFile) => void;
  uploaded?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ label, docKey, onUpload, uploaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) return;
    const url = URL.createObjectURL(file);
    onUpload(docKey, { name: file.name, size: file.size, type: file.type, url });
  };

  return (
    <div
      onClick={() => !uploaded && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      className={`relative border-2 border-dashed rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer
        ${uploaded ? 'border-brand-500/50 bg-brand-500/5 cursor-default' : dragging ? 'border-brand-400 bg-brand-500/10' : 'border-dark-700 hover:border-dark-500 bg-dark-900/50'}`}
    >
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {uploaded ? (
        <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
      ) : (
        <Upload className="w-5 h-5 text-dark-400 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${uploaded ? 'text-brand-300' : 'text-dark-200'}`}>{label}</p>
        <p className="text-xs text-dark-500">{uploaded ? 'Uploaded ✓' : 'PDF, JPG, PNG · Click or drag'}</p>
      </div>
    </div>
  );
}

type Step = 'welcome' | 'business-info' | 'kyc-docs' | 'business-docs' | 'summary';
const STEPS: Step[] = ['welcome', 'business-info', 'kyc-docs', 'business-docs', 'summary'];

export default function DocumentCollection() {
  const { user, updateBusinessInfo, updateDocuments, updateUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  
  const [businessForm, setBusinessForm] = useState({ 
    businessName: '', 
    businessType: '', 
    businessLocation: '', 
    industryCategory: '', 
    annualRevenue: '', 
    numberOfEmployees: '' 
  });
  
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedFile>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [inputMode, setInputMode] = useState<'none' | 'business-form' | 'kyc-upload' | 'biz-upload' | 'summary'>('none');

  const addBotMessage = (text: string, component?: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text, component, timestamp: new Date() }]);
  };
  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now() + 'u', role: 'user', text, timestamp: new Date() }]);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Populate form if data exists in user context
    if (user?.businessInfo) {
      setBusinessForm({
        businessName: user.businessInfo.businessName || '',
        businessType: user.businessInfo.businessType || '',
        businessLocation: user.businessInfo.businessLocation || '',
        industryCategory: user.businessInfo.industryCategory || '',
        annualRevenue: user.businessInfo.annualRevenue || '',
        numberOfEmployees: user.businessInfo.numberOfEmployees || '',
      });
    }

    // Populate uploaded docs mapping from existing user context links
    if (user?.documents) {
      const mockDocs: Record<string, UploadedFile> = {};
      Object.entries(user.documents).forEach(([key, val]) => {
        if (val) {
          mockDocs[key] = {
            name: `${key.replace(/([A-Z])/g, '_')}_document.pdf`,
            size: 1024 * 1024 * 1.5,
            type: 'application/pdf',
            url: val as string,
          };
        }
      });
      setUploadedDocs(mockDocs);
    }

    // Restore step progress if saved previously
    const saved = user?.onboardingStep;
    const stepIdx = saved && saved < STEPS.length ? saved : 0;
    const step = STEPS[stepIdx];
    setCurrentStep(step);
    triggerStep(step, true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, inputMode]);

  function triggerStep(step: Step, initial = false) {
    if (!initial) updateUser({ onboardingStep: STEPS.indexOf(step) });
    
    const userName = user?.full_name || user?.email?.split('@')[0] || '';
    
    if (step === 'welcome') {
      setTimeout(() => addBotMessage(`👋 Welcome${userName ? ', ' + userName : ''}! To determine your eligibility for government schemes and discover the best business loan programs, we need a few business and KYC details.\n\nThis process takes about 5 minutes and your progress is saved automatically. Ready to begin?`), 300);
      setTimeout(() => setInputMode('none'), 400);
    } else if (step === 'business-info') {
      addBotMessage('📋 Let\'s start with your business information. Please fill in the details below:');
      setTimeout(() => setInputMode('business-form'), 400);
    } else if (step === 'kyc-docs') {
      addBotMessage('🪪 Great! Now let\'s collect your KYC details. Please upload the following:');
      setTimeout(() => setInputMode('kyc-upload'), 400);
    } else if (step === 'business-docs') {
      addBotMessage('📂 Almost there! Now let\'s gather your business documents. Upload what you have (you can skip optional ones):');
      setTimeout(() => setInputMode('biz-upload'), 400);
    } else if (step === 'summary') {
      addBotMessage('✅ Excellent! Here\'s a summary of the profile details and documents you\'ve submitted. Please review and confirm:');
      setTimeout(() => setInputMode('summary'), 400);
    }
  }

  const handleWelcomeContinue = () => {
    addUserMessage("Let's get started!");
    setInputMode('none');
    setTimeout(() => { setCurrentStep('business-info'); triggerStep('business-info'); }, 400);
  };

  const handleBusinessFormSubmit = () => {
    if (!businessForm.businessName || !businessForm.businessType || !businessForm.businessLocation) { 
      addBotMessage('⚠️ Please fill in all required fields: Business Name, Business Type, and Business Address/Location.'); 
      return; 
    }
    updateBusinessInfo(businessForm);
    addUserMessage(`Business: ${businessForm.businessName} | ${businessForm.businessType} | ${businessForm.businessLocation}`);
    setInputMode('none');
    setTimeout(() => { setCurrentStep('kyc-docs'); triggerStep('kyc-docs'); }, 500);
  };

  const handleDocUpload = (key: string, file: UploadedFile) => {
    setUploadedDocs(prev => ({ ...prev, [key]: file }));
    updateDocuments({ [key]: file.url } as any);
  };

  const handleKycContinue = () => {
    const required = ['aadhaar', 'pan'];
    const missing = required.filter(k => !uploadedDocs[k]);
    if (missing.length > 0) { 
      addBotMessage(`⚠️ Please upload at least your Aadhaar Card and PAN Card to proceed.`); 
      return; 
    }
    const uploaded = Object.keys(uploadedDocs).filter(k => ['aadhaar','pan','addressProof','bankDetails'].includes(k));
    addUserMessage(`KYC documents uploaded: ${uploaded.map(k => k.toUpperCase()).join(', ')}`);
    setInputMode('none');
    setTimeout(() => { setCurrentStep('business-docs'); triggerStep('business-docs'); }, 500);
  };

  const handleBizDocsContinue = () => {
    const uploaded = Object.keys(uploadedDocs).filter(k => ['gstCertificate','udyamRegistration','msmeRegistration','businessLicense','incorporationCertificate'].includes(k));
    if (uploaded.length === 0) { 
      addBotMessage('⚠️ Please upload at least one business registration document (e.g. GST Certificate, UDYAM registration) to verify your MSME status.'); 
      return; 
    }
    addUserMessage(`Business documents uploaded: ${uploaded.map(k => k.replace(/([A-Z])/g, ' $1').trim()).join(', ')}`);
    setInputMode('none');
    setTimeout(() => { setCurrentStep('summary'); triggerStep('summary'); }, 500);
  };

  const handleConfirm = () => {
    addUserMessage('I confirm all information is correct.');
    setInputMode('none');
    updateUser({ onboarded: true });
    setTimeout(() => {
      addBotMessage('🎉 Profile onboarding completed successfully! Redirecting you to your MSMERAISE command center...');
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 500);
  };

  const progressPct = Math.round((STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col max-w-2xl mx-auto border-x border-dark-800/40 relative">
      {/* Background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-950/90 backdrop-blur-xl border-b border-dark-800 px-4 py-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-display font-black text-black">M</div>
            <span className="font-bold text-white text-sm">MSMERAISE Onboarding</span>
          </div>
          <span className="text-xs text-brand-400 font-bold font-mono">{progressPct}% complete</span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
          <motion.div className="bg-gradient-to-r from-brand-500 to-cyan-500 h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="flex justify-between mt-2.5 px-0.5">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-[9px] font-bold uppercase tracking-wider ${STEPS.indexOf(currentStep) >= i ? 'text-brand-400' : 'text-dark-600'}`}>
              {s.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'bot' ? 'bg-brand-500/20 border border-brand-500/30' : 'bg-dark-700'}`}>
                {msg.role === 'bot' ? <Bot className="w-4.5 h-4.5 text-brand-400" /> : <User className="w-4.5 h-4.5 text-dark-300" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === 'bot' ? 'bg-dark-900 text-dark-100 rounded-tl-sm border border-dark-800/60' : 'bg-brand-500/10 text-white border border-brand-500/30 rounded-tr-sm'}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Interactive Input zones */}
        <AnimatePresence>
          {inputMode === 'none' && currentStep === 'welcome' && messages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end pt-2">
              <Button onClick={handleWelcomeContinue} className="gap-2 bg-brand-500 hover:bg-brand-400 text-black font-bold px-6 py-2.5">
                Let's Begin <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {inputMode === 'business-form' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-900/60 border border-dark-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-dark-800 pb-3 mb-2">
                <Building2 className="w-5 h-5 text-brand-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Business Entity Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'businessName', label: 'Business Name *', placeholder: 'e.g. Sharma Enterprises', colSpan: true },
                  { key: 'businessType', label: 'Business Type *', placeholder: 'e.g. Private Limited, Partnership' },
                  { key: 'businessLocation', label: 'Business Address/Location *', placeholder: 'e.g. Mumbai, Maharashtra' },
                  { key: 'industryCategory', label: 'Industry Category', placeholder: 'e.g. Manufacturing, Agro-processing' },
                  { key: 'annualRevenue', label: 'Annual Revenue / Turnover', placeholder: 'e.g. ₹50 Lakhs' },
                  { key: 'numberOfEmployees', label: 'Employee Count', placeholder: 'e.g. 25', colSpan: true },
                ].map(({ key, label, placeholder, colSpan }) => (
                  <div key={key} className={colSpan ? 'md:col-span-2' : ''}>
                    <label className="text-xs font-bold text-dark-300 mb-1.5 block uppercase tracking-wider">{label}</label>
                    <input
                      className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 h-11 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      placeholder={placeholder}
                      value={(businessForm as any)[key]}
                      onChange={e => setBusinessForm(prev => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleBusinessFormSubmit} className="w-full mt-4 bg-brand-500 hover:bg-brand-400 text-black font-bold h-11 rounded-xl">
                Continue Onboarding <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </motion.div>
          )}

          {inputMode === 'kyc-upload' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-900/60 border border-dark-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-dark-800 pb-3 mb-2">
                <CreditCard className="w-5 h-5 text-brand-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">KYC Information</span>
                <span className="text-xs text-dark-500 ml-auto">* = Required</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'aadhaar', label: 'Aadhaar Card (PDF/Image) *' },
                  { key: 'pan', label: 'PAN Card (PDF/Image) *' },
                  { key: 'addressProof', label: 'Address Proof (Utility Bill, Rent Agreement)' },
                  { key: 'bankDetails', label: 'Bank Details (Cancelled Cheque, Passbook)' },
                ].map((item) => (
                  <FileUploadZone key={item.key} docKey={item.key} label={item.label} onUpload={handleDocUpload} uploaded={!!uploadedDocs[item.key]} />
                ))}
              </div>
              <Button onClick={handleKycContinue} className="w-full mt-4 bg-brand-500 hover:bg-brand-400 text-black font-bold h-11 rounded-xl">
                Verify & Continue <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </motion.div>
          )}

          {inputMode === 'biz-upload' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-900/60 border border-dark-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-dark-800 pb-3 mb-2">
                <Briefcase className="w-5 h-5 text-brand-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Business Verification Documents</span>
                <span className="text-xs text-dark-500 ml-auto">Upload at least one *</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'gstCertificate', label: 'GST Registration Certificate' },
                  { key: 'udyamRegistration', label: 'Udyam Registration Certificate' },
                  { key: 'msmeRegistration', label: 'MSME Registration Certificate' },
                  { key: 'businessLicense', label: 'Trade/Business License' },
                  { key: 'incorporationCertificate', label: 'Certificate of Incorporation' },
                ].map((item) => (
                  <FileUploadZone key={item.key} docKey={item.key} label={item.label} onUpload={handleDocUpload} uploaded={!!uploadedDocs[item.key]} />
                ))}
              </div>
              <Button onClick={handleBizDocsContinue} className="w-full mt-4 bg-brand-500 hover:bg-brand-400 text-black font-bold h-11 rounded-xl">
                Verify & Continue <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </motion.div>
          )}

          {inputMode === 'summary' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-900/60 border border-dark-800 rounded-2xl p-5 space-y-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-dark-800 pb-3">
                <FileText className="w-5 h-5 text-brand-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Onboarding Summary</span>
              </div>
              
              <div className="space-y-2.5">
                <div className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">Business Entity Details</div>
                <div className="bg-dark-950/60 border border-dark-850 rounded-xl p-3.5 space-y-2">
                  {Object.entries(businessForm).filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-dark-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-white font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">Uploaded Verifications</div>
                <div className="bg-dark-950/60 border border-dark-850 rounded-xl p-3.5 space-y-2">
                  {Object.keys(uploadedDocs).map(k => (
                    <div key={k} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-4.5 h-4.5 text-brand-400 shrink-0" />
                      <span className="text-dark-200 capitalize font-medium">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/25 px-1.5 py-0.5 rounded-full font-bold ml-auto uppercase">Uploaded</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleConfirm} className="w-full bg-brand-500 hover:bg-brand-400 text-black font-bold h-12 rounded-xl transition-all shadow-lg shadow-brand-500/15">
                Confirm & Initialize Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
