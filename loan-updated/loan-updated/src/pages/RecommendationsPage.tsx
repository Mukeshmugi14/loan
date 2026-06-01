import { Card, Button } from '../components/ui';
import { ShieldCheck, Percent, Zap, ChevronRight, FileCheck, Landmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const RECOMMENDATIONS = [
  {
    id: "rec_1",
    lender: "HDFC Enterprise",
    type: "Working Capital",
    rate: "11.5% p.a.",
    amount: "₹25,000,000",
    chance: "96%",
    tenure: "36 Months",
    risk: "Low Risk",
    icon: Landmark,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: "rec_2",
    lender: "PMMY Scheme (Gov)",
    type: "Mudra Loan",
    rate: "9.2% p.a.",
    amount: "₹1,000,000",
    chance: "88%",
    tenure: "60 Months",
    risk: "V. Low Risk",
    icon: ShieldCheck,
    color: "text-brand-400",
    bg: "bg-brand-500/10"
  },
  {
    id: "rec_3",
    lender: "Razorpay Capital",
    type: "Revenue Based Financing",
    rate: "1.5% fixed fee",
    amount: "₹5,000,000",
    chance: "99%",
    tenure: "Flexible",
    risk: "Medium Risk",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  }
];

export default function RecommendationsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="mb-8 mt-4 md:mt-0">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Opportunity Matching</h1>
        <p className="text-dark-300">Your profile has been mapped to 12 eligible financial products.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-800 mb-8 overflow-x-auto scx">
        {['All Offers (12)', 'Business Loans (5)', 'Gov Schemes (4)', 'Credit Cards (3)'].map((tab, i) => (
          <button 
            key={tab}
            className={`pb-4 px-2 whitespace-nowrap text-sm font-medium transition-colors border-b-2 ${i === 0 ? 'text-brand-400 border-brand-400' : 'text-dark-400 border-transparent hover:text-dark-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RECOMMENDATIONS.map((rec, i) => (
          <motion.div 
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col group hover:border-dark-600 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rec.bg}`}>
                    <rec.icon className={`w-5 h-5 ${rec.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{rec.lender}</h3>
                    <p className="text-xs text-dark-400">{rec.type}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-brand-400 text-lg font-bold font-display">{rec.chance}</div>
                  <div className="text-[10px] text-dark-400 uppercase tracking-widest font-semibold">Approval</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 my-6 flex-1">
                <div>
                  <div className="text-xs text-dark-400 mb-1 flex items-center gap-1"><Percent className="w-3 h-3"/> Interest Rate</div>
                  <div className="text-sm font-medium text-white">{rec.rate}</div>
                </div>
                <div>
                  <div className="text-xs text-dark-400 mb-1">Max Amount</div>
                  <div className="text-sm font-medium text-white">{rec.amount}</div>
                </div>
                <div>
                  <div className="text-xs text-dark-400 mb-1">Tenure</div>
                  <div className="text-sm font-medium text-white">{rec.tenure}</div>
                </div>
                <div>
                  <div className="text-xs text-dark-400 mb-1">AI Risk Assessment</div>
                  <div className="text-sm font-medium text-white">{rec.risk}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-dark-800 mt-auto">
                <Button 
                  variant="secondary" 
                  className="w-full h-10 px-0"
                  onClick={() => navigate(`/recommendations/${rec.id}`)}
                >
                  Details
                </Button>
                <Button 
                  className="w-full h-10 px-0 bg-brand-500 hover:bg-brand-400"
                  onClick={() => navigate(`/apply/${rec.id}/kyc`)}
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
