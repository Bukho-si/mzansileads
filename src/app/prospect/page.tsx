"use client";

import { useState } from "react";

export default function ProspectingPage() {
  const [niche, setNiche] = useState("HVAC / Plumbing");
  const [location, setLocation] = useState("Johannesburg, Gauteng");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prospect", {
        method: "POST",
        body: JSON.stringify({ niche, location }),
      });
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
      else alert("Error generating leads");
    } catch (e) {
      console.error(e);
      alert("Network Error");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Automated Lead Prospector</h1>
      <p className="text-gray-500 mb-8 text-sm md:text-base">Generate highly-targeted local leads, complete with audit hooks and cold email openers.</p>

      {/* FILTER PANEL */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Niche</label>
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. Tour Operators"
          />
        </div>
        <div className="w-full md:flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. Maui, Hawaii"
          />
        </div>
        <button
          onClick={handleGenerate}
          className="w-full md:w-auto bg-[#1e2330] hover:bg-[#2d3240] text-white font-medium rounded-lg px-8 py-3 shadow-md transition-all active:scale-95 flex items-center justify-center whitespace-nowrap"
        >
          {loading ? "Hunting Leads..." : "Build Lead List"}
        </button>
      </div>

      {/* RESULTS (RESPONSIVE TABLE OR CARDS) */}
      {leads.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
          
          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden flex flex-col divide-y divide-gray-100">
            {leads.map((lead, i) => (
              <div key={i} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{lead.businessName}</h3>
                    <a href={lead.websiteURL} target="_blank" className="text-blue-500 hover:underline text-xs truncate max-w-[200px] block">{lead.websiteURL}</a>
                    <div className="text-xs text-gray-500 mt-1">{lead.phoneNumber}</div>
                  </div>
                  <span className="inline-block text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full uppercase truncate max-w-[100px]">{lead.niche}</span>
                </div>
                
                <div>
                  <span className="font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] uppercase tracking-wider">
                    {lead.decisionMaker}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded border border-gray-100 mt-2 text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800 block mb-1">Audit Hook:</span>
                  {lead.auditHook}
                </div>

                <div className="bg-blue-50/50 p-3 flex flex-col gap-2 rounded border border-blue-100/50 relative">
                  <span className="font-semibold text-blue-800 text-[10px] uppercase truncate block">Cold Email Outline:</span>
                  <p className="text-xs italic text-gray-700">"{lead.coldEmail}"</p>
                  <button 
                    className="w-full mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold py-2 rounded transition-colors"
                    onClick={() => navigator.clipboard.writeText(lead.coldEmail)}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-normal">
              <thead className="bg-[#f4f7fc] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4 w-1/5">Business Details</th>
                  <th className="p-4 w-1/5">Decision Maker</th>
                  <th className="p-4 w-1/3">Digital Audit & Hook</th>
                  <th className="p-4 w-1/4">Cold Email Opener</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors align-top">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{lead.businessName}</div>
                      <a href={lead.websiteURL} target="_blank" className="text-blue-500 hover:underline text-xs block truncate max-w-[200px]">{lead.websiteURL}</a>
                      <div className="text-xs text-gray-400 mt-1">{lead.phoneNumber}</div>
                      <span className="inline-block mt-2 text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full uppercase">{lead.niche}</span>
                    </td>
                    <td className="p-4 text-gray-700">
                      <span className="font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        Likely: {lead.decisionMaker}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-xs leading-relaxed">
                      {lead.auditHook}
                    </td>
                    <td className="p-4 text-xs">
                      <div className="bg-gray-100 p-3 rounded border border-gray-200 text-gray-800 italic relative group">
                        "{lead.coldEmail}"
                        {/* Copy Button Hover */}
                        <button 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white shadow rounded px-2 py-1 text-[10px] hover:bg-blue-50 transition-opacity"
                          onClick={() => navigator.clipboard.writeText(lead.coldEmail)}
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
