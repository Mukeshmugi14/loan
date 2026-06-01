import { Card, Button } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, TrendingUp, Sparkles, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const CASHFLOW_DATA = [
  { month: 'Jan', inward: 4000, outward: 2400 },
  { month: 'Feb', inward: 3000, outward: 1398 },
  { month: 'Mar', inward: 2000, outward: 9800 },
  { month: 'Apr', inward: 2780, outward: 3908 },
  { month: 'May', inward: 1890, outward: 4800 },
  { month: 'Jun', inward: 2390, outward: 3800 },
  { month: 'Jul', inward: 3490, outward: 4300 },
];

export default function MainDashboard() {
  const { calculateCompletion } = useAuth();
  const completion = calculateCompletion();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Dynamic Profile Completion Reminder Banner */}
      {completion.overall < 100 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-brand-500/10 via-cyan-500/5 to-transparent border border-brand-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Boost Your Match Eligibility Rating</p>
              <p className="text-xs text-dark-400 mt-1">
                Your MSMERAISE profile is currently <span className="text-brand-400 font-bold">{completion.overall}% complete</span>. Uploading missing business verification documents will unlock direct loan channels.
              </p>
            </div>
          </div>
          <Link to="/profile/completion" className="shrink-0 w-full sm:w-auto">
            <Button size="sm" className="bg-brand-500 hover:bg-brand-400 text-black font-bold whitespace-nowrap w-full sm:w-auto h-9 px-4 rounded-lg">
              Complete Setup <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-4">
          <div className="h-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 blur-[80px] rounded-full" />
            <h3 className="text-dark-400 text-sm font-medium uppercase tracking-widest mb-6">AI Trust Score</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-6xl font-bold text-white tracking-tighter">842</span>
              <span className="text-brand-400 font-bold mb-2">/ 900</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-400/80">
              <TrendingUp className="w-4 h-4" /> Top 2% in MSME Category
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-8">
          <div className="h-full bg-dark-900 rounded-[32px] p-8 border border-white/5 shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-dark-400 text-sm font-medium mb-1">Liquidity Runway</h3>
                <p className="text-4xl font-bold text-white tracking-tight">14.2 Months</p>
              </div>
              <div className="flex gap-1 items-end h-16">
                {[12, 16, 14, 20, 16].map((h, i) => (
                  <div key={i} className="w-1.5 bg-brand-500 rounded-full transition-all" style={{ height: `${h * 0.25}rem`, opacity: 0.2 + (i * 0.15) }} />
                ))}
              </div>
            </div>
            <div className="h-px bg-dark-800 w-full my-6" />
            <div className="flex flex-wrap gap-8 text-sm">
              <div>
                <p className="text-dark-500">Approval Probability</p>
                <p className="text-white font-semibold">High (94.2%)</p>
              </div>
              <div>
                <p className="text-dark-500">Risk Appetite</p>
                <p className="text-white font-semibold">Aggressive Growth</p>
              </div>
              <div>
                <p className="text-dark-500">GST Analytics</p>
                <p className="text-brand-400 font-semibold">Excellent Flow</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10">
        <div className="lg:col-span-12 flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Qualified Match Engine</h2>
          <Link to="/recommendations" className="text-sm font-medium text-brand-400 hover:text-brand-300 flex items-center">
            View All Matches <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {[
          {
            badge: "SIDBI Partner", badgeBg: "bg-blue-500/20", badgeText: "text-blue-400", id: "49201",
            title: "MSME Growth Capital", desc: "Tier-1 Working Capital Support", rate: "8.5%", amount: "₹2.5Cr", action: "Apply Now", actionStyle: "bg-white text-black hover:bg-brand-500", highlight: false
          },
          {
            badge: "AI Recommended", badgeBg: "bg-brand-500/20", badgeText: "text-brand-400", id: "10293",
            title: "Gov Match: ECLGS 3.0", desc: "Government Backed Guarantee", rate: "Fixed 7.2%", amount: "98%", amountLabel: "Eligibility", action: "Claim Scheme", actionStyle: "bg-dark-800 text-white border border-dark-700", highlight: true
          },
          {
            badge: "Private Lender", badgeBg: "bg-dark-700/50", badgeText: "text-dark-400", id: "77281",
            title: "Unsecured Line of Credit", desc: "Instant Approval for MSMEs", rate: "11.2%", amount: "2 Hours", amountLabel: "Sanction Time", action: "View Terms", actionStyle: "bg-dark-800 text-white border border-dark-700", highlight: false
          }
        ].map((offer, idx) => (
          <div key={idx} className={`lg:col-span-4 bg-dark-900/40 border p-6 rounded-2xl hover:border-brand-500/50 transition-all cursor-pointer group ${offer.highlight ? 'border-brand-500/50 border-l-4 border-l-brand-500' : 'border-dark-800'}`}>
            <div className="flex justify-between mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${offer.badgeBg} ${offer.badgeText}`}>
                {offer.badge}
              </span>
              <span className="text-dark-400 text-xs">ID: #{offer.id}</span>
            </div>
            <h4 className="text-white font-bold text-lg mb-1">{offer.title}</h4>
            <p className="text-dark-400 text-sm mb-6">{offer.desc}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-dark-500">Interest Rate</p>
                <p className="text-white font-medium text-xl">{offer.rate} {offer.rate.includes('%') && !offer.rate.includes('Fixed') && <span className="text-xs text-dark-500">p.a</span>}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">{offer.amountLabel || 'Max Amount'}</p>
                <p className={`font-medium text-xl ${offer.highlight && offer.amountLabel === 'Eligibility' ? 'text-brand-400' : 'text-white'}`}>{offer.amount}</p>
              </div>
            </div>
            <Link to={offer.action === 'Apply Now' || offer.action === 'Claim Scheme' ? `/apply/${offer.id}/kyc` : `/recommendations/${offer.id}`} className={`w-full py-3 font-bold rounded-xl text-sm transition-colors flex items-center justify-center ${offer.actionStyle}`}>
              {offer.action}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
