import { Card, Button } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, Users, Server, FileText } from 'lucide-react';

const API_METRICS = [
  { time: '00:00', calls: 12000 },
  { time: '04:00', calls: 8000 },
  { time: '08:00', calls: 45000 },
  { time: '12:00', calls: 89000 },
  { time: '16:00', calls: 76000 },
  { time: '20:00', calls: 32000 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-dark-950 p-6 flex flex-col">
      <header className="flex justify-between items-end mb-8 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Server className="w-8 h-8 text-brand-400" /> NeoFi Core Admin
          </h1>
          <p className="text-dark-400 mt-1">System infrastructure and AI engine monitoring.</p>
        </div>
        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
          <ShieldAlert className="w-4 h-4 mr-2" /> Trigger Security Audit
        </Button>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-dark-900">
             <div className="text-dark-400 text-sm mb-2">Total Users</div>
             <div className="text-3xl font-medium text-white flex items-center justify-between">
               2.4M <Users className="w-5 h-5 text-brand-400" />
             </div>
          </Card>
          <Card className="bg-dark-900">
             <div className="text-dark-400 text-sm mb-2">AI Trust Analyses (24h)</div>
             <div className="text-3xl font-medium text-white flex items-center justify-between">
               145K <Activity className="w-5 h-5 text-blue-400" />
             </div>
          </Card>
          <Card className="bg-dark-900 border-red-500/20">
             <div className="text-dark-400 text-sm mb-2">Fraud Alerts</div>
             <div className="text-3xl font-medium text-red-400 flex items-center justify-between">
               12 <ShieldAlert className="w-5 h-5 text-red-400" />
             </div>
          </Card>
          <Card className="bg-dark-900">
             <div className="text-dark-400 text-sm mb-2">Active Lenders</div>
             <div className="text-3xl font-medium text-white flex items-center justify-between">
               42 <FileText className="w-5 h-5 text-purple-400" />
             </div>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-dark-800">
            <h2 className="text-xl font-display font-medium text-white">API Core Load (Requests/hr)</h2>
          </div>
          <div className="h-[300px] w-full p-6 pb-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={API_METRICS} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24ceb0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#24ceb0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#425169" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#425169" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0b0e14', borderColor: '#2e3748' }} />
                <Area type="monotone" dataKey="calls" stroke="#24ceb0" fillOpacity={1} fill="url(#colorApi)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
