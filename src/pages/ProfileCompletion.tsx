import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, Upload, Edit3, Sparkles, ArrowRight } from 'lucide-react';

const STATUS_ICONS = {
  completed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Completed', dot: 'bg-green-500' },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending Review', dot: 'bg-yellow-500' },
  missing: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Missing', dot: 'bg-red-500' },
  inprogress: { icon: Sparkles, color: 'text-brand-400', bg: 'bg-brand-500/10', label: 'In Progress', dot: 'bg-brand-500' },
};

function getStatus(pct: number): keyof typeof STATUS_ICONS {
  if (pct === 100) return 'completed';
  if (pct >= 50) return 'inprogress';
  if (pct > 0) return 'pending';
  return 'missing';
}

function CircularProgress({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
        <motion.circle cx="64" cy="64" r={radius} fill="none" stroke="url(#grad)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-3xl font-bold text-white font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {value}%
        </motion.span>
        <span className="text-xs text-dark-400 mt-0.5 font-medium">Complete</span>
      </div>
    </div>
  );
}

function getNextStepRecommendation(completion: ReturnType<ReturnType<typeof useAuth>['calculateCompletion']>) {
  if (completion.kycDocuments < 100) return { text: 'Complete your KYC documents to unlock verified government scheme recommendation matching.', action: '/document-collection', cta: 'Upload KYC Documents' };
  if (completion.gstDocuments < 100) return { text: 'Upload your GST Certificate to qualify for GST-linked credit schemes.', action: '/document-collection', cta: 'Upload GST Certificate' };
  if (completion.businessInfo < 100) return { text: 'Complete your core business details to generate accurate eligibility scores.', action: '/document-collection', cta: 'Complete Business Info' };
  if (completion.overall >= 80) return { text: 'Your profile is complete! Discover qualified credit opportunities and government matching programs now.', action: '/recommendations', cta: 'View Opportunities' };
  return { text: 'Complete additional document verification steps to build your MSMERAISE Trust Profile.', action: '/document-collection', cta: 'Continue Setup' };
}

