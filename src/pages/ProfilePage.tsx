import React from 'react';
import { Card, Button, Input } from '../components/ui';
import { UserCircle, Mail, Phone, Building2, Shield, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 bg-dark-950 min-h-screen">
      <div>
        <h1 className="text-3xl font-display font-medium text-white mb-2">Executive Profile</h1>
        <p className="text-dark-300">Manage your personal executive details and linked business entity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-dark-900 border-white/5 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-500 to-blue-500 mb-4 p-1 overflow-hidden">
              <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center overflow-hidden">
                {user?.profile_picture_url ? (
                  <img src={user.profile_picture_url} className="w-full h-full object-cover rounded-xl" alt="avatar" />
                ) : (
                  <UserCircle className="w-12 h-12 text-brand-400" />
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user?.full_name || "Ravi Sharma"}</h2>
            <p className="text-sm text-dark-400 mb-4">{user?.auth_provider === 'google' ? 'Google Authenticated User' : 'Founder & CEO'}</p>
            <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" /> Identity Verified
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-dark-900 border-white/5 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-800 pb-4">
              <UserCircle className="w-5 h-5 text-dark-400" /> Primary Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Full Name</label>
                <Input defaultValue={user?.full_name || "Ravi Sharma"} className="bg-dark-800 border-white/5 h-12 text-white" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Date of Birth</label>
                <Input defaultValue="14/08/1985" className="bg-dark-800 border-white/5 h-12 text-white" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <Input defaultValue={user?.email || "ravi@msmeraise.in"} className="bg-dark-800 border-white/5 h-12 pl-10 text-white" />
                </div>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <Input defaultValue={user?.phone || "+91 98765 43210"} className="bg-dark-800 border-white/5 h-12 pl-10 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-dark-900 border-white/5 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-800 pb-4">
              <Building2 className="w-5 h-5 text-dark-400" /> Linked Enterprise
            </h3>
            <div className="bg-dark-800 border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-brand-400 font-bold mb-1">{user?.businessInfo?.businessName || "MSMERAISE Innovations Pvt Ltd"}</p>
                <p className="text-xs text-dark-400">
                  GSTIN: {user?.documents?.gstCertificate ? "Verified (GST Certificate Uploaded)" : "27AACCN1234E1Z5"}
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-dark-700 text-dark-300">View Data</Button>
            </div>
          </Card>

          <div className="flex justify-end gap-4 mt-8">
            <Button variant="ghost" className="text-dark-400 hover:text-white">Discard Changes</Button>
            <Button className="bg-brand-500 hover:bg-brand-400 text-black font-bold h-12 px-8">Save Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
