import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Input } from '../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, CheckCircle2, Bot, ShieldCheck, Activity, ArrowRight,
  FileText, ShieldAlert, Check, RefreshCw, Smartphone, Building2,
  Landmark, Zap, Search, CreditCard, Lock
} from 'lucide-react';

const STEPS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'business', label: 'Business Details' },
  { id: 'financial', label: 'Financial Data' },
  { id: 'bank', label: 'Bank Linking' },
  { id: 'loan', label: 'Loan Specs' },
  { id: 'docs', label: 'Documents' },
  { id: 'consent', label: 'Consent' }
];

export default function ApplicationFlow() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  // Fake state for form completion
  const progress = Math.min(100, Math.round(((currentStep) / STEPS.length) * 100));

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setIsValidating(true);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate(`/applications/APP-9201/track`);
    }, 2500);
  };

  if (isValidating) {
    return (
      <div className="p-6 max-w-5xl mx-auto min-h-[80vh] py-12">
        <div className="mb-10 text-center">
           <div className="w-16 h-16 bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <Bot className="w-8 h-8 text-brand-400" />
           </div>
           <h1 className="text-3xl font-display font-bold text-white mb-2">Final AI Assessment & Review</h1>
           <p className="text-dark-300">Our engine is verifying your profile against 42+ macro-economic factors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-dark-900 border-white/5 p-6 space-y-6">
             <div className="flex items-center justify-between border-b border-dark-800 pb-4">
               <div>
                 <p className="text-xs font-bold text-dark-400 uppercase tracking-widest leading-none mb-1">Application Readiness</p>
                 <p className="text-3xl font-bold text-white tracking-tighter">100<span className="text-xl text-dark-400 font-medium">/100</span></p>
               </div>
               <div className="w-12 h-12 rounded-full border-4 border-green-500/50 flex items-center justify-center">
                 <Check className="w-6 h-6 text-green-400" />
               </div>
             </div>
             
             <div className="flex items-center justify-between border-b border-dark-800 pb-4">
               <div>
                 <p className="text-xs font-bold text-brand-400 uppercase tracking-widest leading-none mb-1">Approval Probability</p>
                 <p className="text-4xl font-bold text-brand-400 tracking-tighter">97<span className="text-xl font-medium">%</span></p>
               </div>
             </div>

             <div>
               <p className="text-xs font-bold text-dark-400 uppercase tracking-widest mb-3">AI Fraud Analysis</p>
               <div className="flex items-center gap-3 bg-dark-800 p-3 rounded-xl border border-white/5">
                 <ShieldCheck className="w-6 h-6 text-green-400" />
                 <div><p className="text-sm text-white font-medium">0.0% Variance</p><p className="text-xs text-dark-400">All data points match sources</p></div>
               </div>
             </div>
          </Card>

          <Card className="md:col-span-2 bg-gradient-to-br from-dark-800 to-dark-900 border-white/5 p-8 flex flex-col justify-between">
             <div>
               <h3 className="text-xl font-bold text-white mb-6">Financial Stability Vector</h3>
               
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-sm mb-2"><span className="text-dark-300">Debt-to-Income Tolerance</span><span className="text-green-400 font-medium">Optimal</span></div>
                   <div className="h-1.5 w-full bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[85%]" /></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2"><span className="text-dark-300">Cashflow Consistency (12M)</span><span className="text-brand-400 font-medium">Super Prime</span></div>
                   <div className="h-1.5 w-full bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-brand-500 w-[95%]" /></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2"><span className="text-dark-300">Missing/Pending Documents</span><span className="text-white font-medium">None</span></div>
                 </div>
               </div>
             </div>

             <div className="mt-10 pt-6 border-t border-white/5">
               <Button 
                onClick={handleFinalSubmit} 
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-bold bg-white text-black hover:bg-brand-500 hover:text-white transition-colors"
               >
                 {isSubmitting ? (
                   <span className="flex items-center justify-center gap-2">
                     <RefreshCw className="w-5 h-5 animate-spin" /> Submitting to Lender Network...
                   </span>
                 ) : (
                   <span className="flex items-center justify-center gap-2">
                     Submit Final Application <ArrowRight className="w-5 h-5" />
                   </span>
                 )}
               </Button>
               <p className="text-center text-xs text-dark-500 mt-4"><Lock className="w-3 h-3 inline mr-1" /> Bound by RBI Digital Lending Guidelines</p>
             </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Configure Application</h1>
            <p className="text-sm text-dark-400 font-medium flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand-400" /> AI Autofill Active
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold font-display tracking-tighter text-white">{progress}</span>
            <span className="text-xl font-bold text-dark-400">%</span>
          </div>
        </div>
        
        {/* Progress Tracker Horizontal */}
        <div className="relative">
          <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-500 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between mt-4 px-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:flex">
            {STEPS.map((step, idx) => (
              <span key={step.id} className={idx <= currentStep ? 'text-brand-400' : 'text-dark-500'}>
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Card className="bg-dark-900 border-white/5 p-8 relative overflow-hidden shadow-2xl">
             
            {/* Auto-save indicator */}
            <div className="absolute top-6 right-6 text-xs text-dark-400 flex items-center gap-1 font-medium bg-dark-800 px-3 py-1.5 rounded-full border border-white/5">
              <Activity className="w-3 h-3" /> Auto-saving to Cloud
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Personal */}
              {currentStep === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 pt-6">Proprietor Identity</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Full Legal Name</label>
                      <Input defaultValue="Ravi Sharma" className="h-12 bg-dark-800 border-white/5 focus:border-brand-500" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Date of Birth</label>
                      <Input defaultValue="14/08/1985" className="h-12 bg-dark-800 border-white/5" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Current Residential Address</label>
                      <Input defaultValue="A-45, Sector 4, Navnirman Vihar, Tech City, 560001" className="h-12 bg-dark-800 border-white/5" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Business */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 pt-6 flex items-center gap-2"><Building2 className="w-6 h-6 text-brand-400"/> Corporate Parameters</h2>
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 flex gap-3 mb-6">
                     <Bot className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                     <p className="text-sm text-brand-200">Data automatically synced & verified from GST Platform for optimal accuracy.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-400">Registered Entity Name</label>
                      <Input defaultValue="NEOFI INNOVATIONS PVT LTD" className="h-12 bg-brand-500/5 border-brand-500/30 text-brand-400 font-medium read-only focus:border-brand-500/30" readOnly />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Industry / Sector</label>
                      <Input defaultValue="SaaS / Enterprise Software" className="h-12 bg-dark-800 border-white/5" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Incorporation Vintage</label>
                      <Input defaultValue="2019 (5+ Years)" className="h-12 bg-dark-800 border-white/5" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Financials */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 pt-6 flex items-center gap-2"><Activity className="w-6 h-6 text-brand-400"/> Financial Metrics</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">FY 25 Annual Revenue</label>
                      <Input defaultValue="₹ 4,50,50,000" className="h-12 bg-dark-800 border-white/5 text-lg font-mono tracking-wider" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Net Profit Margin</label>
                      <Input defaultValue="18.5%" className="h-12 bg-dark-800 border-white/5 text-lg font-mono tracking-wider" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Existing EMIs (Monthly Obligation)</label>
                      <Input defaultValue="₹ 1,20,000" className="h-12 bg-dark-800 border-white/5 font-mono" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Bank */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 pt-6 flex items-center gap-2"><Landmark className="w-6 h-6 text-brand-400"/> Bank Settlement Link</h2>
                  
                  <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-brand-500/50 transition-colors cursor-pointer mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow p-2"><img src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" alt="HDFC" className="w-full h-full object-contain" /></div>
                      <div>
                         <p className="text-white font-bold text-lg">HDFC Current Acc</p>
                         <p className="text-dark-400 text-sm font-mono tracking-widest">**** **** 5921</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>

                  <Button variant="outline" className="w-full h-12 border-dashed border-dark-600 text-dark-300">
                     + Link Different Account
                  </Button>
                </motion.div>
              )}

              {/* STEP 5: Loan */}
              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 pt-6">Facility Configuration</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Required Sanction Amount</label>
                      <Input defaultValue="₹ 2,50,00,000" className="h-16 text-2xl font-bold tracking-tight bg-dark-800 border-white/5 focus:border-brand-500" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Tenure Selection</label>
                      <select className="w-full h-12 bg-dark-800 border-white/5 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                        <option>36 Months</option>
                        <option>24 Months</option>
                        <option>12 Months</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Primary Purpose</label>
                      <Input defaultValue="Inventory Expansion" className="h-12 bg-dark-800 border-white/5" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: Docs */}
              {currentStep === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 pt-6 flex items-center gap-2"><UploadCloud className="w-6 h-6 text-brand-400"/> Regulatory Documents</h2>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Last 3 Yrs ITR', status: 'Uploaded via OCR', stat: 'A' },
                      { name: 'Board Resolution', status: 'Verified AI Match', stat: 'A' },
                      { name: 'Udyam Certificate', status: 'Not Provided (Optional)', stat: 'O' }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-xl bg-dark-800 border border-white/5 hover:bg-dark-700/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <FileText className={`w-6 h-6 ${doc.stat === 'A' ? 'text-brand-400' : 'text-dark-400'}`} />
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">{doc.name}</p>
                            <p className="text-xs text-dark-400">{doc.status}</p>
                          </div>
                        </div>
                        {doc.stat === 'A' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <UploadCloud className="w-5 h-5 text-dark-500 group-hover:text-white" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 7: Consent */}
              {currentStep === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 pt-6">Agreements & Authorization</h2>
                  
                  <div className="bg-dark-800 border border-white/5 rounded-xl p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <input type="checkbox" className="mt-1 w-5 h-5 rounded border-dark-600 bg-dark-900 text-brand-500 focus:ring-brand-500 focus:ring-offset-dark-800 cursor-pointer" defaultChecked />
                      <div>
                        <p className="text-sm text-white font-medium mb-1">CIBIL & Bureau Inquiry Authorization</p>
                        <p className="text-xs text-dark-400 leading-relaxed">I/We hereby authorize NeoFi Platform and its partner banks to pull our credit bureau reports from CIBIL, Equifax, Experian for underwriting this facility.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <input type="checkbox" className="mt-1 w-5 h-5 rounded border-dark-600 bg-dark-900 text-brand-500 focus:ring-brand-500 focus:ring-offset-dark-800 cursor-pointer" defaultChecked />
                      <div>
                        <p className="text-sm text-white font-medium mb-1">E-mandate / NACH Auto-debit Consent</p>
                        <p className="text-xs text-dark-400 leading-relaxed">I/We agree to setup a digital mandate on the linked settlement account for EMI deductions on the scheduled due dates.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-500/10 border-l-4 border-brand-500 text-sm text-brand-200">
                    Your application acts as a digital footprint protected under the IT Act 2000. Ensure all submitted data is veracious.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center bg-dark-900 sticky bottom-0 z-10 w-full py-4">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep(prev => prev - 1)} 
                disabled={currentStep === 0 || isValidating}
                className="text-dark-400 hover:text-white"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={isValidating} 
                className="bg-white text-black hover:bg-brand-500 hover:text-white px-8 font-bold"
              >
                {currentStep === STEPS.length - 1 ? 'Execute AI Validation' : 'Save & Continue'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Floating Sidebar AI Panel */}
        <div className="hidden md:block md:col-span-4">
          <Card className="bg-brand-950/20 border-brand-500/20 p-6 sticky top-24">
             <div className="flex gap-3 mb-6">
               <Bot className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="font-bold text-white text-sm mb-1">NeoFi Assistant</p>
                 <p className="text-xs text-brand-200">
                   Your profile maturity unlocks a 24-hr fast-track underwriting SLA. 
                 </p>
               </div>
             </div>
             <div className="space-y-4 pt-4 border-t border-brand-500/20">
               <div className="flex justify-between items-center">
                 <span className="text-xs text-brand-300/60 font-bold uppercase tracking-widest">Expected Rate</span>
                 <span className="text-sm font-bold text-white">11.5%</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-brand-300/60 font-bold uppercase tracking-widest">Loan Line</span>
                 <span className="text-sm font-bold text-white">₹2.5Cr</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-brand-300/60 font-bold uppercase tracking-widest">Provider</span>
                 <span className="text-sm font-bold text-white">HDFC Bank</span>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
