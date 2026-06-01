import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Circle, Clock, Activity, FileText, Bot, ShieldCheck, 
  ArrowRight, Landmark, UploadCloud, FileCheck, Check
} from 'lucide-react';

const TIMELINE = [
  { id: 'submitted', label: 'Application Submitted', date: 'Just now', status: 'completed' },
  { id: 'verification', label: 'AI KYC Verification', date: 'In Progress', status: 'current' },
  { id: 'review', label: 'Lender Underwriting', date: 'Pending', status: 'pending' },
  { id: 'approved', label: 'Final Sanction', date: '', status: 'pending' },
  { id: 'disbursed', label: 'Fund Disbursal', date: '', status: 'pending' },
];

export default function ApplicationTracker() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1); // 'verification' is index 1

  return (
    <div className="min-h-screen bg-[#05070a] p-6 lg:p-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
          <div>
            <div className="text-sm font-bold text-dark-400 mb-2 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" /> Live Application Status
            </div>
            <h1 className="text-3xl font-display font-medium text-white tracking-tight">Tracker: APP-{Math.floor(Math.random()*10000)}</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-dark-700 text-dark-300">
            Back to Dashboard
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Tracker Timeline */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-dark-900 border-white/5 p-8 relative overflow-hidden shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Application Journey</h2>
              
              <div className="relative border-l-2 border-dark-800 ml-4 space-y-10 py-2">
                {TIMELINE.map((stage, i) => {
                  const isCompleted = i < currentStage;
                  const isCurrent = i === currentStage;
                  
                  return (
                    <div key={stage.id} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full flex items-center justify-center border-2 ${
                        isCompleted ? 'bg-brand-500 border-brand-500' : 
                        isCurrent ? 'bg-dark-900 border-brand-500 animate-pulse' : 
                        'bg-dark-900 border-dark-700'
                      }`}>
                        {isCompleted && <Check className="w-3 h-3 text-dark-950 font-bold" />}
                      </div>

                      <div className={`transition-opacity duration-300 ${isCurrent || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                        <h3 className={`text-lg font-bold ${isCurrent ? 'text-brand-400' : 'text-white'}`}>{stage.label}</h3>
                        <p className="text-sm text-dark-400 font-medium mt-1">{stage.date}</p>
                        
                        {/* Current Stage Actions/Details */}
                        {isCurrent && stage.id === 'verification' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 bg-dark-800/50 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                              <Bot className="w-5 h-5 text-brand-400" />
                              <span className="text-sm font-medium text-white">NeoFi AI verifying submitted documents...</span>
                            </div>
                            <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-500 w-2/3 animate-pulse" />
                            </div>
                          </motion.div>
                        )}
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* AI Assistant Chat Context */}
            <Card className="bg-brand-950/20 border-brand-500/20 p-6 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-8 h-8 text-brand-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-brand-400 font-bold mb-1 uppercase tracking-widest text-xs">AI Assistant Live Support</h4>
                <p className="text-dark-200 text-sm">Your application documents look complete. Expect the lender underwriting to begin within 24 hours. The probability of final sanction remains High (96%).</p>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Analytics & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-gradient-to-br from-dark-800 to-dark-900 border-white/5 p-6">
              <p className="text-xs font-bold text-dark-400 uppercase tracking-widest mb-4">Application Details</p>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Landmark className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">HDFC Enterprise</h3>
                  <p className="text-sm text-dark-400">Working Capital</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-dark-400">Requested Amount</span>
                  <span className="text-sm font-bold text-white">₹ 2,50,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-dark-400">Expected Rate</span>
                  <span className="text-sm font-bold text-white">11.5% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-dark-400">Processing Fee</span>
                  <span className="text-sm font-bold text-white">1% (Waved)</span>
                </div>
              </div>
            </Card>

            <Card className="bg-dark-900 border-white/5 p-6">
              <p className="text-xs font-bold text-dark-400 uppercase tracking-widest mb-4">Verification Artifacts</p>
              <div className="space-y-3">
                {[
                  { name: 'Income Data (OCR)', status: 'Verified AI' },
                  { name: 'GST Returns (API)', status: 'Verified Gov' },
                  { name: 'PAN/Aadhaar Match', status: 'Secure Match' }
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50 border border-white/5">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-4 h-4 text-dark-300" />
                      <span className="text-sm text-white">{doc.name}</span>
                    </div>
                    <span className="text-xs font-bold text-green-400">{doc.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
