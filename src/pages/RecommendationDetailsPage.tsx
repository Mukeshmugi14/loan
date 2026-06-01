import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { motion } from 'motion/react';
import {
  ShieldCheck, ArrowLeft, Percent, Clock, Zap, Activity,
  LineChart, FileText, Bookmark, ArrowRight, Lock
} from 'lucide-react';

export default function RecommendationDetailsPage() {
  const { loanId } = useParams();
  const navigate = useNavigate();

  // Mock fetching data based on ID
  const loan = {
    id: loanId,
    lender: loanId === 'rec_2' ? 'PMMY Scheme (Gov)' : 'HDFC Enterprise',
    type: loanId === 'rec_2' ? 'Mudra Loan' : 'Working Capital',
    rate: '11.5%',
    amount: '₹2,50,00,000',
    chance: 96,
    tenure: '36 Months',
    emiEstimate: '₹8,24,000',
    tags: ['Pre-Approved', 'Low Risk', 'Fast Disbursal'],
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Matches
      </button>

      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">{loan.lender}</h1>
              <p className="text-dark-300 font-medium">{loan.type}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {loan.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-dark-800 text-dark-300 rounded border border-dark-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-dark-400 mb-1">AI Approval Probability</p>
            <div className="flex items-baseline gap-1 justify-end text-brand-400">
              <span className="text-4xl font-bold tracking-tighter">{loan.chance}</span>
              <span className="text-xl font-bold">%</span>
            </div>
          </div>
          {/* Circular progress equivalent */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-dark-800" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${loan.chance * 1.75} 175`} className="text-brand-500" strokeLinecap="round" />
            </svg>
            <span className="absolute text-brand-400 font-bold text-sm"><Zap className="w-4 h-4" /></span>
          </div>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Max Eligibility', value: loan.amount, sub: 'Based on GST flow' },
          { label: 'Interest Rate', value: `${loan.rate} p.a.`, sub: 'Reducing balance' },
          { label: 'Est. Monthly EMI', value: loan.emiEstimate, sub: 'For full amount' },
          { label: 'Repayment Tenure', value: loan.tenure, sub: 'Flexible pre-closure' }
        ].map((metric, i) => (
          <div key={i} className="bg-dark-900 rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-dark-400 font-medium mb-2">{metric.label}</p>
            <p className="text-xl font-bold text-white mb-1 tracking-tight">{metric.value}</p>
            <p className="text-xs text-dark-500">{metric.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-brand-950/20 to-dark-900 rounded-2xl p-6 border border-brand-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Zap className="w-32 h-32 text-brand-400" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-bold tracking-widest uppercase text-brand-400">MSMERAISE Recommendation Intelligence</h3>
            </div>
            <p className="text-white font-medium text-lg mb-4 leading-relaxed">
              Why this is your best match: Your strong GST consistency over the past 12 months triggers a 1.5% rate discount with {loan.lender}.
            </p>
            <ul className="space-y-3">
              {[
                'Liquidity ratio is optimal for a 36-month repayment cycle without straining operating capital.',
                'Interest rate is below the industry average of 14.5% for similar MSME profiles.',
                'No collateral required based on Tier-1 enterprise trust score.'
              ].map((insight, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3 h-3 text-brand-400" />
                  </div>
                  <span className="text-sm text-dark-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-dark-900 rounded-2xl p-6 border border-white/5">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-dark-400"/> Risk Analysis & Parameters</h3>
            <div className="space-y-6">
              {[
                { title: 'Credit Bureau Match', percent: 98, color: 'bg-green-500' },
                { title: 'Debt-to-Income Tolerance', percent: 85, color: 'bg-blue-500' },
                { title: 'Sector Risk Alignment', percent: 92, color: 'bg-brand-500' }
              ].map((risk, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-300">{risk.title}</span>
                    <span className="text-white font-medium">{risk.percent}%</span>
                  </div>
                  <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`${risk.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${risk.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-dark-900 rounded-2xl p-6 border border-white/5 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-2">Action Center</h3>
            <p className="text-sm text-dark-400 mb-6 pb-6 border-b border-dark-800">Review complete? Start your application in just a few clicks.</p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(`/apply/${loan.id}/kyc`)}
                className="w-full py-4 text-sm font-bold bg-white text-black hover:bg-brand-500 hover:text-white transition-colors group justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
              >
                Apply Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                <FileText className="w-4 h-4 mr-2" /> Compare Offers
              </Button>
              <Button variant="ghost" className="w-full justify-center border border-transparent shadow-none">
                <Bookmark className="w-4 h-4 mr-2" /> Save for Later
              </Button>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-dark-500 font-medium">
              <Lock className="w-3 h-3" /> Encrypted & Bank-Grade Secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
