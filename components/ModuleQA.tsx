import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  ClipboardCheck, 
  Microscope, 
  Zap, 
  Ruler, 
  ThumbsUp, 
  ThumbsDown, 
  AlertOctagon,
  Clock,
  Search,
  FileText
} from 'lucide-react';

// Mock Data Types
interface QAModule {
  id: string;
  moduleId: string;
  batchId: string;
  assemblyStation: string;
  assemblyTime: string;
  status: 'Pending' | 'In Review' | 'Cleared' | 'Rework' | 'Hold';
  sku: string;
}

interface InspectionItem {
  id: string;
  category: 'Visual' | 'Electrical' | 'Mechanical';
  label: string;
  spec: string;
  status: 'Pass' | 'Fail' | 'Pending';
}

// Mock Data
const QA_QUEUE: QAModule[] = [
  {
    id: 'm-001',
    moduleId: 'MOD-2026-001-042',
    batchId: 'B-2026-01-001',
    assemblyStation: 'Line A - Stn 04',
    assemblyTime: '2026-01-11 09:15',
    status: 'In Review',
    sku: 'BP-LFP-48V-2.5K'
  },
  {
    id: 'm-002',
    moduleId: 'MOD-2026-001-043',
    batchId: 'B-2026-01-001',
    assemblyStation: 'Line A - Stn 04',
    assemblyTime: '2026-01-11 09:22',
    status: 'Pending',
    sku: 'BP-LFP-48V-2.5K'
  },
  {
    id: 'm-003',
    moduleId: 'MOD-2026-001-038',
    batchId: 'B-2026-01-001',
    assemblyStation: 'Line A - Stn 04',
    assemblyTime: '2026-01-11 08:45',
    status: 'Rework',
    sku: 'BP-LFP-48V-2.5K'
  }
];

const INSPECTION_CHECKLIST: InspectionItem[] = [
  { id: 'chk-v1', category: 'Visual', label: 'Cell Polarity Check', spec: 'Standard SOP', status: 'Pass' },
  { id: 'chk-v2', category: 'Visual', label: 'Weld Integrity', spec: 'No discoloration/burns', status: 'Pending' },
  { id: 'chk-v3', category: 'Visual', label: 'Busbar Alignment', spec: '+/- 0.5mm', status: 'Pending' },
  { id: 'chk-e1', category: 'Electrical', label: 'Open Circuit Voltage (OCV)', spec: '48.2V +/- 0.1V', status: 'Pending' },
  { id: 'chk-e2', category: 'Electrical', label: 'Internal Resistance (IR)', spec: '< 2.5 mΩ', status: 'Pending' },
  { id: 'chk-e3', category: 'Electrical', label: 'BMS Comms Test', spec: 'Ping Success', status: 'Pending' },
  { id: 'chk-m1', category: 'Mechanical', label: 'Module Dimensions (L)', spec: '350mm +/- 1mm', status: 'Pending' },
];

