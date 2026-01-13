import React, { useState } from 'react';
import { 
  BarChart2, 
  FileText, 
  Download, 
  ShieldCheck, 
  Battery, 
  Database, 
  X,
  PieChart,
  TrendingUp,
  Layers
} from 'lucide-react';

interface ReportTile {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  owner: string;
  previewData?: React.ReactNode;
}

const REPORTS: ReportTile[] = [
  { 
    id: 'rpt-mfg',
    title: 'Production Summary', 
    description: 'Yield rates, cycle times, and defect pareto analysis for current shift.',
    icon: BarChart2,
    owner: 'MES Backend',
    previewData: (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="text-xs text-slate-500 uppercase">Yield</div>
                    <div className="text-xl font-bold text-green-600">95.4%</div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="text-xs text-slate-500 uppercase">Cycle Time</div>
                    <div className="text-xl font-bold text-blue-600">14m</div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="text-xs text-slate-500 uppercase">Throughput</div>
                    <div className="text-xl font-bold text-slate-700">124 Units</div>
                </div>
            </div>
            <div className="h-32 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300">
                [ Chart Placeholder: Production Output Trend ]
            </div>
        </div>
    )
  },
  { 
    id: 'rpt-comp',
    title: 'Compliance & Traceability', 
    description: 'Regulatory adherence report (AIS-156, Battery Passport readiness).',
    icon: ShieldCheck,
    owner: 'Governance Module',
    previewData: (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                <span className="text-sm font-bold text-green-800">AIS-156 Compliance</span>
                <span className="text-sm font-mono font-bold text-green-700">100%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                <span className="text-sm font-bold text-blue-800">Passport Generation</span>
                <span className="text-sm font-mono font-bold text-blue-700">98.2%</span>
            </div>
            <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600">
                    <tr><th className="p-2">Metric</th><th className="p-2">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr><td className="p-2">Data Integrity</td><td className="p-2 text-green-600 font-bold">Verified</td></tr>
                    <tr><td className="p-2">Custodian Chain</td><td className="p-2 text-green-600 font-bold">Complete</td></tr>
                </tbody>
            </table>
        </div>
    )
  },
  { 
    id: 'rpt-inv',
    title: 'Inventory & WIP Summary', 
    description: 'Current stock levels across warehouses and production lines.',
    icon: Layers,
    owner: 'WMS Service',
    previewData: (
        <div className="space-y-3">
             <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-600">Raw Cells</span>
                <span className="font-mono font-bold">15,420</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-600">WIP Modules</span>
                <span className="font-mono font-bold">350</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-600">Finished Packs</span>
                <span className="font-mono font-bold">450</span>
             </div>
             <div className="p-2 bg-amber-50 text-amber-800 text-xs rounded mt-2">
                Alert: Low stock on Thermal Pads (Type B)
             </div>
        </div>
    )
  },
  { 
    id: 'rpt-wty',
    title: 'Warranty & Returns', 
    description: 'Active claims, fleet health distribution, and risk exposure.',
    icon: Battery,
    owner: 'Service Backend',
    previewData: (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded border border-red-200 text-center">
                    <div className="text-xs text-red-600 uppercase font-bold">Active Claims</div>
                    <div className="text-xl font-bold text-red-800">3</div>
                </div>
                <div className="bg-green-50 p-3 rounded border border-green-200 text-center">
                    <div className="text-xs text-green-600 uppercase font-bold">Fleet Health</div>
                    <div className="text-xl font-bold text-green-800">98%</div>
                </div>
            </div>
            <div className="text-xs text-slate-500">
                Top Risk: <span className="font-bold text-slate-700">Over-Temperature (Region A)</span>
            </div>
        </div>
    )
  },
];

export const SystemReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportTile | null>(null);

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              System <span className="text-slate-300">/</span> Intelligence
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <FileText className="text-brand-600" size={24} />
             System Reports
           </h1>
           <p className="text-slate-500 text-sm mt-1">Generated analytics and compliance documentation.</p>
        </div>
      </div>

      {/* Report Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 overflow-y-auto">
         {REPORTS.map((report) => (
            <div 
                key={report.id} 
                onClick={() => setSelectedReport(report)}
                className="bg-white p-6 rounded-lg shadow-sm border border-industrial-border flex flex-col cursor-pointer hover:shadow-md hover:border-brand-300 transition-all group"
            >
               <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg text-brand-600 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                     <report.icon size={24} />
                  </div>
                  <div className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-mono rounded uppercase">
                     Owner: {report.owner}
                  </div>
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">{report.title}</h3>
               <p className="text-sm text-slate-500 flex-1">{report.description}</p>
               <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Click to Preview</span>
                  <PieChart size={16} className="text-slate-300 group-hover:text-brand-500" />
               </div>
            </div>
         ))}
      </div>

      {/* Preview Panel Overlay */}
      {selectedReport && (
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-8 z-50 animate-in fade-in duration-200">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-full border border-slate-200">
                  <div className="flex justify-between items-center p-6 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-50 rounded text-brand-600">
                              <selectedReport.icon size={20} />
                          </div>
                          <div>
                              <h2 className="text-lg font-bold text-slate-800">{selectedReport.title}</h2>
                              <div className="text-xs text-slate-500">Preview Mode • Data is Simulated</div>
                          </div>
                      </div>
                      <button 
                        onClick={() => setSelectedReport(null)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                      >
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto">
                      {selectedReport.previewData}
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-lg">
                      <button 
                        onClick={() => setSelectedReport(null)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                      >
                          Close
                      </button>
                      <button 
                        disabled
                        className="px-4 py-2 bg-brand-600 text-white rounded text-sm font-medium opacity-50 cursor-not-allowed flex items-center gap-2"
                      >
                          <Download size={16} />
                          Download PDF
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};