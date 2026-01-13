import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  FileCheck, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Box, 
  FileText,
  Stamp,
  ClipboardList,
  ShieldCheck,
  History,
  Zap
} from 'lucide-react';

// Mock Data Types
interface ReviewPack {
  id: string;
  packId: string;
  batchId: string;
  sku: string;
  completionTime: string;
  status: 'Pending' | 'Approved' | 'Hold' | 'Reject';
  assemblyStatus: 'Complete';
  qaStatus: 'Passed' | 'Flagged';
  safetyStatus: 'Passed';
}

// Mock Data
const PACK_QUEUE: ReviewPack[] = [
  {
    id: 'pk-001',
    packId: 'PCK-2026-001-012',
    batchId: 'P-2026-01-001',
    sku: 'BP-LFP-48V-2.5K',
    completionTime: '2026-01-11 14:30',
    status: 'Pending',
    assemblyStatus: 'Complete',
    qaStatus: 'Passed',
    safetyStatus: 'Passed'
  },
  {
    id: 'pk-002',
    packId: 'PCK-2026-001-013',
    batchId: 'P-2026-01-001',
    sku: 'BP-LFP-48V-2.5K',
    completionTime: '2026-01-11 15:45',
    status: 'Hold',
    assemblyStatus: 'Complete',
    qaStatus: 'Flagged',
    safetyStatus: 'Passed'
  },
  {
    id: 'pk-003',
    packId: 'PCK-2026-001-010',
    batchId: 'P-2026-01-001',
    sku: 'BP-LFP-48V-2.5K',
    completionTime: '2026-01-11 11:15',
    status: 'Approved',
    assemblyStatus: 'Complete',
    qaStatus: 'Passed',
    safetyStatus: 'Passed'
  }
];

export const PackReview: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedPack, setSelectedPack] = useState<ReviewPack>(PACK_QUEUE[0]);
  const [notes, setNotes] = useState('');

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.QA_ENGINEER || 
    role === UserRole.SUPERVISOR || 
    role === UserRole.MANAGEMENT;

  const isReadOnly = role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Pack Review & Approval.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Production <span className="text-slate-300">/</span> Final Review
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <FileCheck className="text-brand-600" size={24} />
             Pack Review & Approval (S8)
           </h1>
           <p className="text-slate-500 text-sm mt-1">End-of-Line (EOL) validation and final release decision.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Review Queue */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Search size={16} />
               Approval Queue
             </h3>
             <span className="text-xs text-slate-400">Packs awaiting release</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {PACK_QUEUE.map((pack) => (
              <div 
                key={pack.id} 
                onClick={() => setSelectedPack(pack)}
                className={`p-3 rounded-md cursor-pointer border transition-all ${
                  selectedPack.id === pack.id 
                    ? 'bg-brand-50 border-brand-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{pack.packId}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    pack.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    pack.status === 'Hold' ? 'bg-red-100 text-red-700' :
                    pack.status === 'Reject' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {pack.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2">{pack.sku}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                   <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {pack.completionTime.split(' ')[1]}
                   </span>
                   <span className="bg-slate-100 px-1 rounded">{pack.batchId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Detail View */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-white rounded border border-slate-200 shadow-sm">
                    <Box size={24} className="text-brand-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedPack.packId}</h2>
                    <p className="text-xs text-slate-500 font-mono">Batch: {selectedPack.batchId}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Review Status</div>
                <div className={`text-xl font-bold ${
                    selectedPack.status === 'Approved' ? 'text-green-600' :
                    selectedPack.status === 'Hold' ? 'text-red-600' :
                    selectedPack.status === 'Reject' ? 'text-red-600' :
                    'text-amber-600'
                }`}>
                    {selectedPack.status}
                </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. Summary Cards */}
            <section className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded border border-slate-200 flex flex-col gap-2">
                    <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <ClipboardList size={14} /> Assembly
                    </div>
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                        <CheckCircle size={18} />
                        <span>Completed (8/8)</span>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded border border-slate-200 flex flex-col gap-2">
                     <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <ShieldCheck size={14} /> QA Checks
                    </div>
                    <div className={`flex items-center gap-2 font-medium ${selectedPack.qaStatus === 'Passed' ? 'text-green-700' : 'text-amber-700'}`}>
                        {selectedPack.qaStatus === 'Passed' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                        <span>{selectedPack.qaStatus}</span>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded border border-slate-200 flex flex-col gap-2">
                     <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Zap size={14} /> Electrical Safety
                    </div>
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                        <CheckCircle size={18} />
                        <span>Hi-Pot OK</span>
                    </div>
                </div>
            </section>

            {/* 2. Reviewer Notes */}
            <section>
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-brand-500" />
                    Reviewer Remarks
                 </h3>
                <textarea 
                    className="w-full text-sm p-3 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-white text-slate-700"
                    rows={3}
                    placeholder="Enter approval notes or rejection reasons (Demo / Temporary)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isReadOnly}
                />
            </section>

             {/* 3. Decision Panel */}
            <section className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Stamp size={16} className="text-slate-600" />
                    Final Disposition Decision
                 </h3>
                <div className="flex gap-4">
                    <button 
                        disabled={isReadOnly || true} 
                        className="flex-1 bg-green-600 text-white py-4 rounded-lg font-bold text-base flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed shadow-sm hover:bg-green-700"
                        title="Demo Mode: Backend locked"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle size={20} />
                            <span>APPROVE PACK</span>
                        </div>
                        <span className="text-[10px] font-normal opacity-80">Release to Finished Goods</span>
                    </button>
                    
                    <button 
                        disabled={isReadOnly || true} 
                        className="flex-1 bg-amber-500 text-white py-4 rounded-lg font-bold text-base flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed shadow-sm hover:bg-amber-600"
                        title="Demo Mode: Backend locked"
                    >
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={20} />
                            <span>HOLD</span>
                        </div>
                        <span className="text-[10px] font-normal opacity-80">Requires Further Investigation</span>
                    </button>

                    <button 
                        disabled={isReadOnly || true} 
                        className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold text-base flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed shadow-sm hover:bg-red-700"
                        title="Demo Mode: Backend locked"
                    >
                        <div className="flex items-center gap-2">
                            <XCircle size={20} />
                            <span>REJECT</span>
                        </div>
                        <span className="text-[10px] font-normal opacity-80">Scrap or Major Rework</span>
                    </button>
                </div>
                 <div className="flex justify-center items-center gap-2 mt-4 text-xs text-slate-400">
                    <History size={12} />
                    <span>Decision history is not persisted in Frontend-Only Demo Mode.</span>
                </div>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};