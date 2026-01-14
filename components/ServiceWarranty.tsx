import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  LifeBuoy, 
  Search, 
  Battery, 
  Activity, 
  Thermometer, 
  Zap, 
  AlertTriangle, 
  Calendar, 
  History, 
  FileWarning, 
  Wrench,
  CheckCircle2,
  Signal,
  ShieldCheck
} from 'lucide-react';
import { StageStateBanner } from './StageStateBanner';

// Mock Data Types
interface DeployedPack {
  id: string;
  packId: string;
  sku: string;
  customer: string;
  deploymentDate: string;
  warrantyStatus: 'Active' | 'Expired' | 'Claim Raised';
  warrantyEnd: string;
  telemetry: {
    soc: number;
    soh: number;
    temp: number;
    alerts: number;
  };
  history: ServiceEvent[];
}

interface ServiceEvent {
  id: string;
  date: string;
  type: string;
  description: string;
  technician: string;
}

// Mock Data
const DEPLOYED_FLEET: DeployedPack[] = [
  {
    id: 'dep-001',
    packId: 'PCK-2025-012-005',
    sku: 'BP-LFP-48V-2.5K',
    customer: 'EcoRide Logistics',
    deploymentDate: '2025-11-15',
    warrantyStatus: 'Active',
    warrantyEnd: '2028-11-15',
    telemetry: { soc: 85, soh: 98, temp: 32, alerts: 0 },
    history: [
      { id: 'evt-1', date: '2025-11-20', type: 'Installation', description: 'Pack commissioned at Hub A', technician: 'S. Rao' }
    ]
  },
  {
    id: 'dep-002',
    packId: 'PCK-2025-010-092',
    sku: 'BP-NMC-800V-75K',
    customer: 'CityBus Metro',
    deploymentDate: '2025-08-01',
    warrantyStatus: 'Claim Raised',
    warrantyEnd: '2030-08-01',
    telemetry: { soc: 42, soh: 91, temp: 45, alerts: 2 },
    history: [
      { id: 'evt-2', date: '2026-01-10', type: 'Alert', description: 'Over-temperature warning triggered', technician: 'System' },
      { id: 'evt-3', date: '2025-08-05', type: 'Installation', description: 'Bus #402 integration', technician: 'M. Khan' }
    ]
  },
  {
    id: 'dep-003',
    packId: 'PCK-2024-001-001',
    sku: 'BP-LFP-48V-2.5K',
    customer: 'EcoRide Logistics',
    deploymentDate: '2024-02-10',
    warrantyStatus: 'Expired',
    warrantyEnd: '2026-01-01', // Expired just recently for demo
    telemetry: { soc: 12, soh: 78, temp: 28, alerts: 0 },
    history: [
      { id: 'evt-4', date: '2025-06-15', type: 'Maintenance', description: 'Annual health check - OK', technician: 'S. Rao' },
      { id: 'evt-5', date: '2024-02-15', type: 'Installation', description: 'Fleet deployment', technician: 'A. Singh' }
    ]
  }
];

