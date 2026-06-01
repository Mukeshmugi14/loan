import React from 'react';
import { Card, Button } from '../components/ui';
import { FileText, ArrowRight, Activity, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplicationsPage() {
  const applications = [
    { id: 'APP-9201', amount: '₹ 2,50,00,000', status: 'In Review', lender: 'HDFC Enterprise', date: 'Oct 12, 2026', type: 'Working Capital' },
    { id: 'APP-8442', amount: '₹ 75,00,000', status: 'Approved', lender: 'SIDBI Partner', date: 'Sep 28, 2026', type: 'Machinery Loan' },
    { id: 'APP-5091', amount: '₹ 1,20,00,000', status: 'Disbursed', lender: 'ICICI Bank', date: 'Jun 15, 2026', type: 'Overdraft' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-2">Loan Applications</h1>
          <p className="text-dark-300">Track and manage your corporate credit requests.</p>
        </div>
        <Link to="/recommendations">
          <Button className="bg-brand-500 hover:bg-brand-400 text-black font-bold h-12">New Application</Button>
        </Link>
      </div>

      <Card className="bg-dark-900 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-dark-500 font-bold uppercase tracking-wider text-xs">
                <th className="p-4">App ID</th>
                <th className="p-4 hidden md:table-cell">Lender</th>
                <th className="p-4">Facility Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-mono text-sm">{app.id}</p>
                    <p className="text-xs text-dark-400 mt-1 sm:hidden">{app.lender}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-white font-medium">{app.lender}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-dark-300">{app.type}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium">{app.amount}</p>
                    <p className="text-xs text-dark-400 mt-1">{app.date}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       {app.status === 'In Review' && <Activity className="w-4 h-4 text-brand-400" />}
                       {app.status === 'Approved' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                       {app.status === 'Disbursed' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                       <span className={`text-sm font-bold ${
                         app.status === 'Approved' ? 'text-green-400' :
                         app.status === 'Disbursed' ? 'text-blue-400' : 'text-brand-400'
                       }`}>{app.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/applications/${app.id}/track`}>
                      <Button variant="outline" size="sm" className="border-dark-700 text-dark-300 hover:text-white">Track <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
