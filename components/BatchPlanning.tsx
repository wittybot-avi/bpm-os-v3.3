import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  CalendarClock, 
  Factory, 
  Lock, 
  PlayCircle, 
  Plus, 
  CalendarDays, 
  MoreHorizontal, 
  Timer, 
  Boxes 
} from 'lucide-react';

// Mock Data Types
interface PlanningBatch {
  id: string;
  batchCode: string;
  skuCode: string;
  skuName: string;
  qty: number;
  targetLine: string;
  startDate: string;
  status: 'Draft' | 'Planned' | 'Locked' | 'Released';
  readiness: {
    materials: 'Ready' | 'Shortage' | 'Allocated';
    line: 'Available' | 'Maintenance' | 'Occupied';
  };
  estCycleTime: string;
}

// Mock Data
const MOCK_BATCHES: PlanningBatch[] = [
  {
    id: 'b-001',
    batchCode: 'B-2026-01-001',
    skuCode: 'BP-LFP-48V-2.5K',
    skuName: 'E-Scooter Standard Pack',
    qty: 500,
    targetLine: 'Line A (Assembly)',
    startDate: '2026-01-12',
    status: 'Locked',
    readiness: { materials: 'Allocated', line: 'Available' },
    estCycleTime: '8 Hours'
  },
  {
    id: 'b-002',
    batchCode: 'B-2026-01-002',
    skuCode: 'BP-NMC-800V-75K',
    skuName: 'EV High Performance Pack',
    qty: 50,
    targetLine: 'Line B (High Voltage)',
    startDate: '2026-01-14',
    status: 'Planned',
    readiness: { materials: 'Ready', line: 'Available' },
    estCycleTime: '12 Hours'
  },
  {
    id: 'b-003',
    batchCode: 'B-2026-01-003',
    skuCode: 'BP-LTO-24V-1K',
    skuName: 'AGV Fast Charge Pack',
    qty: 200,
    targetLine: 'Line A (Assembly)',
    startDate: '2026-01-15',
    status: 'Draft',
    readiness: { materials: 'Shortage', line: 'Available' },
    estCycleTime: '4 Hours'
  }
];

export const BatchPlanning: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedBatch, setSelectedBatch] = useState<PlanningBatch>(MOCK_BATCHES[0]);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.PLANNER || 
    role === UserRole.SUPERVISOR || 
    role === UserRole.MANAGEMENT;

  const isReadOnly = role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Batch Planning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Production <span className="text-slate-300">/</span> Planning
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <CalendarClock className="text-brand-600" size={24} />
             Batch Planning & Scheduling (S4)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Schedule production runs, assign lines, and lock execution batches.</p>
        </div>
        {!isReadOnly && (
          <div className="flex gap-3">
             <button 
              className="bg-brand-600 text-white px-4 py-2 rounded-md font-medium text-sm opacity-50 cursor-not-allowed flex items-center gap-2"
              disabled
              title="Demo Mode: Backend not connected"
            >
              <Plus size={16} />
              <span>Create Batch</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Batch List */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <CalendarDays size={16} />
               Production Schedule
             </h3>
             <span className="text-xs text-slate-400">Upcoming Runs</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {MOCK_BATCHES.map((batch) => (
              <div 
                key={batch.id} 
                onClick={() => setSelectedBatch(batch)}
                className={`p-3 rounded-md cursor-pointer border transition-all ${
                  selectedBatch.id === batch.id 
                    ? 'bg-brand-50 border-brand-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{batch.batchCode}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    batch.status === 'Locked' ? 'bg-green-100 text-green-700' :
                    batch.status === 'Planned' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2 truncate">{batch.skuName}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Factory size={10} />
                    {batch.targetLine.split(' ')[0]} {batch.targetLine.split(' ')[1]}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={10} />
                    {batch.startDate}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-1 rounded font-mono">Qty: {batch.qty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Planning Detail */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{selectedBatch.batchCode}</h2>
                <div className="flex items-center gap-2">
                   <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">{selectedBatch.skuCode}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1">{selectedBatch.skuName}</p>
            </div>
            
            <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. Planning Overview */}
            <section className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded border border-slate-200">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2 flex items-center gap-1">
                        <Factory size={12} /> Target Facility
                    </div>
                    <div className="font-medium text-slate-900">{selectedBatch.targetLine}</div>
                    <div className="text-xs text-slate-500 mt-1">Single Shift Operation</div>
                </div>
                <div className="p-4 bg-slate-50 rounded border border-slate-200">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2 flex items-center gap-1">
                        <Timer size={12} /> Execution Estimates
                    </div>
                    <div className="font-medium text-slate-900">Start: {selectedBatch.startDate}</div>
                    <div className="text-xs text-slate-500 mt-1">Est. Cycle Time: {selectedBatch.estCycleTime}</div>
                </div>
            </section>

            {/* 2. Readiness Indicators */}
            <section>
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Boxes size={16} className="text-brand-500" />
                    Pre-Requisites
                 </h3>
                 <div className="space-y-3">
                    {/* Material Readiness */}
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                                selectedBatch.readiness.materials === 'Shortage' ? 'bg-red-500' : 'bg-green-500'
                            }`} />
                            <span className="text-sm font-medium text-slate-700">Material Availability</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                            selectedBatch.readiness.materials === 'Shortage' 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-green-50 text-green-700'
                        }`}>
                            {selectedBatch.readiness.materials}
                        </span>
                    </div>

                     {/* Line Readiness */}
                     <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-slate-700">Line Readiness</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-green-50 text-green-700">
                            {selectedBatch.readiness.line}
                        </span>
                    </div>
                 </div>
            </section>

             {/* 3. Actions */}
            <section className="pt-4 border-t border-slate-100">
                <div className="flex gap-4">
                    <button 
                        disabled 
                        className="flex-1 bg-white border border-slate-300 text-slate-400 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                        title="Demo Mode: Backend locked"
                    >
                        <Lock size={16} />
                        Lock Batch Plan
                    </button>
                    <button 
                        disabled 
                        className="flex-1 bg-brand-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm"
                        title="Demo Mode: Backend locked"
                    >
                        <PlayCircle size={16} />
                        Release to Production
                    </button>
                </div>
                 <p className="text-center text-xs text-slate-400 mt-3">
                    Actions are disabled in Frontend-Only Demo Mode.
                </p>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};