export const ServiceWarranty: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedPack, setSelectedPack] = useState<DeployedPack>(DEPLOYED_FLEET[0]);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.SERVICE || 
    role === UserRole.MANAGEMENT;

  const isAuditor = role === UserRole.MANAGEMENT;
  // Management (Auditor) is read-only.
  // Service Engineer is read-write but locked in backend-demo mode.
  const isReadOnly = isAuditor; 

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Service & Warranty.</p>
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
              Track & Lifecycle <span className="text-slate-300">/</span> Service
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <LifeBuoy className="text-brand-600" size={24} />
             Service & Warranty (S15)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Field diagnostics, warranty entitlement checks, and service logs.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600 border border-slate-200">
             <Signal size={14} className="text-green-500" />
             <span>TELEMETRY FEED: LIVE</span>
        </div>
      </div>

      <StageStateBanner stageId="S15" />

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Fleet Search */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Search size={16} />
               Fleet Search
             </h3>
             <span className="text-xs text-slate-400">Deployed Assets</span>
          </div>
          <div className="p-3 border-b border-slate-100">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Scan Pack ID..." 
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 pl-9 focus:outline-none focus:border-brand-500"
                  disabled={isReadOnly}
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
             </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {DEPLOYED_FLEET.map((pack) => (
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
                    pack.warrantyStatus === 'Active' ? 'bg-green-100 text-green-700' :
                    pack.warrantyStatus === 'Claim Raised' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {pack.warrantyStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2">{pack.customer}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                   <span className="flex items-center gap-1">
                      <Signal size={10} className={pack.telemetry.alerts > 0 ? 'text-red-500' : 'text-green-500'} />
                      SOH: {pack.telemetry.soh}%
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Diagnostics Dashboard */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                    <Activity size={24} className="text-slate-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedPack.packId}</h2>
                    <p className="text-xs text-slate-500 font-mono">Customer: {selectedPack.customer}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Warranty</div>
                <div className={`text-lg font-bold ${
                    selectedPack.warrantyStatus === 'Active' ? 'text-green-600' :
                    selectedPack.warrantyStatus === 'Claim Raised' ? 'text-red-600' : 'text-slate-600'
                }`}>
                    {selectedPack.warrantyStatus.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400">Ends: {selectedPack.warrantyEnd}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Live Telemetry */}
            <section className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-brand-500" />
                    Live Telemetry Snapshot
                </h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 mb-1">State of Charge</div>
                      <div className="text-2xl font-bold text-slate-800 flex justify-center items-end gap-1">
                          {selectedPack.telemetry.soc}<span className="text-sm text-slate-400 mb-1">%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${selectedPack.telemetry.soc}%` }}></div>
                      </div>
                   </div>
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 mb-1">State of Health</div>
                      <div className="text-2xl font-bold text-slate-800 flex justify-center items-end gap-1">
                          {selectedPack.telemetry.soh}<span className="text-sm text-slate-400 mb-1">%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${selectedPack.telemetry.soh > 90 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${selectedPack.telemetry.soh}%` }}></div>
                      </div>
                   </div>
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 mb-1">Max Temp</div>
                      <div className="text-2xl font-bold text-slate-800 flex justify-center items-end gap-1">
                          {selectedPack.telemetry.temp}<span className="text-sm text-slate-400 mb-1">°C</span>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 flex justify-center items-center gap-1">
                          <Thermometer size={10} /> Normal
                      </div>
                   </div>
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 mb-1">Active Alerts</div>
                      <div className={`text-2xl font-bold flex justify-center items-end gap-1 ${selectedPack.telemetry.alerts > 0 ? 'text-red-600' : 'text-slate-300'}`}>
                          {selectedPack.telemetry.alerts}
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400">
                          {selectedPack.telemetry.alerts > 0 ? 'Critical' : 'None'}
                      </div>
                   </div>
                </div>
            </section>

            {/* 2. Service History */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History size={16} className="text-brand-500" />
                Service Event Log
              </h3>
              <div className="space-y-3">
                  {selectedPack.history.map((evt) => (
                      <div key={evt.id} className="flex gap-4 p-3 border border-slate-100 rounded hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col items-center justify-center w-12 text-slate-400 border-r border-slate-100 pr-4">
                              <Calendar size={16} className="mb-1" />
                              <span className="text-[10px] text-center leading-tight">{evt.date}</span>
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <span className="font-bold text-slate-700 text-sm">{evt.type}</span>
                                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{evt.id}</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">{evt.description}</p>
                              <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                                  <Wrench size={10} />
                                  Tech: {evt.technician}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            </section>

             {/* 3. Actions */}
            <section className="pt-4 border-t border-slate-100">
                <div className="flex gap-4">
                    <button 
                        disabled={isReadOnly} 
                        className="flex-1 bg-white border border-slate-300 text-slate-500 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-60 cursor-not-allowed hover:bg-slate-50"
                        title="Demo Mode: Backend locked"
                    >
                        <FileWarning size={16} />
                        Raise Ticket
                    </button>
                    
                    <button 
                        disabled={isReadOnly} 
                        className="flex-1 bg-brand-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm hover:bg-brand-700"
                        title="Demo Mode: Backend locked"
                    >
                        <CheckCircle2 size={16} />
                        Validate Warranty
                    </button>
                </div>
                 <p className="text-center text-xs text-slate-400 mt-3">
                    Service actions are disabled in Frontend-Only Demo Mode.
                </p>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};