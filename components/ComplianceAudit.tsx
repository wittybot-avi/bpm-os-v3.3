import React, { useContext } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  FileCheck, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  History, 
  Download, 
  BarChart4,
  CheckCircle2,
  XCircle,
  Flag,
  Battery,
  Recycle,
  Scale
} from 'lucide-react';

// Mock Data for Dashboard
const KPI_DATA = {
  totalManufactured: 1240,
  aadhaarReady: 98,
  euPassportReady: 45,
  eprEligible: 1240,
  riskCount: 12
};

const RISK_LIST = [
  { id: 'risk-01', packId: 'PCK-2026-001-013', issue: 'QA Hold - Electrical', severity: 'High' },
  { id: 'risk-02', packId: 'PCK-2025-010-092', issue: 'Service - Over Temp', severity: 'Medium' },
  { id: 'risk-03', packId: 'PCK-2026-002-005', issue: 'BMS Firmware Mismatch', severity: 'Low' }
];

const AUDIT_TRAIL = [
  { stage: 'S14: Dispatch', event: 'Custody Handover', timestamp: '2026-01-11 14:00', actor: 'Logistics Mgr', status: 'Verified' },
  { stage: 'S8: QA Review', event: 'Final Release', timestamp: '2026-01-11 10:30', actor: 'Quality Lead', status: 'Approved' },
  { stage: 'S7: Assembly', event: 'Enclosure Seal', timestamp: '2026-01-11 09:15', actor: 'Operator A', status: 'Logged' },
  { stage: 'S5: Module', event: 'Cell Scan', timestamp: '2026-01-10 16:20', actor: 'Operator B', status: 'Logged' }
];

export const ComplianceAudit: React.FC = () => {
  const { role } = useContext(UserContext);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.COMPLIANCE || 
    role === UserRole.SUSTAINABILITY || 
    role === UserRole.MANAGEMENT;

  const isAuditor = role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Compliance & Audit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      
      {/* Auditor Banner */}
      {isAuditor && (
        <div className="bg-slate-100 border-l-4 border-slate-500 text-slate-700 p-3 text-sm font-bold flex items-center gap-2">
          <ShieldCheck size={16} />
          <span>AUDITOR / REGULATOR – READ-ONLY VIEW</span>
        </div>
      )}

      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Governance <span className="text-slate-300">/</span> Audit
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <ShieldCheck className="text-brand-600" size={24} />
             Compliance & Audit Dashboard (S17)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Regulatory oversight, digital passport status, and risk registry.</p>
        </div>
        {!isAuditor && (
          <button 
            className="bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-slate-50"
            disabled
          >
            <Download size={16} />
            <span>Export Audit Report</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-y-auto">
        
        {/* Top: KPI Cards */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded">
                    <BarChart4 size={20} />
                 </div>
                 <span className="text-sm font-bold text-slate-600">Manufactured</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{KPI_DATA.totalManufactured}</div>
              <div className="text-xs text-slate-400 mt-1">Total Units YTD</div>
           </div>
           
           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-purple-50 text-purple-600 rounded">
                    <FileText size={20} />
                 </div>
                 <span className="text-sm font-bold text-slate-600">Aadhaar Ready</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{KPI_DATA.aadhaarReady}%</div>
              <div className="text-xs text-slate-400 mt-1">Digital Identity Compliance</div>
           </div>

           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-green-50 text-green-600 rounded">
                    <Globe size={20} />
                 </div>
                 <span className="text-sm font-bold text-slate-600">EU Passport</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{KPI_DATA.euPassportReady}%</div>
              <div className="text-xs text-slate-400 mt-1">Export Compliant</div>
           </div>

           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-amber-50 text-amber-600 rounded">
                    <Flag size={20} />
                 </div>
                 <span className="text-sm font-bold text-slate-600">Active Risks</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{KPI_DATA.riskCount}</div>
              <div className="text-xs text-slate-400 mt-1">Flagged for Review</div>
           </div>
        </div>

        {/* Regulatory Tracking Scope Panel */}
        <div className="col-span-12 bg-white rounded-lg shadow-sm border border-industrial-border overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
               <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                 <ShieldCheck size={16} />
                 Regulatory Tracking Scope
               </h3>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-100">
                {/* Asset Tracking Summary */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                        <Battery size={20} />
                        <h4 className="font-bold text-sm uppercase tracking-wider">Asset-Level Compliance (Track-Based, Custodian-Driven)</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Traceability Basis</span>
                            <span className="font-medium text-slate-800">Unique Digital ID (UID)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Ownership Model</span>
                            <span className="font-medium text-slate-800">Custodian-Based</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Warranty Liability</span>
                            <span className="font-medium text-slate-800">Per-Unit Tracking</span>
                        </div>
                    </div>
                </div>

                {/* Material Tracking Summary */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-green-700">
                        <Recycle size={20} />
                        <h4 className="font-bold text-sm uppercase tracking-wider">Material-Level Compliance (Trace-Based, Aggregated)</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Accounting Basis</span>
                            <span className="font-medium text-slate-800">Aggregated Mass (kg)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">EPR Obligation</span>
                            <span className="font-medium text-slate-800">Producer Responsibility</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Recycling Target</span>
                            <span className="font-medium text-slate-800">Material Recovery Rate %</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Left: Risk Registry */}
        <div className="col-span-5 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col">
          <div className="p-4 border-b border-slate-100">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <AlertTriangle size={16} className="text-amber-500" />
               Risk Registry
             </h3>
          </div>
          <div className="p-0">
             {RISK_LIST.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                 <div className="bg-slate-50 p-3 rounded-full mb-3">
                   <ShieldCheck className="text-slate-300" size={24} />
                 </div>
                 <h3 className="text-slate-700 font-medium text-sm mb-1">No records available</h3>
                 <p className="text-slate-500 text-xs max-w-xs">Audit and compliance data will populate as lifecycle events are recorded.</p>
               </div>
             ) : (
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                   <tr>
                     <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">ID</th>
                     <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Issue</th>
                     <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Severity</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {RISK_LIST.map((risk) => (
                     <tr key={risk.id} className="hover:bg-slate-50">
                       <td className="px-4 py-3 font-mono text-xs text-slate-600">{risk.packId}</td>
                       <td className="px-4 py-3 text-slate-800">{risk.issue}</td>
                       <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            risk.severity === 'High' ? 'bg-red-100 text-red-700' :
                            risk.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {risk.severity}
                          </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
          </div>
        </div>

        {/* Bottom Right: Audit Trail */}
        <div className="col-span-7 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col">
          <div className="p-4 border-b border-slate-100">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <History size={16} className="text-brand-500" />
               Recent System Audit Trail
             </h3>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-64">
             {AUDIT_TRAIL.map((audit, idx) => (
               <div key={idx} className="flex gap-4 items-start relative">
                  <div className="flex flex-col items-center">
                     <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5"></div>
                     {idx !== AUDIT_TRAIL.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded border border-slate-100">
                     <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-700 text-sm">{audit.stage}</span>
                        <span className="text-xs text-slate-400 font-mono">{audit.timestamp}</span>
                     </div>
                     <div className="text-sm text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-500" />
                        {audit.event}
                     </div>
                     <div className="mt-1 text-xs text-slate-400">
                        Actor: {audit.actor} • Status: {audit.status}
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};