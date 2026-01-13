import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  Recycle, 
  Search, 
  Battery, 
  RotateCcw, 
  Ban, 
  Factory, 
  Leaf, 
  Scale, 
  FileCheck, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// Mock Data Types
interface EolUnit {
  id: string;
  packId: string;
  customer: string;
  reason: 'End of Life' | 'Damage' | 'Recall' | 'Warranty Return';
  status: 'Pending Intake' | 'Received' | 'Sorted' | 'Processed';
  weight: string;
  chemistry: string;
}

// Mock Data
const INTAKE_QUEUE: EolUnit[] = [
  {
    id: 'eol-001',
    packId: 'PCK-2022-098-001',
    customer: 'EcoRide Logistics',
    reason: 'End of Life',
    status: 'Pending Intake',
    weight: '18.2 kg',
    chemistry: 'LFP'
  },
  {
    id: 'eol-002',
    packId: 'PCK-2024-012-044',
    customer: 'CityBus Metro',
    reason: 'Damage',
    status: 'Received',
    weight: '420 kg',
    chemistry: 'NMC'
  },
  {
    id: 'eol-003',
    packId: 'PCK-2023-005-019',
    customer: 'Private Fleet B',
    reason: 'Recall',
    status: 'Sorted',
    weight: '18.5 kg',
    chemistry: 'LFP'
  }
];

export const RecyclingRecovery: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedUnit, setSelectedUnit] = useState<EolUnit>(INTAKE_QUEUE[0]);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.SUSTAINABILITY || 
    role === UserRole.SERVICE || 
    role === UserRole.MANAGEMENT;

  // Auditor is strictly read-only
  const isAuditor = role === UserRole.MANAGEMENT;
  // Service Engineer is read-only in this context as per previous logic (but can see buttons disabled usually)
  // For this patch, we enforce hidden buttons for Auditor specifically.
  const isReadOnly = isAuditor || role === UserRole.SERVICE;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Recycling & Recovery.</p>
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
              Track & Lifecycle <span className="text-slate-300">/</span> Recovery
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Recycle className="text-brand-600" size={24} />
             Recycling & Recovery (S16)
           </h1>
           <p className="text-slate-500 text-sm mt-1">End-of-Life (EOL) management, sorting, and material recovery processing (Track -> Trace Bridge).</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded border border-green-200 text-xs font-bold">
             <Leaf size={14} />
             <span>SUSTAINABILITY TRACKING</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Intake Queue */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <RotateCcw size={16} />
               Returns Intake (Current State)
             </h3>
             <span className="text-xs text-slate-400">Pending Disposition</span>
          </div>
          <div className="p-3 border-b border-slate-100">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Scan Return ID..." 
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 pl-9 focus:outline-none focus:border-brand-500"
                  disabled={isReadOnly}
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
             </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {INTAKE_QUEUE.map((unit) => (
              <div 
                key={unit.id} 
                onClick={() => setSelectedUnit(unit)}
                className={`p-3 rounded-md cursor-pointer border transition-all ${
                  selectedUnit.id === unit.id 
                    ? 'bg-brand-50 border-brand-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{unit.packId}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    unit.status === 'Sorted' ? 'bg-green-100 text-green-700' :
                    unit.status === 'Received' ? 'bg-amber-100 text-amber-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {unit.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-1">{unit.customer}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                   <span className={`px-1 rounded border ${
                       unit.reason === 'Damage' ? 'bg-red-50 text-red-600 border-red-100' : 
                       'bg-slate-50 text-slate-500 border-slate-100'
                   }`}>{unit.reason}</span>
                   <span>{unit.chemistry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Inspection & Sorting */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                    <Battery size={24} className="text-slate-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedUnit.packId}</h2>
                    <p className="text-xs text-slate-500 font-mono">Weight: {selectedUnit.weight}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Disposition</div>
                <div className={`text-lg font-bold ${
                    selectedUnit.status === 'Sorted' ? 'text-green-600' : 'text-slate-600'
                }`}>
                    {selectedUnit.status.toUpperCase()}
                </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Sorting Actions - Hidden for Auditor */}
            {!isAuditor && (
              <section>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Factory size={16} className="text-brand-500" />
                      Inspection & Sorting (Track -> Trace)
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <button 
                          disabled={true} 
                          className="p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors flex flex-col items-center text-center gap-2 opacity-80 cursor-not-allowed"
                      >
                          <RotateCcw size={24} className="text-green-600" />
                          <span className="text-sm font-bold text-green-900">Reuse</span>
                          <span className="text-[10px] text-green-700">2nd Life Application</span>
                      </button>

                      <button 
                          disabled={true} 
                          className="p-4 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors flex flex-col items-center text-center gap-2 opacity-80 cursor-not-allowed"
                      >
                          <Battery size={24} className="text-blue-600" />
                          <span className="text-sm font-bold text-blue-900">Refurbish</span>
                          <span className="text-[10px] text-blue-700">Module Replacement</span>
                      </button>

                      <button 
                          disabled={true} 
                          className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center text-center gap-2 opacity-80 cursor-not-allowed"
                      >
                          <Recycle size={24} className="text-slate-600" />
                          <span className="text-sm font-bold text-slate-900">Recycle</span>
                          <span className="text-xs text-slate-500">Material Recovery</span>
                      </button>

                      <button 
                          disabled={true} 
                          className="p-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors flex flex-col items-center text-center gap-2 opacity-80 cursor-not-allowed"
                      >
                          <Ban size={24} className="text-red-600" />
                          <span className="text-sm font-bold text-red-900">Quarantine</span>
                          <span className="text-xs text-red-700">Hazardous / Damaged</span>
                      </button>
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-3">
                      Disposition actions are disabled in Frontend-Only Demo Mode.
                  </p>
              </section>
            )}

            {/* 2. Material Recovery Snapshot */}
            <section className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Scale size={16} className="text-brand-500" />
                    Material Recovery Estimate (Trace Origin Reference)
                </h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Process Route</div>
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                            {selectedUnit.chemistry === 'LFP' ? 'Hydrometallurgy' : 'Pyrometallurgy'}
                            <ArrowRight size={12} className="text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Est. Recoverable Mass</div>
                        <div className="font-bold text-slate-800">
                             ~{(parseFloat(selectedUnit.weight) * 0.65).toFixed(1)} kg <span className="text-xs font-normal text-slate-500">(65%)</span>
                        </div>
                    </div>
                     <div>
                        <div className="text-xs text-slate-500 mb-1">Primary Outputs</div>
                        <div className="flex gap-1">
                             <span className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded">Black Mass</span>
                             <span className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded">Al</span>
                             <span className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded">Cu</span>
                        </div>
                    </div>
                </div>
            </section>

             {/* 3. Compliance / EPR Panel */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileCheck size={16} className="text-brand-500" />
                Compliance & EPR
              </h3>
              <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded">
                      <span className="text-sm text-slate-700">Extended Producer Responsibility (EPR) Eligible</span>
                      <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded">YES</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded">
                      <span className="text-sm text-slate-700">Chain of Custody Complete</span>
                      <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded">YES</span>
                  </div>
                   <div className="flex items-center justify-between p-3 border border-slate-100 rounded bg-amber-50">
                      <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" />
                          <span className="text-sm text-slate-700">Recycling Certificate</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">PENDING PROCESS</span>
                  </div>
              </div>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};