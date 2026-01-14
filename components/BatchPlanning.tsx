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
  Boxes,
  Database,
  Edit3
} from 'lucide-react';
import { StageStateBanner } from './StageStateBanner';
import { PreconditionsPanel } from './PreconditionsPanel';
import { DisabledHint } from './DisabledHint';
import { getMockS4Context, S4Context } from '../stages/s4/s4Contract';
import { getS4ActionState, S4ActionId } from '../stages/s4/s4Guards';

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
  
  // S4 Context (Read-Only Mock)
  const [s4Context] = useState<S4Context>(getMockS4Context());

  // Helper to resolve action state
  const getAction = (actionId: S4ActionId) => getS4ActionState(role, s4Context, actionId);

  // Pre-calculate action states
  const createState = getAction('CREATE_BATCH_PLAN');
  const editState = getAction('EDIT_BATCH_PLAN');
  const lockState = getAction('LOCK_BATCH_PLAN');
  const releaseState = getAction('RELEASE_BATCHES_TO_LINE');

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.PLANNER || 
    role === UserRole.SUPERVISOR || 
    role === UserRole.MANAGEMENT;

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
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
             <button 
              className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!editState.enabled}
              title={editState.reason}
            >
              <Edit3 size={16} />
              <span>Edit Plan</span>
            </button>
             <button 
              className="bg-brand-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!createState.enabled}
              title={createState.reason}
            >
              <Plus size={16} />
              <span>Create Batch</span>
            </button>
          </div>
          {!createState.enabled && (
             <DisabledHint reason={createState.reason || 'Blocked'} className="mt-1" />
          )}
          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
            <Database size={10} />
            <span>Planned: {s4Context.plannedBatchCount}</span>
            <span className="text-slate-300">|</span>
            <span>Active: {s4Context.activeBatchCount}</span>
            <span className="text-slate-300">|</span>
            <span className={`font-bold ${s4Context.planningStatus === 'PLANNED' ? 'text-green-600' : 'text-blue-600'}`}>
              {s4Context.planningStatus}
            </span>
          </div>
        </div>
      </div>

      <StageStateBanner stageId="S4" />
      <PreconditionsPanel stageId="S4" />

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
                    <div className="flex-1 flex flex-col">
                        <button 
                            disabled={!lockState.enabled} 
                            className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            title={lockState.reason}
                        >
                            <Lock size={16} />
                            Lock Batch Plan
                        </button>
                        {!lockState.enabled && <DisabledHint reason={lockState.reason || 'Blocked'} className="mx-auto" />}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <button 
                            disabled={!releaseState.enabled} 
                            className="w-full bg-brand-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
                            title={releaseState.reason}
                        >
                            <PlayCircle size={16} />
                            Release to Production
                        </button>
                        {!releaseState.enabled && <DisabledHint reason={releaseState.reason || 'Blocked'} className="mx-auto" />}
                    </div>
                </div>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};
