import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, Input } from '../components/ui';
import { Chrome, User, Shield, AlertTriangle } from 'lucide-react';

const MOCK_ACCOUNTS = [
  { id: '1', name: 'Ravi Sharma', email: 'sharma.enterprises@gmail.com', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi' },
  { id: '2', name: 'Priya Patel', email: 'priya.patel@msmehub.in', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { id: '3', name: 'Vikram Singh', email: 'vikram.singh@indiamanufacturing.org', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' },
];

export default function GoogleConsent() {
  const [searchParams] = useSearchParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const redirectUri = searchParams.get('redirect_uri') || '/auth/callback';

  const handleSelectAccount = (account: typeof MOCK_ACCOUNTS[0]) => {
    // Generate a random code
    const code = 'auth_code_' + Math.random().toString(36).substring(2, 10);
    // Simulate query redirection to callback uri
    const callbackUrl = `${redirectUri}?code=${code}&name=${encodeURIComponent(account.name)}&email=${encodeURIComponent(account.email)}&picture=${encodeURIComponent(account.picture)}&id=${account.id}`;
    window.location.href = callbackUrl;
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    const picture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName)}`;
    handleSelectAccount({
      id: 'custom_' + Math.random().toString(36).substring(7),
      name: customName,
      email: customEmail,
      picture,
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-[450px] bg-white border border-[#dadce0] rounded-lg p-8 shadow-md space-y-6">
        {/* Google Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-4">
            <svg viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6">
              <path fill="#ea4335" d="M12 5.04c1.9 0 3.63.65 5 1.74l3.75-3.75C18.47 1.15 15.42 0 12 0 7.33 0 3.32 2.68 1.4 6.6l4.24 3.29C6.63 7.03 9.1 5.04 12 5.04z" />
              <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2 3.7-4.96 3.7-8.62z" />
              <path fill="#fbbc05" d="M5.64 14.88c-.24-.72-.37-1.49-.37-2.28s.13-1.56.37-2.28L1.4 7.03C.51 8.81 0 10.8 0 12.92s.51 4.11 1.4 5.89l4.24-3.93z" />
              <path fill="#34a853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.73-2.89c-1.03.69-2.35 1.1-4.2 1.1-2.9 0-5.37-1.99-6.24-4.66L1.4 17.93C3.32 21.32 7.33 24 12 24z" />
            </svg>
            <span className="font-medium text-[22px] tracking-tight text-[#202124]">Google</span>
          </div>
          <h1 className="text-2xl font-normal text-[#202124] text-center">Sign in with Google</h1>
          <p className="text-[14px] text-[#5f6368] mt-2">to continue to <span className="font-semibold text-[#1a73e8]">MSMERAISE</span></p>
        </div>

        {!showAddForm ? (
          <div className="space-y-4">
            {/* Account List */}
            <div className="border border-[#dadce0] rounded-md divide-y divide-[#dadce0] overflow-hidden">
              {MOCK_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#f7f8f9] transition-colors"
                >
                  <img src={acc.picture} alt={acc.name} className="w-8 h-8 rounded-full border border-[#dadce0]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#3c4043] truncate">{acc.name}</p>
                    <p className="text-[12px] text-[#5f6368] truncate">{acc.email}</p>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#f7f8f9] transition-colors text-[#1a73e8]"
              >
                <div className="w-8 h-8 rounded-full bg-[#f1f3f4] border border-[#dadce0] flex items-center justify-center text-[#5f6368]">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-medium">Use another account</span>
              </button>
            </div>

            {/* Scope details */}
            <div className="flex gap-2.5 bg-[#f8f9fa] border border-[#dadce0] p-3.5 rounded-md text-[12px] text-[#5f6368] leading-relaxed">
              <Shield className="w-4 h-4 text-[#1a73e8] shrink-0 mt-0.5" />
              <div>
                MSMERAISE will receive your profile info (name and picture) and email address to create and manage your secure account.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#5f6368]">Full Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Anand Mahindra"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full border-[#dadce0] text-[#1f1f1f] bg-white h-10 px-3 rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#5f6368]">Email address</label>
                <Input
                  type="email"
                  placeholder="e.g. mahindra.enterprises@gmail.com"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  className="w-full border-[#dadce0] text-[#1f1f1f] bg-white h-10 px-3 rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="text-[#1a73e8] hover:bg-[#f1f3f4] text-[14px]"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#1a73e8] text-white hover:bg-[#1557b0] text-[14px] h-10 px-5 rounded-md"
              >
                Continue
              </Button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="text-[12px] text-[#5f6368] text-center border-t border-[#f1f3f4] pt-4">
          To continue, Google will share your name, email address, language preference, and profile picture with MSMERAISE.
        </div>
      </Card>
    </div>
  );
}
