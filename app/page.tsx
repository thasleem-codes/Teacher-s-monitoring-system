import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Monitor</h1>
        <p className="text-gray-500 mb-8">Select a portal to continue</p>
        
        <div className="space-y-4">
          <Link 
            href="/teacher" 
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition shadow-sm"
          >
            Teacher Entry Portal (No Password)
          </Link>
          <Link 
            href="/admin" 
            className="block w-full text-center bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-xl transition shadow-sm"
          >
            Admin Dashboard (Password Required)
          </Link>
        </div>
      </div>
    </main>
  );
}