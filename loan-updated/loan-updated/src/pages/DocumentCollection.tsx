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
  const [businessForm, setBusinessForm] = useState({ businessName: '', businessType: '', businessLocation: '', industryCategory: '', annualRevenue: '', numberOfEmployees: '' });
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedFile>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputMode, setInputMode] = useState<'none' | 'business-form' | 'kyc-upload' | 'biz-upload' | 'summary'>('none');

  const addBotMessage = (text: string, component?: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text, component, timestamp: new Date() }]);
  };
  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now() + 'u', role: 'user', text, timestamp: new Date() }]);
  };

  useEffect(() => {
    // Restore progress if any
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
    if (step === 'welcome') {
      setTimeout(() => addBotMessage(`👋 Welcome${user?.name ? ', ' + user.name : ''}! To determine your eligibility for government schemes and business benefits, we need a few business documents.\n\nThis process takes about 5 minutes and your progress is saved automatically. Ready to begin?`), 300);
      setTimeout(() => setInputMode('none'), 400);
    } else if (step === 'business-info') {
      addBotMessage('📋 Let\'s start with your business information. Please fill in the details below:');
      setTimeout(() => setInputMode('business-form'), 400);
    } else if (step === 'kyc-docs') {
      addBotMessage('🪪 Great! Now let\'s collect your KYC documents. Please upload the following:');
      setTimeout(() => setInputMode('kyc-upload'), 400);
    } else if (step === 'business-docs') {
      addBotMessage('📂 Almost there! Now upload your business documents (upload what you have — you can skip optional ones):');
      setTimeout(() => setInputMode('biz-upload'), 400);
    } else if (step === 'summary') {
      addBotMessage('✅ Excellent! Here\'s a summary of everything you\'ve submitted. Please review and confirm:');
      setTimeout(() => setInputMode('summary'), 400);
    }
  }

  const handleWelcomeContinue = () => {
    addUserMessage("Let's get started!");
    setInputMode('none');
    setTimeout(() => { setCurrentStep('business-info'); triggerStep('business-info'); }, 400);
  };

  const handleBusinessFormSubmit = () => {
    const missing = Object.entries(businessForm).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length > 2) { addBotMessage('⚠️ Please fill in at least the required fields: Business Name, Type, and Location.'); return; }
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
    if (missing.length > 0) { addBotMessage(`⚠️ Please upload at least your Aadhaar Card and PAN Card to continue.`); return; }
    const uploaded = Object.keys(uploadedDocs).filter(k => ['aadhaar','pan','addressProof','bankDetails'].includes(k));
    addUserMessage(`KYC documents uploaded: ${uploaded.join(', ')}`);
    setInputMode('none');
    setTimeout(() => { setCurrentStep('business-docs'); triggerStep('business-docs'); }, 500);
  };

  const handleBizDocsContinue = () => {
    const uploaded = Object.keys(uploadedDocs).filter(k => ['gstCertificate','udyamRegistration','msmeRegistration','businessLicense','incorporationCertificate'].includes(k));
    if (uploaded.length === 0) { addBotMessage('⚠️ Please upload at least one business document to continue.'); return; }
    addUserMessage(`Business documents uploaded: ${uploaded.join(', ')}`);
    setInputMode('none');
    setTimeout(() => { setCurrentStep('summary'); triggerStep('summary'); }, 500);
  };

  const handleConfirm = () => {
    addUserMessage('I confirm all information is correct.');
    setInputMode('none');
    updateUser({ onboarded: true });
    setTimeout(() => {
      addBotMessage('🎉 Profile complete! Redirecting you to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 500);
  };

  const progressPct = Math.round((STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-950/90 backdrop-blur-xl border-b border-dark-800 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center"><span className="text-black text-sm font-bold">N</span></div>
            <span className="font-bold text-white text-sm">Document Collection</span>
          </div>
          <span className="text-xs text-dark-400">{progressPct}% complete</span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-1.5">
          <motion.div className="bg-brand-500 h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="flex justify-between mt-1.5">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-[9px] uppercase tracking-wider ${STEPS.indexOf(currentStep) >= i ? 'text-brand-400' : 'text-dark-600'}`}>
              {s.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'bot' ? 'bg-brand-500/20 border border-brand-500/30' : 'bg-dark-700'}`}>
                {msg.role === 'bot' ? <Bot className="w-4 h-4 text-brand-400" /> : <User className="w-4 h-4 text-dark-300" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === 'bot' ? 'bg-dark-800 text-dark-100 rounded-tl-sm' : 'bg-brand-500/20 text-white border border-brand-500/30 rounded-tr-sm'}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Interactive Input Areas */}
        <AnimatePresence>
          {inputMode === 'none' && currentStep === 'welcome' && messages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
              <Button onClick={handleWelcomeContinue} className="gap-2">Let's Begin <ChevronRight className="w-4 h-4" /></Button>
            </motion.div>
          )}

          {inputMode === 'business-form' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800/60 border border-dark-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-semibold text-white">Business Information</span>
              </div>
              {[
                { key: 'businessName', label: 'Business Name *', placeholder: 'e.g. Sharma Enterprises' },
                { key: 'businessType', label: 'Business Type *', placeholder: 'e.g. Private Limited, Proprietorship' },
                { key: 'businessLocation', label: 'Business Location *', placeholder: 'e.g. Mumbai, Maharashtra' },
                { key: 'industryCategory', label: 'Industry Category', placeholder: 'e.g. Manufacturing, Services, Retail' },
                { key: 'annualRevenue', label: 'Annual Revenue', placeholder: 'e.g. ₹50 Lakhs' },
                { key: 'numberOfEmployees', label: 'Number of Employees', placeholder: 'e.g. 25' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-dark-400 mb-1 block">{label}</label>
                  <input
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 h-10 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder={placeholder}
                    value={(businessForm as any)[key]}
                    onChange={e => setBusinessForm(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <Button onClick={handleBusinessFormSubmit} className="w-full mt-2">Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </motion.div>
          )}

          {inputMode === 'kyc-upload' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800/60 border border-dark-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-semibold text-white">KYC Documents</span>
                <span className="text-xs text-dark-500 ml-auto">* = Required</span>
              </div>
              {[
                { key: 'aadhaar', label: 'Aadhaar Card *' },
                { key: 'pan', label: 'PAN Card *' },
                { key: 'addressProof', label: 'Address Proof' },
                { key: 'bankDetails', label: 'Bank Account Details' },
              ].map((item) => (
                <FileUploadZone key={item.key} docKey={item.key} label={item.label} onUpload={handleDocUpload} uploaded={!!uploadedDocs[item.key]} />
              ))}
              <Button onClick={handleKycContinue} className="w-full mt-2">Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </motion.div>
          )}

          {inputMode === 'biz-upload' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800/60 border border-dark-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-semibold text-white">Business Documents</span>
                <span className="text-xs text-dark-500 ml-auto">Upload what you have</span>
              </div>
              {[
                { key: 'gstCertificate', label: 'GST Certificate' },
                { key: 'udyamRegistration', label: 'UDYAM Registration' },
                { key: 'msmeRegistration', label: 'MSME Registration' },
                { key: 'businessLicense', label: 'Business License' },
                { key: 'incorporationCertificate', label: 'Incorporation Certificate' },
              ].map((item) => (
                <FileUploadZone key={item.key} docKey={item.key} label={item.label} onUpload={handleDocUpload} uploaded={!!uploadedDocs[item.key]} />
              ))}
              <Button onClick={handleBizDocsContinue} className="w-full mt-2">Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </motion.div>
          )}

          {inputMode === 'summary' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800/60 border border-dark-700 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-semibold text-white">Verification Summary</span>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Business Info</div>
                {Object.entries(businessForm).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-dark-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-dark-700 pt-3">
                <div className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Documents</div>
                {Object.keys(uploadedDocs).map(k => (
                  <div key={k} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span className="text-dark-200 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleConfirm} className="w-full bg-brand-500 text-black hover:bg-brand-400 font-bold">
                Confirm & Complete Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
