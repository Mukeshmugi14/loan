import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, User, Rocket, Laptop, Briefcase, GraduationCap, ChevronRight, Check } from 'lucide-react';

const USER_TYPES = [
  { id: 'individual', label: 'Individual', icon: User },
  { id: 'business', label: 'Business Owner', icon: Building2 },
  { id: 'startup', label: 'Startup Founder', icon: Rocket },
  { id: 'freelancer', label: 'Freelancer', icon: Laptop },
  { id: 'msme', label: 'MSME Owner', icon: Briefcase },
  { id: 'student', label: 'Student', icon: GraduationCap },
];

const GOALS = [
  'Personal Loan', 'Business Loan', 'Government Schemes', 
  'Startup Funding', 'Credit Improvement', 'MSME Support'
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [income, setIncome] = useState('');
  const [location, setLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) setGoals(goals.filter(g => g !== goal));
    else setGoals([...goals, goal]);
  };

  const handleComplete = () => {
    setIsProcessing(true);
    // Simulate AI Processing
    setTimeout(() => {
      updateUser({ onboarded: true });
      navigate('/dashboard');
    }, 4000);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-dark-950">
        <div className="w-full max-w-md text-center space-y-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            className="w-24 h-24 mx-auto rounded-full border-b-2 border-r-2 border-brand-400"
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-white text-glow">AI Engine Profiling</h2>
            <div className="h-12 overflow-hidden relative">
              <motion.div
                animate={{ y: [0, -48, -96, -144] }}
                transition={{ duration: 4, ease: "linear" }}
                className="text-brand-300 gap-y-6 flex flex-col font-mono text-sm"
              >
                <div>Analyzing financial profile parameters...</div>
                <div>Fetching relevant government schemes...</div>
                <div>Calculating baseline trust metrics...</div>
                <div>Generating institutional matches...</div>
                <div>Profile ready. Proceeding...</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 items-center pt-24">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-display font-bold text-white">Let's personalize your NeoFi</h1>
          <p className="text-dark-300 mt-2">Step {step} of 3</p>
          <div className="mt-4 flex gap-2 w-full max-w-xs mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-dark-800'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {USER_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    className={`p-6 rounded-2xl border text-left transition-all ${userType === type.id ? 'bg-brand-500/10 border-brand-500 shadow-[0_0_20px_rgba(16,180,151,0.15)] ring-1 ring-brand-500' : 'bg-dark-900/50 border-dark-800 hover:bg-dark-800/80 hover:border-dark-700'}`}
                  >
                    <type.icon className={`w-8 h-8 mb-4 ${userType === type.id ? 'text-brand-400' : 'text-dark-400'}`} />
                    <div className={`font-medium ${userType === type.id ? 'text-white' : 'text-dark-200'}`}>{type.label}</div>
                  </button>
                ))}
              </div>
              <div className="mt-10 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!userType} className="w-full sm:w-auto">
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-xl text-center text-white mb-8">What are you looking for?</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {GOALS.map(goal => {
                  const isSelected = goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`px-6 py-3 rounded-full border transition-all flex items-center gap-2 ${isSelected ? 'bg-brand-500/20 border-brand-500 text-white' : 'bg-dark-900 border-dark-800 text-dark-300 hover:border-dark-600'}`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-brand-400" />}
                      {goal}
                    </button>
                  );
                })}
              </div>
              <div className="mt-12 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={goals.length === 0}>
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Approximate Annual Income / Turnover</label>
                  <select 
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-dark-700 bg-dark-900 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="" disabled>Select Range</option>
                    <option value="0-5">₹0 - ₹5 Lakhs</option>
                    <option value="5-15">₹5 - ₹15 Lakhs</option>
                    <option value="15-50">₹15 - ₹50 Lakhs</option>
                    <option value="50+">₹50+ Lakhs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">City / Location</label>
                  <Input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore, Karnataka"
                  />
                </div>
                
                <div className="pt-6 border-t border-dark-800">
                  <Button className="w-full" onClick={handleComplete} disabled={!income || !location}>
                    Generate AI Profile
                  </Button>
                </div>
              </Card>
              <div className="mt-6 flex justify-center">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
