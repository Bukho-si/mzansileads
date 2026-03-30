"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [totalLeads, setTotalLeads] = useState(0);
  const [analyzedLeads, setAnalyzedLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const { count: tCount } = await supabase
          .from('mzansi_leads')
          .select('*', { count: 'exact', head: true });

        const { count: aCount } = await supabase
          .from('mzansi_leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'analyzed');

        setTotalLeads(tCount || 0);
        setAnalyzedLeads(aCount || 0);
      } catch (err) {
        console.error("Failed to load metrics", err);
      }
      setLoading(false);
    }
    loadMetrics();
  }, []);

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Agency Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Overview of your lead generation and outreach pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Leads Captured</h3>
          <p className="text-4xl font-extrabold text-gray-900">{loading ? "..." : totalLeads}</p>
          <div className="text-xs font-medium text-green-600 mt-2 bg-green-50 w-fit px-2 py-1 rounded">
            Active in CRM
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">AI Audits Run</h3>
          <p className="text-4xl font-extrabold text-blue-600">{loading ? "..." : analyzedLeads}</p>
          <div className="text-xs font-medium text-blue-600 mt-2 bg-blue-50 w-fit px-2 py-1 rounded">
            Ready for outreach
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Outreach Sent</h3>
          <p className="text-4xl font-extrabold text-purple-600">0</p>
          <div className="text-xs font-medium text-purple-600 mt-2 bg-purple-50 w-fit px-2 py-1 rounded">
            Waiting for connection
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-[#fbfcfd]">
          <h3 className="font-semibold text-gray-800">Recent Prospect Activity</h3>
        </div>
        <div className="p-6 text-center text-gray-500 text-sm py-16">
           No recent activity to display. Start prospecting to populate this feed.
        </div>
      </div>
    </div>
  );
}
