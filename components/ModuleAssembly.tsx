import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  Wrench, 
  Zap, 
  CheckSquare, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  Box,
  Cpu,
  Activity
} from 'lucide-react';

// Mock Data Types
interface ActiveBatch {
  id: string;
  batchCode: string;
  skuCode: string;
  moduleType: string;
  plannedQty: number;
  completedQty: number;
  targetLine: string;
  status: 'Running' | 'Paused' | 'Stopped';
}

interface AssemblyTask {
  id: number;
  label: string;
  required: boolean;
}

// Mock Data
const ACTIVE_BATCH: ActiveBatch = {
  id: 'b-001',
  batchCode: 'B-2026-01-001',
  skuCode: 'BP-LFP-48V-2.5K',
  moduleType: '48V Standard Module (16S1P)',
  plannedQty: 500,
  completedQty: 124,
  targetLine: 'Line A - Station 04',
  status: 'Running'
};

const TASKS: AssemblyTask[] = [
  { id: 1, label: 'Scan Cell Batch QR', required: true },
  { id: 2, label: 'Load Cells into Holder', required: true },
  { id: 3, label: 'Apply Thermal Interface Material', required: true },
  { id: 4, label: 'Install Busbars & Fix', required: true },
  { id: 5, label: 'Connect BMS Sensing Harness', required: true },
  { id: 6, label: 'Visual Inspection (Polarity Check)', required: true },
];

export const ModuleAssembly: React.FC = () => {
  const { role } = useContext(UserContext);
  // Local state for demo counter simulation (visual only)
  const [localCount, setLocalCount] = useState(ACTIVE_BATCH.completedQty);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.OPERATOR || 
    role === UserRole.SUPERVISOR || 
    role === UserRole.MANAGEMENT;

  const isReadOnly = role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Module Assembly Workstations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Production <span className="text-slate-300">/</span> Module Line
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Wrench className="text-brand-600" size={24} />
             Module Assembly Workstation (S5)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Operator Interface: Assembly Execution & Quality Check.</p>
        </div>
        <div className="flex items-center gap-2">
             <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                <Activity size={14} /> Line Active
             </span>
        </div>
      </div>

      {/* Active Batch Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-md shrink-0 border border-slate-700">
          <div className="flex justify-between items-start">
             <div>
                <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Active Job Context</div>
                <div className="text-3xl font-mono font-bold text-white mb-2">{ACTIVE_BATCH.batchCode}</div>
                <div className="flex gap-4 text-sm text-slate-300">
                   <div className="flex items-center gap-1">
                      <Cpu size={14} className="text-brand-400" />
                      <span>{ACTIVE_BATCH.skuCode}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Box size={14} className="text-brand-400" />
                      <span>{ACTIVE_BATCH.moduleType}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Activity size={14} className="text-brand-400" />
                      <span>{ACTIVE_BATCH.targetLine}</span>
                   </div>
                </div>
             </div>
             <div className="text-right">
                <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Progress</div>
                <div className="text-3xl font-mono font-bold text-brand-400">
                   {localCount} <span className="text-lg text-slate-500">/ {ACTIVE_BATCH.plannedQty}</span>
                </div>
                <div className="w-48 bg-slate-800 rounded-full h-2 mt-2 ml-auto overflow-hidden">
                   <div className="bg-brand-500 h-full transition-all duration-500" style={{ width: `${(localCount / ACTIVE_BATCH.plannedQty) * 100}%` }}></div>
                </div>
             </div>
          </div>
      </div>

      {/* Operator Workspace Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left: Task Checklist */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <CheckSquare size={16} />
               SOP Checklist
             </h3>
             <span className="text-xs text-slate-400">Standard Assembly Steps</span>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
             {TASKS.map((task) => (
                <div key={task.id} className="flex items-center p-3 rounded border border-slate-200 bg-slate-50 opacity-80">
                   <div className="h-6 w-6 rounded border-2 border-slate-300 mr-3 flex items-center justify-center bg-white">
                      <span className="text-xs font-bold text-slate-300">{task.id}</span>
                   </div>
                   <span className="text-sm font-medium text-slate-700">{task.label}</span>
                </div>
             ))}
             <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex items-start gap-2">
                <Zap size={14} className="mt-0.5 shrink-0" />
                <p>Digital SOP steps are displayed for guidance. Interactive validation is disabled in demo mode.</p>
             </div>
          </div>
        </div>

        {/* Right: Controls & Quality */}
        <div className="col-span-8 flex flex-col gap-6">
           
           {/* Primary Action Panel */}
           <div className="bg-white rounded-lg shadow-sm border border-industrial-border p-6 flex-1 flex flex-col justify-center items-center gap-6">
              <div className="text-center mb-4">
                 <h2 className="text-lg font-bold text-slate-700">Module Completion</h2>
                 <p className="text-slate-500 text-sm">Verify assembly and register unit completion</p>
              </div>
              
              <div className="flex gap-6 w-full max-w-lg">
                 <button 
                    disabled={isReadOnly}
                    className="flex-1 h-24 bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    title={isReadOnly ? "Read Only" : "Demo Mode"}
                 >
                    <CheckSquare size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-lg">ASSEMBLY OK</span>
                    <span className="text-[10px] opacity-75">Increment Counter (Disabled)</span>
                 </button>
                 
                 <button 
                    disabled={isReadOnly}
                    className="flex-1 h-24 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    title={isReadOnly ? "Read Only" : "Demo Mode"}
                 >
                    <RotateCcw size={32} className="group-hover:rotate-[-45deg] transition-transform" />
                    <span className="font-bold text-lg">REWORK</span>
                    <span className="text-[10px] opacity-75">Flag for Repair (Disabled)</span>
                 </button>
              </div>

              <button 
                  disabled={isReadOnly}
                  className="mt-2 text-red-500 hover:text-red-700 font-medium flex items-center gap-2 border border-red-200 hover:bg-red-50 px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                  <AlertTriangle size={18} />
                  <span>Raise Quality Alert (Hold)</span>
              </button>
           </div>

           {/* Workstation Controls */}
           <div className="bg-white rounded-lg shadow-sm border border-industrial-border p-4 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded text-slate-600">
                     <Wrench size={20} />
                  </div>
                  <div>
                     <div className="font-bold text-slate-700 text-sm">Station Controls</div>
                     <div className="text-xs text-slate-500">Machine interlocks active</div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="bg-slate-100 text-slate-400 p-3 rounded-md cursor-not-allowed" disabled>
                     <Pause size={20} fill="currentColor" />
                  </button>
                  <button className="bg-green-100 text-green-600 p-3 rounded-md cursor-not-allowed border border-green-200" disabled>
                     <Play size={20} fill="currentColor" />
                  </button>
               </div>
           </div>

        </div>

      </div>
    </div>
  );
};