export default function ProfileCompletion() {
  const { user, calculateCompletion } = useAuth();
  const navigate = useNavigate();
  const completion = calculateCompletion();

  const categories = [
    { key: 'personalInfo', label: 'Personal Information', pct: completion.personalInfo },
    { key: 'businessInfo', label: 'Business Information', pct: completion.businessInfo },
    { key: 'kycDocuments', label: 'KYC Documents', pct: completion.kycDocuments },
    { key: 'gstDocuments', label: 'GST Documents', pct: completion.gstDocuments },
    { key: 'msmeRegistration', label: 'MSME Registration', pct: completion.msmeRegistration },
    { key: 'bankDetails', label: 'Bank Details', pct: completion.bankDetails },
    { key: 'eligibilityAssessment', label: 'Eligibility Assessment', pct: completion.eligibilityAssessment },
  ];

  const completed = categories.filter(c => c.pct === 100);
  const pending = categories.filter(c => c.pct > 0 && c.pct < 100);
  const missing = categories.filter(c => c.pct === 0);
  const recommendation = getNextStepRecommendation(completion);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 relative bg-dark-950 min-h-screen">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div>
        <h1 className="text-3xl font-display font-black text-white mb-2 uppercase tracking-wide">Verification Dashboard</h1>
        <p className="text-dark-400 text-sm">Track your document upload verification status and build your MSMERAISE Trust Rating.</p>
      </div>

      {/* Main Info widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-900/60 border border-dark-850 rounded-2xl p-6 flex flex-col items-center gap-4 backdrop-blur-xl">
          <CircularProgress value={completion.overall} />
          <div className="text-center">
            <p className="text-white font-bold text-lg">Overall Profile Rating</p>
            <p className="text-dark-400 text-sm mt-1 font-medium">{completed.length} of {categories.length} segments verified</p>
          </div>
          <div className="w-full bg-dark-950 border border-dark-850 rounded-full h-2 overflow-hidden mt-1">
            <motion.div className="bg-gradient-to-r from-brand-500 to-cyan-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${completion.overall}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-brand-500/10 to-cyan-500/5 border border-brand-500/20 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Recommended Next Step</span>
            </div>
            <p className="text-white text-lg font-medium leading-relaxed">{recommendation.text}</p>
          </div>
          <Button onClick={() => navigate(recommendation.action)} className="mt-8 w-full gap-2 bg-brand-500 hover:bg-brand-400 text-black font-bold h-11 rounded-xl">
            {recommendation.cta} <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Breakdowns */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-dark-900/60 border border-dark-850 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm border-b border-dark-850 pb-3">Entity Verification Details</h2>
        <div className="space-y-5">
          {categories.map((cat, i) => {
            const status = getStatus(cat.pct);
            const s = STATUS_ICONS[status];
            return (
              <motion.div key={cat.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-dark-200">{cat.label}</span>
                    <span className={`text-xs font-bold font-mono ${s.color}`}>{cat.pct}%</span>
                  </div>
                  <div className="w-full bg-dark-950 border border-dark-850 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-2 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'inprogress' ? 'bg-brand-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-dark-800'}`}
                      initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ duration: 0.8, delay: 0.08 * i }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-bold ${s.color} hidden sm:block uppercase tracking-wider`}>{s.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Actionable widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {missing.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3.5">
              <AlertCircle className="w-4.5 h-4.5 text-red-400" />
              <span className="text-sm font-bold text-red-300 uppercase tracking-wider">Required Items</span>
            </div>
            <ul className="space-y-2">
              {missing.map(m => (
                <li key={m.key} className="text-xs text-red-400/80 flex items-center gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />{m.label}
                </li>
              ))}
            </ul>
            <Link to="/document-collection">
              <Button size="sm" variant="outline" className="mt-4 w-full border-red-500/35 text-red-400 text-xs font-bold hover:bg-red-500/10 h-9 rounded-lg">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Missing Documents
              </Button>
            </Link>
          </motion.div>
        )}

        {completed.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-green-400" />
              <span className="text-sm font-bold text-green-300 uppercase tracking-wider">Verified Items</span>
            </div>
            <ul className="space-y-2">
              {completed.map(c => (
                <li key={c.key} className="text-xs text-green-400/80 flex items-center gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />{c.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-dark-900/60 border border-dark-850 rounded-2xl p-5 space-y-3.5">
          <span className="text-sm font-bold text-white block uppercase tracking-wider border-b border-dark-850 pb-2 mb-1">Quick Tasks</span>
          <Link to="/document-collection" className="block">
            <Button size="sm" variant="secondary" className="w-full justify-start text-xs font-bold gap-2.5 h-10 rounded-lg hover:bg-dark-800">
              <Upload className="w-4 h-4 text-brand-400" /> Upload Verification Documents
            </Button>
          </Link>
          <Link to="/profile" className="block">
            <Button size="sm" variant="secondary" className="w-full justify-start text-xs font-bold gap-2.5 h-10 rounded-lg hover:bg-dark-800">
              <Edit3 className="w-4 h-4 text-brand-400" /> Edit Executive Information
            </Button>
          </Link>
          <Link to="/recommendations" className="block">
            <Button size="sm" variant="secondary" className="w-full justify-start text-xs font-bold gap-2.5 h-10 rounded-lg hover:bg-dark-800">
              <Sparkles className="w-4 h-4 text-brand-400" /> View Eligible Schemes
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Legend footer */}
      <div className="flex flex-wrap gap-4 text-xs text-dark-400 border-t border-dark-850 pt-5 mt-4">
        {Object.entries(STATUS_ICONS).map(([key, s]) => (
          <div key={key} className="flex items-center gap-2 font-medium">
            <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
