'use client';

export default function AuthTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
        <p>If you can see this page, the routing works fine.</p>
        <p>The issue is likely in the AuthProvider/Auth0 integration.</p>
      </div>
    </div>
  );
}
