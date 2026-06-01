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
  inprogress: { icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'In Progress', dot: 'bg-blue-500' },
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
        <motion.span className="text-3xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {value}%
        </motion.span>
        <span className="text-xs text-dark-400 mt-0.5">Complete</span>
      </div>
    </div>
  );
}

function getNextStepRecommendation(completion: ReturnType<ReturnType<typeof useAuth>['calculateCompletion']>) {
  if (completion.kycDocuments < 100) return { text: 'Complete your KYC to unlock scheme recommendations.', action: '/document-collection', cta: 'Upload KYC Documents' };
  if (completion.gstDocuments < 100) return { text: 'Upload GST Certificate to qualify for GST-linked schemes.', action: '/document-collection', cta: 'Upload GST Certificate' };
  if (completion.businessInfo < 100) return { text: 'Complete business information to receive accurate recommendations.', action: '/document-collection', cta: 'Complete Business Info' };
  if (completion.overall >= 80) return { text: 'Your profile is nearly complete! View eligible government schemes.', action: '/recommendations', cta: 'View Eligible Schemes' };
  return { text: 'Complete your profile to get the best loan recommendations.', action: '/document-collection', cta: 'Continue Setup' };
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
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Profile Completion</h1>
        <p className="text-dark-400 text-sm">Track your progress and unlock more government scheme recommendations.</p>
      </div>

      {/* Overall + Smart Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-6 flex flex-col items-center gap-4">
          <CircularProgress value={completion.overall} />
          <div className="text-center">
            <p className="text-white font-semibold text-lg">Profile Completion</p>
            <p className="text-dark-400 text-sm mt-1">{completed.length} of {categories.length} sections complete</p>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2">
            <motion.div className="bg-gradient-to-r from-brand-500 to-cyan-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${completion.overall}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-brand-500/10 to-cyan-500/5 border border-brand-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span className="text-sm font-semibold text-brand-300 uppercase tracking-wider">Smart Next Step</span>
            </div>
            <p className="text-white text-lg font-medium leading-relaxed">{recommendation.text}</p>
          </div>
          <Button onClick={() => navigate(recommendation.action)} className="mt-6 w-full gap-2 bg-brand-500 text-black hover:bg-brand-400">
            {recommendation.cta} <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Category Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-5">Completion Breakdown</h2>
        <div className="space-y-4">
          {categories.map((cat, i) => {
            const status = getStatus(cat.pct);
            const s = STATUS_ICONS[status];
            return (
              <motion.div key={cat.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.bg}`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark-200">{cat.label}</span>
                    <span className={`text-xs font-semibold ${s.color}`}>{cat.pct}%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-1.5">
                    <motion.div
                      className={`h-1.5 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'inprogress' ? 'bg-blue-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-dark-700'}`}
                      initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ duration: 0.8, delay: 0.1 * i }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className={`text-xs ${s.color} hidden sm:block`}>{s.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {missing.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Missing Documents</span>
            </div>
            <ul className="space-y-1.5">
              {missing.map(m => (
                <li key={m.key} className="text-xs text-red-400/80 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />{m.label}
                </li>
              ))}
            </ul>
            <Link to="/document-collection">
              <Button size="sm" variant="outline" className="mt-3 w-full border-red-500/30 text-red-400 text-xs">
                <Upload className="w-3 h-3 mr-1" /> Upload Missing
              </Button>
            </Link>
          </motion.div>
        )}

        {completed.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-300">Completed</span>
            </div>
            <ul className="space-y-1.5">
              {completed.map(c => (
                <li key={c.key} className="text-xs text-green-400/80 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-green-500 shrink-0" />{c.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-dark-900 border border-dark-800 rounded-xl p-4 space-y-2">
          <span className="text-sm font-semibold text-dark-200 block mb-2">Quick Actions</span>
          <Link to="/document-collection">
            <Button size="sm" variant="secondary" className="w-full justify-start text-xs gap-2 mb-2">
              <Upload className="w-3 h-3" /> Upload Documents
            </Button>
          </Link>
          <Link to="/profile">
            <Button size="sm" variant="secondary" className="w-full justify-start text-xs gap-2 mb-2">
              <Edit3 className="w-3 h-3" /> Edit Profile
            </Button>
          </Link>
          <Link to="/recommendations">
            <Button size="sm" variant="secondary" className="w-full justify-start text-xs gap-2">
              <Sparkles className="w-3 h-3" /> View Schemes
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-dark-400 border-t border-dark-800 pt-4">
        {Object.entries(STATUS_ICONS).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
