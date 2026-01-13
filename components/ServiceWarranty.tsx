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
             Service, Warranty & Monitoring (S15)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Track deployed fleet health, manage warranty claims, and view telemetry.</p>
           <p className="text-xs text-slate-400 mt-1 italic">This screen reflects current lifecycle tracking, not manufacturing lineage.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-200 text-xs font-bold">
             <Signal size={14} />
             <span>LIFECYCLE TRACKING</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Fleet List */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Search size={16} />
               Deployed Battery Fleet
             </h3>
             <span className="text-xs text-slate-400">Search by Pack ID or Customer</span>
          </div>
          <div className="p-3 border-b border-slate-100">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter packs..." 
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
                    pack.warrantyStatus === 'Claim Raised' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {pack.warrantyStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-1">{pack.customer}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                   <Calendar size={10} />
                   Deployed: {pack.deploymentDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Service & Monitoring Detail */}
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
                    <p className="text-xs text-slate-500 font-mono">Customer: {selectedPack.customer}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Warranty Status</div>
                <div className={`text-lg font-bold ${
                    selectedPack.warrantyStatus === 'Active' ? 'text-green-600' :
                    selectedPack.warrantyStatus === 'Claim Raised' ? 'text-amber-600' : 'text-slate-500'
                }`}>
                    {selectedPack.warrantyStatus.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-400">Ends: {selectedPack.warrantyEnd}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Monitoring Snapshot */}
            <section className="bg-slate-900 rounded-lg p-5 text-white shadow-md relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                   <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-brand-400">
                      <Activity size={16} />
                      Live Telemetry Preview (Demo)
                   </h3>
                   <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 animate-pulse">LIVE FEED</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 relative z-10">
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">State of Charge</span>
                        <div className={`text-2xl font-mono font-bold ${selectedPack.telemetry.soc < 20 ? 'text-red-400' : 'text-green-400'}`}>
                           {selectedPack.telemetry.soc}%
                        </div>
                        <Battery size={16} className="mt-2 text-slate-500" />
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">State of Health</span>
                        <div className="text-2xl font-mono font-bold text-blue-400">
                           {selectedPack.telemetry.soh}%
                        </div>
                        <Activity size={16} className="mt-2 text-slate-500" />
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">Pack Temp</span>
                        <div className={`text-2xl font-mono font-bold ${selectedPack.telemetry.temp > 40 ? 'text-red-400' : 'text-slate-200'}`}>
                           {selectedPack.telemetry.temp}°C
                        </div>
                        <Thermometer size={16} className="mt-2 text-slate-500" />
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">Active Alerts</span>
                        <div className={`text-2xl font-mono font-bold ${selectedPack.telemetry.alerts > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                           {selectedPack.telemetry.alerts}
                        </div>
                        <AlertTriangle size={16} className={`mt-2 ${selectedPack.telemetry.alerts > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
                    </div>
                </div>
                
                {/* Background Viz Effect */}
                <div className="absolute top-0 right-0 h-full w-full opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
            </section>

            {/* 2. Service History */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History size={16} className="text-brand-500" />
                Service History
              </h3>
              <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedPack.history.map((event) => (
                      <div key={event.id} className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-brand-500 shadow-sm"></div>
                          <div className="bg-white border border-slate-200 p-3 rounded shadow-sm">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-slate-700 text-sm">{event.type}</span>
                                  <span className="text-xs text-slate-400 font-mono">{event.date}</span>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 inline-block px-2 py-0.5 rounded">
                                  <Wrench size={10} />
                                  Tech: {event.technician}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            </section>

             {/* 3. Actions - Hidden for Auditor */}
            {!isAuditor && (
              <section className="pt-4 border-t border-slate-100">
                  <div className="flex gap-4">
                      <button 
                          className="flex-1 bg-white border border-slate-300 text-slate-500 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                          disabled={true}
                          title="Demo Mode: Backend locked"
                      >
                          <FileWarning size={16} />
                          Raise Warranty Claim
                      </button>
                      
                      <button 
                          className="flex-1 bg-brand-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm"
                          disabled={true}
                          title="Demo Mode: Backend locked"
                      >
                          <Zap size={16} />
                          Register Service Event
                      </button>
                  </div>
                   <p className="text-center text-xs text-slate-400 mt-3">
                      Service actions are disabled in Frontend-Only Demo Mode.
                  </p>
              </section>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};