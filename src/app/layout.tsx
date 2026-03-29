import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { 
  Rocket, 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Megaphone, 
  Settings 
} from 'lucide-react';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mzansi CRM Platform',
  description: 'AI-Powered Lead Generation & Auditing CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#f4f7fc]`}>
      <body className="flex h-full overflow-hidden font-sans text-gray-800">
        
        {/* PREMIUM SIDEBAR */}
        <aside className="w-[240px] bg-[#1e2330] text-gray-300 flex flex-col h-full flex-shrink-0 z-20 hidden md:flex shadow-2xl">
          {/* Logo Space */}
          <div className="h-16 flex items-center px-6 border-b border-[#2d3240] bg-[#1a1f2b]">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-bold text-white tracking-widest uppercase">Mzansi</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-4 overflow-y-auto scroller">
            <div className="px-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</div>
            
            <Link href="/dashboard" className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-[#282e3f] hover:text-white transition-all group">
              <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-blue-400" /> Dashboard
            </Link>
            <Link href="/prospecting" className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-[#282e3f] hover:text-white transition-all group">
              <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-400" /> Prospecting
            </Link>
            <Link href="/audit" className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-[#282e3f] hover:text-white transition-all group">
              <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-400" /> AI Lead Audit
            </Link>
          </nav>
          
          <div className="p-4 border-t border-[#2d3240]">
            <a href="#" className="flex items-center gap-3 px-2 py-2 text-sm hover:bg-[#282e3f] hover:text-white transition-all rounded">
              <Settings className="w-4 h-4 text-gray-400" /> Settings
            </a>
          </div>
        </aside>

        {/* MAIN APPLICATION CONTEXT */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white w-full">
          
          {/* HEADER NAV */}
          <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 shadow-sm relative overflow-x-auto hide-scrollbar">
             <div className="flex items-center gap-4 md:gap-8 text-sm font-semibold text-gray-500 h-full min-w-max">
                <span className="cursor-pointer hover:text-gray-900 border-b-2 border-transparent h-full flex items-center">Marketing Dashboard</span>
                <span className="cursor-pointer text-blue-600 border-b-2 border-blue-600 h-full flex items-center">Prospecting Reports</span>
                <span className="cursor-pointer hover:text-gray-900 border-b-2 border-transparent h-full flex items-center">Social Planner</span>
             </div>
             <div className="flex items-center gap-3 ml-4">
               <span className="hidden sm:inline-block text-xs md:text-sm border border-gray-200 px-3 py-1 rounded-full text-gray-600 shadow-sm bg-gray-50 whitespace-nowrap">Local Agency Test</span>
               <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold shadow">
                 M
               </div>
             </div>
          </header>

          {/* DYNAMIC VIEW ROUTER */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-[#fdfdfd] pb-24 md:pb-8 w-full">
            {children}
          </main>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#1e2330] flex justify-around items-center h-16 shadow-2xl z-50 px-2 pb-safe">
          <Link href="/dashboard" className="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          <Link href="/prospecting" className="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Prospects</span>
          </Link>
          <Link href="/audit" className="flex flex-col items-center justify-center text-blue-400 hover:text-blue-300 transition-colors relative">
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Audit</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