export const ModuleQA: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedModule, setSelectedModule] = useState<QAModule>(QA_QUEUE[0]);
  const [notes, setNotes] = useState('');

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.QA_ENGINEER || 
    role === UserRole.SUPERVISOR || 
    role === UserRole.MANAGEMENT;

  const isReadOnly = role === UserRole.MANAGEMENT || role === UserRole.SUPERVISOR;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Module QA.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Production <span className="text-slate-300">/</span> Quality Control
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <ClipboardCheck className="text-brand-600" size={24} />
             Module Quality Assurance (S6)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Inspect assembled modules, record measurements, and assign quality disposition.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Inspection Queue */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Search size={16} />
               Inspection Queue
             </h3>
             <span className="text-xs text-slate-400">Modules Awaiting Validation</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {QA_QUEUE.map((mod) => (
              <div 
                key={mod.id} 
                onClick={() => setSelectedModule(mod)}
                className={`p-3 rounded-md cursor-pointer border transition-all ${
                  selectedModule.id === mod.id 
                    ? 'bg-brand-50 border-brand-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{mod.moduleId}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    mod.status === 'Cleared' ? 'bg-green-100 text-green-700' :
                    mod.status === 'Rework' ? 'bg-amber-100 text-amber-700' :
                    mod.status === 'In Review' ? 'bg-amber-100 text-amber-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {mod.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2">{mod.sku}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                   <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {mod.assemblyTime.split(' ')[1]}
                   </span>
                   <span className="bg-slate-100 px-1 rounded">{mod.assemblyStation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Inspection Desk */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{selectedModule.moduleId}</h2>
                <div className="flex items-center gap-2">
                   <span className="text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">{selectedModule.batchId}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500">SKU: {selectedModule.sku}</p>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Current Status</div>
                <div className={`text-lg font-bold ${
                    selectedModule.status === 'Rework' ? 'text-amber-600' : 
                    selectedModule.status === 'Cleared' ? 'text-green-600' : 'text-amber-600'
                }`}>
                    {selectedModule.status}
                </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. Checklist Grid */}
            <div className="grid grid-cols-1 gap-6">
                
                {/* Visual */}
                <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Microscope size={16} className="text-purple-500" />
                        Visual Inspection
                    </h3>
                    <div className="space-y-2">
                        {INSPECTION_CHECKLIST.filter(i => i.category === 'Visual').map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                <div>
                                    <div className="text-sm font-medium text-slate-700">{item.label}</div>
                                    <div className="text-xs text-slate-400">Spec: {item.spec}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="h-8 w-8 rounded flex items-center justify-center border border-slate-300 text-slate-300 hover:text-green-600 hover:border-green-600 disabled:opacity-50" disabled>
                                        <ThumbsUp size={14} />
                                    </button>
                                    <button className="h-8 w-8 rounded flex items-center justify-center border border-slate-300 text-slate-300 hover:text-red-600 hover:border-red-600 disabled:opacity-50" disabled>
                                        <ThumbsDown size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Electrical */}
                <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Zap size={16} className="text-amber-500" />
                        Electrical Tests
                    </h3>
                    <div className="space-y-2">
                        {INSPECTION_CHECKLIST.filter(i => i.category === 'Electrical').map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                <div>
                                    <div className="text-sm font-medium text-slate-700">{item.label}</div>
                                    <div className="text-xs text-slate-400">Spec: {item.spec}</div>
                                </div>
                                <div className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-400">
                                    -- / --
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                 {/* Mechanical */}
                <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Ruler size={16} className="text-blue-500" />
                        Mechanical Inspection
                    </h3>
                     <div className="space-y-2">
                        {INSPECTION_CHECKLIST.filter(i => i.category === 'Mechanical').map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                <div>
                                    <div className="text-sm font-medium text-slate-700">{item.label}</div>
                                    <div className="text-xs text-slate-400">Spec: {item.spec}</div>
                                </div>
                                <div className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-400">
                                    -- mm
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* 2. QA Notes */}
            <section className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText size={14} />
                    Quality Notes (Session Only)
                </h3>
                <textarea 
                    className="w-full text-sm p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white text-slate-700"
                    rows={3}
                    placeholder="Enter observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isReadOnly}
                />
            </section>

             {/* 3. Disposition Actions */}
            <section className="pt-4 border-t border-slate-100">
                <div className="flex gap-4">
                    <button 
                        disabled={isReadOnly || true} 
                        className="flex-1 bg-green-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm hover:bg-green-700"
                        title="Demo Mode: Backend locked"
                    >
                        <ThumbsUp size={16} />
                        Mark as Cleared
                    </button>
                    <button 
                        disabled={isReadOnly || true} 
                        className="flex-1 bg-amber-500 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm hover:bg-amber-600"
                        title="Demo Mode: Backend locked"
                    >
                        <AlertOctagon size={16} />
                        Route to Rework
                    </button>
                    <button 
                        disabled={isReadOnly || true} 
                        className="flex-1 bg-red-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm hover:bg-red-700"
                        title="Demo Mode: Backend locked"
                    >
                        <ShieldAlert size={16} />
                        Quarantine / Hold
                    </button>
                </div>
                 <p className="text-center text-xs text-slate-400 mt-3">
                    Disposition actions are disabled in Frontend-Only Demo Mode.
                </p>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};