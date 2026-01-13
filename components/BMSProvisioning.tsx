import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  Cpu, 
  Link, 
  Wifi, 
  Download, 
  CheckCircle2, 
  ScanLine, 
  FileCode,
  Settings,
  Battery,
  AlertTriangle,
  Radio
} from 'lucide-react';

// Mock Data Types
interface ProvisioningPack {
  id: string;
  packId: string;
  sku: string;
  approvalDate: string;
  status: 'Pending' | 'Provisioned';
  targetProfile: string;
}

// Mock Data
const PROVISIONING_QUEUE: ProvisioningPack[] = [
  {
    id: 'prov-001',
    packId: 'PCK-2026-001-012',
    sku: 'BP-LFP-48V-2.5K',
    approvalDate: '2026-01-11 14:30',
    status: 'Pending',
    targetProfile: 'LFP-48V-STD-V2.1'
  },
  {
    id: 'prov-002',
    packId: 'PCK-2026-001-014',
    sku: 'BP-LFP-48V-2.5K',
    approvalDate: '2026-01-11 16:15',
    status: 'Pending',
    targetProfile: 'LFP-48V-STD-V2.1'
  },
  {
    id: 'prov-003',
    packId: 'PCK-2026-002-005',
    sku: 'BP-NMC-800V-75K',
    approvalDate: '2026-01-11 10:00',
    status: 'Pending',
    targetProfile: 'NMC-HV-PERF-V3.0'
  }
];

export const BMSProvisioning: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedPack, setSelectedPack] = useState<ProvisioningPack>(PROVISIONING_QUEUE[0]);
  const [bmsSerial, setBmsSerial] = useState('');

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.ENGINEERING || 
    role === UserRole.SUPERVISOR || 
    role === UserRole.MANAGEMENT;

  const isReadOnly = role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view BMS Provisioning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Trace & Identity <span className="text-slate-300">/</span> Provisioning
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Cpu className="text-brand-600" size={24} />
             BMS Provisioning (S10)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Firmware flashing, configuration injection, and digital identity binding (Trace).</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600 border border-slate-200">
             <Wifi size={14} className="text-green-500" />
             <span>CAN-BUS: ONLINE</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Queue */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Battery size={16} />
               Eligible Packs
             </h3>
             <span className="text-xs text-slate-400">Approved & Ready for Commissioning</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {PROVISIONING_QUEUE.map((pack) => (
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
                    pack.status === 'Provisioned' ? 'bg-green-100 text-green-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {pack.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2">{pack.sku}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                   <Settings size={10} />
                   <span className="font-mono">{pack.targetProfile}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Provisioning Workstation */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                    <Battery size={24} className="text-slate-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedPack.packId}</h2>
                    <p className="text-xs text-slate-500 font-mono">Profile: {selectedPack.targetProfile}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Identity Binding */}
            <section className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <ScanLine size={16} className="text-brand-500" />
                    BMS Identity Binding
                </h3>
                <p className="text-xs text-slate-400 mb-4">Establishes permanent component lineage (Trace).</p>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">BMS Serial Number (Scan / Input)</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full text-sm p-2 pl-9 border border-slate-300 rounded focus:outline-none focus:border-brand-500 font-mono"
                                placeholder="Scan BMS Barcode..."
                                value={bmsSerial}
                                onChange={(e) => setBmsSerial(e.target.value)}
                                disabled={isReadOnly}
                            />
                            <Radio size={14} className="absolute left-3 top-3 text-slate-400" />
                        </div>
                    </div>
                    
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Target Firmware Version</label>
                        <div className="relative">
                            <select 
                                className="w-full text-sm p-2 pl-9 border border-slate-300 rounded focus:outline-none focus:border-brand-500 appearance-none bg-white"
                                disabled={isReadOnly}
                            >
                                <option>v2.4.1 (Stable) - Recommended</option>
                                <option>v2.4.0 (Previous)</option>
                                <option>v3.0.0 (Beta)</option>
                            </select>
                            <FileCode size={14} className="absolute left-3 top-3 text-slate-400" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Provisioning Actions */}
            <section>
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Link size={16} className="text-brand-500" />
                    Commissioning Actions
                </h3>
                
                <div className="flex gap-4 items-center">
                    <button 
                        disabled={isReadOnly || true} 
                        className="flex-1 bg-brand-600 text-white py-4 rounded-lg font-bold text-base flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm hover:bg-brand-700"
                        title="Demo Mode: Hardware interface disabled"
                    >
                        <div className="flex items-center gap-2">
                            <Download size={20} />
                            <span>FLASH & BIND</span>
                        </div>
                        <span className="text-[10px] font-normal opacity-80">Write Config & Lock Identity</span>
                    </button>

                    <button 
                        disabled={isReadOnly || true} 
                        className="w-1/3 bg-white border border-slate-300 text-slate-500 py-4 rounded-lg font-bold text-sm flex flex-col items-center justify-center gap-1 opacity-60 cursor-not-allowed"
                         title="Demo Mode: Hardware interface disabled"
                    >
                        <Wifi size={20} />
                        <span>Ping BMS</span>
                    </button>
                </div>
            </section>
            
            {/* 3. Visualization */}
            <section className="pt-4 border-t border-slate-100">
                 <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Provisioning Trace Sequence</span>
                    <span>Status: IDLE</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded overflow-hidden">
                        <div className="h-full bg-green-500 w-0"></div>
                    </div>
                    <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Identity</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Flash</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Config</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Bind</span>
                    </div>
                 </div>
            </section>

             <div className="p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <p>Hardware provisioning interface is mocked. No actual CAN-BUS commands are sent in this frontend demo.</p>
             </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};