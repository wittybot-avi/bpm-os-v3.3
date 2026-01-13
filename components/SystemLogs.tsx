import React, { useState, useContext, useMemo } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ClipboardList, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  ShieldAlert, 
  Filter, 
  Search, 
  Download,
  User,
  Box
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  category: 'Workflow' | 'System' | 'Compliance' | 'Security';
  severity: 'Info' | 'Success' | 'Warning' | 'Error';
  event: string;
  entity: string;
  actor: string;
}

const MOCK_LOGS: LogEntry[] = [
  { id: 'log-001', timestamp: '2026-01-13 13:58', category: 'System', severity: 'Info', event: 'Health Check', entity: 'Heartbeat Service', actor: 'System' },
  { id: 'log-002', timestamp: '2026-01-13 13:45', category: 'Workflow', severity: 'Success', event: 'Batch Released', entity: 'B-2026-01-001', actor: 'Supervisor (A. Kumar)' },
  { id: 'log-003', timestamp: '2026-01-13 13:30', category: 'Compliance', severity: 'Warning', event: 'Validation Warning', entity: 'PCK-009', actor: 'QA System' },
  { id: 'log-004', timestamp: '2026-01-13 13:15', category: 'Security', severity: 'Error', event: 'Unauthorized Access', entity: 'Gateway B', actor: 'Unknown IP' },
  { id: 'log-005', timestamp: '2026-01-13 12:55', category: 'Workflow', severity: 'Info', event: 'Shift Handover', entity: 'Line A', actor: 'System' },
  { id: 'log-006', timestamp: '2026-01-13 12:10', category: 'Compliance', severity: 'Success', event: 'Audit Log Archived', entity: 'Audit-Vault', actor: 'Auditor (J. Doe)' },
  { id: 'log-007', timestamp: '2026-01-13 11:45', category: 'Workflow', severity: 'Warning', event: 'Line Blocked', entity: 'Station 03', actor: 'Operator (R. Singh)' },
];

// Optimized Row Component
const LogRow = React.memo<{ log: LogEntry }>(({ log }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-3 font-mono text-slate-500 text-xs whitespace-nowrap">{log.timestamp}</td>
    <td className="px-6 py-3 font-medium text-slate-700">
      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">
        {log.category}
      </span>
    </td>
    <td className="px-6 py-3">
      <div className="flex items-center gap-2">
        {log.severity === 'Info' && <Info size={16} className="text-blue-500" />}
        {log.severity === 'Success' && <CheckCircle size={16} className="text-green-500" />}
        {log.severity === 'Warning' && <AlertCircle size={16} className="text-amber-500" />}
        {log.severity === 'Error' && <ShieldAlert size={16} className="text-red-500" />}
        <span className={`text-xs font-bold ${
          log.severity === 'Info' ? 'text-blue-700' :
          log.severity === 'Success' ? 'text-green-700' :
          log.severity === 'Warning' ? 'text-amber-700' :
          'text-red-700'
        }`}>{log.severity}</span>
      </div>
    </td>
    <td className="px-6 py-3">
      <div className="font-bold text-slate-800">{log.event}</div>
      <div className="text-xs text-slate-500 mt-0.5">ID: {log.id}</div>
    </td>
    <td className="px-6 py-3">
      <div className="flex items-center gap-1 text-slate-600">
        <Box size={12} />
        <span className="font-mono text-xs">{log.entity}</span>
      </div>
    </td>
    <td className="px-6 py-3">
      <div className="flex items-center gap-1 text-slate-600">
        <User size={12} />
        <span className="text-xs">{log.actor}</span>
      </div>
    </td>
  </tr>
));

export const SystemLogs: React.FC = () => {
  const { role } = useContext(UserContext);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const isOperator = role === UserRole.OPERATOR;
  const isAuditor = role === UserRole.MANAGEMENT || role === UserRole.COMPLIANCE;

  // Memoized Filter Logic (Optimized for large lists)
  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      // Role-based visibility constraints
      if (isOperator && (log.category === 'Security' || log.category === 'Compliance')) return false;
      
      // UI Filters
      if (filterCategory !== 'All' && log.category !== filterCategory) return false;
      if (filterSeverity !== 'All' && log.severity !== filterSeverity) return false;
      
      return true;
    });
  }, [filterCategory, filterSeverity, isOperator]);

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              System <span className="text-slate-300">/</span> Audit
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <ClipboardList className="text-brand-600" size={24} />
             System Event Logs
           </h1>
           <p className="text-slate-500 text-sm mt-1">Unified immutable log stream for audit and diagnostics.</p>
        </div>
        <div className="flex gap-2">
           {isAuditor && (
             <div className="bg-slate-800 text-slate-200 px-3 py-1 rounded text-xs font-bold border border-slate-700 uppercase flex items-center gap-2">
               <ShieldAlert size={14} /> Audit View
             </div>
           )}
           <button className="bg-white border border-slate-300 text-slate-600 px-3 py-2 rounded text-xs font-bold flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50" disabled>
             <Download size={14} /> Export CSV
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-industrial-border flex gap-4 items-center">
         <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Filter size={16} /> Filters:
         </div>
         <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded px-2 py-1 focus:outline-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
         >
            <option value="All">All Categories</option>
            <option value="Workflow">Workflow</option>
            <option value="System">System</option>
            {!isOperator && <option value="Compliance">Compliance</option>}
            {!isOperator && <option value="Security">Security</option>}
         </select>
         <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded px-2 py-1 focus:outline-none"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
         >
            <option value="All">All Severities</option>
            <option value="Info">Info</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error</option>
         </select>
         <div className="flex-1"></div>
         <div className="relative">
            <input type="text" placeholder="Search logs..." className="bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1 text-sm w-64 focus:outline-none" disabled />
            <Search size={14} className="absolute left-2 top-1.5 text-slate-400" />
         </div>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-lg shadow-sm border border-industrial-border overflow-hidden flex-1 flex flex-col">
         <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider w-40">Timestamp (IST)</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider w-32">Category</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider w-24">Severity</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Event & Message</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider w-40">Entity</th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider w-48">Actor</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                    <LogRow key={log.id} log={log} />
                ))}
                </tbody>
            </table>
         </div>
         <div className="p-2 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-400">
            Showing {filteredLogs.length} events. Logs are immutable and retained for compliance.
         </div>
      </div>

    </div>
  );
};