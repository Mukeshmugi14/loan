import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { Bell, Shield, Key, Moon, Globe, Smartphone, CreditCard, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-white mb-2">Platform Settings</h1>
        <p className="text-dark-300">Preferences, security, and account management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          {['Security & Access', 'Notifications', 'Linked Accounts', 'Preferences', 'Billing Plan'].map((item, idx) => (
            <button key={item} className={`w-full flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-colors ${idx === 0 ? 'bg-dark-900 border border-white/5 text-white' : 'text-dark-400 hover:text-white hover:bg-white/5'}`}>
              {item} <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 space-y-6">
          <Card className="bg-dark-900 border-white/5 p-6 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Security & Authentication</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1 flex items-center gap-2"><Key className="w-4 h-4 text-dark-400" /> Password</h4>
                  <p className="text-sm text-dark-400 font-mono">Last changed 45 days ago</p>
                </div>
                <Button variant="outline" className="border-dark-700 text-dark-300">Update Password</Button>
              </div>

              <div className="h-px w-full bg-white/5" />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-dark-400" /> Two-Factor Authentication (2FA)</h4>
                  <p className="text-sm text-dark-400">Add an extra layer of security to your account.</p>
                </div>
                <button 
                  onClick={() => setTwoFactor(!twoFactor)} 
                  className={`w-12 h-6 rounded-full transition-colors relative ${twoFactor ? 'bg-brand-500' : 'bg-dark-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${twoFactor ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="h-px w-full bg-white/5" />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1 flex items-center gap-2"><Smartphone className="w-4 h-4 text-dark-400" /> Active Sessions</h4>
                  <p className="text-sm text-dark-400">MacBook Pro - Chrome - Mumbai (Current)</p>
                </div>
                <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">Log out all devices</Button>
              </div>
            </div>
          </Card>

          <Card className="bg-dark-900 border-white/5 p-6 space-y-6">
             <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Notifications</h2>
             
             <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1 flex items-center gap-2"><Bell className="w-4 h-4 text-dark-400" /> Push Notifications</h4>
                  <p className="text-sm text-dark-400">Alerts for loan approval, document requests.</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)} 
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-brand-500' : 'bg-dark-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
