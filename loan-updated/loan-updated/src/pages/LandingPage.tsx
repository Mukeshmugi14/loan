import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { ArrowRight, ShieldCheck, Zap, Activity, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xl font-display font-bold text-white tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-[0_0_15px_rgba(20,241,217,0.4)]">
            <span className="text-black text-sm font-bold leading-none">N</span>
          </div>
          Neo<span className="text-brand-400">Fi</span> AI
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-dark-200">
          <a href="#features" className="hover:text-white transition-colors">Platform</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-24 pb-32 px-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-medium text-brand-300 mb-8 border-brand-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            NeoFi AI Infrastructure is now live
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8"
          >
            AI-Powered Financial <br className="hidden md:block" />
            Intelligence Infrastructure
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-dark-300 mb-10 max-w-2xl mx-auto"
          >
            Smarter loan discovery, trust scoring, and opportunity matching for India's financial ecosystem.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Preview Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 w-full max-w-5xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10" />
          <Card className="glass-panel p-2 md:p-4 rounded-[2rem] border-dark-700/50">
            <div className="bg-dark-950 rounded-[1.5rem] overflow-hidden border border-dark-800 relative shadow-2xl">
              <div className="h-10 border-b border-dark-800 flex items-center px-4 gap-2 bg-dark-900/50">
                <div className="w-3 h-3 rounded-full bg-dark-700" />
                <div className="w-3 h-3 rounded-full bg-dark-700" />
                <div className="w-3 h-3 rounded-full bg-dark-700" />
              </div>
              <div className="p-8 grid md:grid-cols-3 gap-6 opacity-80 backdrop-blur-sm grayscale-[0.2]">
                <div className="space-y-4">
                  <div className="h-24 bg-dark-800 rounded-xl" />
                  <div className="h-32 bg-dark-800 rounded-xl" />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="h-40 bg-dark-800 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                     <div className="h-24 bg-dark-800 rounded-xl" />
                     <div className="h-24 bg-dark-800 rounded-xl" />
                  </div>
                </div>
              </div>
              
              {/* Overlay elements predicting UX */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 bg-brand-500/20 px-6 py-4 rounded-2xl border border-brand-500/50 backdrop-blur-md">
                <ShieldCheck className="w-8 h-8 text-brand-300" />
                <div>
                  <div className="text-white font-medium">AI Trust Score Generating...</div>
                  <div className="text-brand-200 text-sm">Processing 250+ parameters</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          {[
            { icon: Zap, title: "Instant AI Matching", desc: "Our engine maps your profile to 500+ institutional lenders and government schemes." },
            { icon: Activity, title: "Dynamic Trust Score", desc: "Move beyond standard credit scores. We analyze holistic cashflow and business health." },
            { icon: Globe, title: "Decentralized KYC", desc: "No upfront friction. Provide minimal details first, securely verify identity only when applying." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-xl font-display font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-dark-400 leading-relaxed">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
