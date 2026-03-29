"use client";

import { useState, useEffect, Suspense } from "react";
import { Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold text-gray-800 mb-1">
        <span>{label}</span>
        <span className="text-gray-600">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="bg-green-500 h-2 rounded transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function AuditContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");

  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadLead() {
      if (!leadId) return;
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
        
      if (data) {
        setBusiness(data.business_name || "");
        setWebsite(data.website || "");
        if (data.audit_json) {
           // If it was already analyzed, we could show it, but the PRD says "run audit"
        }
      }
    }
    loadLead();
  }, [leadId]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorStatus(null);
    setReport(null);
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ id: leadId, business, website }),
      });
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Failed to analyze target. Make sure URL is valid.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Lead Audit</h1>
        <p className="text-gray-500 mt-1 uppercase text-sm font-semibold tracking-wider">Run a Deep Marketing Diagnostic</p>
      </div>

      <form onSubmit={handleAnalyze} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-10 max-w-2xl flex flex-col gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Business Name</label>
          <input
            type="text"
            required
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="e.g. Mzansi Digital"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
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
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg px-8 py-3 shadow-md transition-all active:scale-95"
        >
          {loading ? "Analyzing Context..." : "Run Audit"}
        </button>

        {errorStatus && (
           <div className="bg-red-50 text-red-700 p-4 text-sm mt-2 rounded border border-red-100">
             {errorStatus === "insufficient_data" ? "Failed to extract website content. Ensure the URL is live and scrapable." : errorStatus}
           </div>
        )}
      </form>

      {/* REPORT */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-20 opacity-70">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Auditing Site Data...</p>
        </div>
      )}

      {report && !loading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {/* A. HEADER */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marketing Audit Report</h2>
            <p className="text-blue-600 mt-2 uppercase text-sm font-bold tracking-widest">{business}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 mb-10">
            {/* B. SCORE SECTION */}
            <div className="w-40 flex-shrink-0 h-40 rounded-full border-[12px] border-yellow-400 flex flex-col items-center justify-center shadow-inner relative">
              <span className="text-4xl font-extrabold text-gray-800">{report.score}</span>
              <span className="text-[10px] uppercase text-gray-400 font-bold absolute bottom-4">Score</span>
            </div>

            {/* C. CATEGORY BARS */}
            <div className="flex-1 space-y-4 w-full">
              <Progress label="Business Details" value={30} />
              <Progress label="Google Profile" value={report.score ? parseInt(report.score) + 15 : 70} />
              <Progress label="Website Performance" value={report.score ? Math.max(20, parseInt(report.score) - 20) : 20} />
              <Progress label="SEO Analysis" value={report.score ? parseInt(report.score) : 40} />
              <Progress label="Online Reputation" value={50} />
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* D. CRITICAL ISSUES */}
          <div className="mb-8">
             <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
               <span className="bg-red-100 text-red-600 rounded flex w-8 h-8 items-center justify-center">!</span>
               Critical Issues Found
             </h3>
             <ul className="space-y-3 text-gray-600 pl-11">
               {report.problem && <li className="list-disc">{report.problem}</li>}
               {!report.problem && <li className="list-disc italic">No major marketing gaps identified.</li>}
             </ul>
          </div>

          {/* E. RECOMMENDED FIX */}
          <div className="bg-green-50/50 border border-green-100 p-6 rounded-lg mb-8">
             <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">Recommended Fix</h3>
             <p className="text-green-900 text-sm leading-relaxed">{report.solution}</p>
          </div>

          {/* F. OUTREACH BOX */}
          <div className="border border-blue-200 bg-[#f4f7fc] p-6 rounded-lg relative group">
             <div className="flex justify-between items-center mb-3">
               <h3 className="font-bold text-blue-900 uppercase tracking-wider text-xs">Generated WhatsApp Outreach</h3>
               <button 
                  type="button"
                  onClick={() => navigator.clipboard.writeText(report.whatsapp)}
                  className="flex items-center gap-1 bg-white hover:bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-3 py-1.5 rounded shadow-sm border border-blue-100 transition-colors"
               >
                 <Copy className="w-3 h-3" /> Copy Pitch
               </button>
             </div>
             <div className="bg-white p-4 rounded text-sm text-gray-700 shadow-sm border border-blue-50 leading-relaxed italic">
               "{report.whatsapp}"
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={
       <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500">Loading Lead Context...</p></div>
    }>
      <AuditContent />
    </Suspense>
  );
}
