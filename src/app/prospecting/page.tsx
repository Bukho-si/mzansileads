"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProspectingPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    if (!businessName || !website) {
      setStatusMsg({ type: "error", text: "Please provide both Business Name and Website" });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ business_name: businessName, website, niche, status: 'captured' }])
        .select()
        .single();

      if (error) throw error;
      
      router.push(`/audit?id=${data.id}`);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: "error", text: "Failed to add lead. Check database table schema." });
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Manual Prospecting</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Quickly capture and log local Gauteng SMEs into your outreach pipeline.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
        <form onSubmit={handleAddLead} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Mzansi Digital Solutions"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-black"
            />
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Website URL</label>
             <input
              type="text"
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g. mzansidigital.co.za"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-black"
            />
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Niche</label>
             <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Plumbing"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-black"
            />
          </div>

          {statusMsg && (
            <div className={`p-4 rounded text-sm ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {statusMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full md:w-auto bg-[#1e2330] hover:bg-[#2d3240] text-white font-medium rounded-lg px-8 py-3 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Capturing..." : "Add Lead & Run Audit"}
          </button>
        </form>
      </div>
    </div>
  );
}
