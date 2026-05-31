import { Card, Button } from '../components/ui';
import { Target, Users, Search, CheckCircle, XCircle } from 'lucide-react';

const APPLICATIONS = [
  { id: 'APP-8921', name: 'NeoFi Innovations', requested: '₹1.5Cr', aiScore: 842, status: 'Review' },
  { id: 'APP-8922', name: 'Ravi Verma (Freelance)', requested: '₹5L', aiScore: 910, status: 'Auto-Approved' },
  { id: 'APP-8923', name: 'Srinija Textiles', requested: '₹40L', aiScore: 610, status: 'High Risk' },
];

export default function LenderDashboard() {
  return (
    <div className="min-h-screen bg-dark-950 p-6">
      <header className="flex justify-between items-end mb-8 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" /> HDFC Enterprise Portal
          </h1>
          <p className="text-dark-400 mt-1">Lead pipeline & AI risk assessment.</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex gap-4 mb-6">
          <Card className="px-6 py-4 flex-1 flex items-center gap-4 bg-dark-900">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-dark-400 text-sm">New Leads</div>
              <div className="text-2xl font-medium text-white">124</div>
            </div>
          </Card>
          <Card className="px-6 py-4 flex-1 flex items-center gap-4 bg-dark-900 border-brand-500/20">
            <div className="w-12 h-12 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-dark-400 text-sm">AI Auto-Matched</div>
              <div className="text-2xl font-medium text-white">82</div>
            </div>
          </Card>
        </div>

        <Card className="bg-dark-900 border-dark-800 p-0 overflow-hidden">
          <div className="p-4 border-b border-dark-800 flex justify-between items-center bg-dark-950/50">
            <h2 className="font-medium text-white">Application Pipeline</h2>
            <div className="flex items-center gap-2 bg-dark-900 border border-dark-700 rounded-lg px-3 py-1.5 focus-within:border-blue-500 transition-colors">
              <Search className="w-4 h-4 text-dark-400" />
              <input type="text" placeholder="Search ID or Name" className="bg-transparent border-none outline-none text-sm text-white w-48" />
            </div>
          </div>
          <div className="divide-y divide-dark-800">
            {APPLICATIONS.map(app => (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-dark-800/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-medium">{app.name}</span>
                    <span className="text-xs text-dark-400 px-2 py-0.5 border border-dark-700 rounded bg-dark-900">{app.id}</span>
                  </div>
                  <div className="text-sm text-dark-400">Requested: <span className="text-white">{app.requested}</span></div>
                </div>
                
                <div className="flex-1 flex justify-center">
                   <div className="text-center">
                     <div className="text-xs text-dark-400 mb-1">AI Trust Score</div>
                     <div className={`font-display font-medium text-lg ${app.aiScore >= 800 ? 'text-brand-400' : 'text-yellow-400'}`}>
                       {app.aiScore}
                     </div>
                   </div>
                </div>

                <div className="flex-1 flex justify-end items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'Auto-Approved' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : app.status === 'High Risk' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-dark-800 text-dark-300'}`}>
                    {app.status}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="h-8 w-8 p-0 text-brand-400 hover:text-brand-300 hover:bg-brand-500/10"><CheckCircle className="w-4 h-4" /></Button>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"><XCircle className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
