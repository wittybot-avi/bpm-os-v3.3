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
  History, 
  FileWarning, 
  Wrench,
  CheckCircle2,
  Signal,
  ShieldCheck,
  User,
  Clock,
  XCircle,
  Archive
} from 'lucide-react';
import { StageStateBanner } from './StageStateBanner';
import { PreconditionsPanel } from './PreconditionsPanel';
import { DisabledHint } from './DisabledHint';
import { getMockS12Context } from '../stages/s12/s12Contract';
import { getS12ActionState, S12ActionId } from '../stages/s12/s12Guards';

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
      { id: 'evt-1', date: '2025-11-20', type: 'Installation', description: 'Pack commissioned at hub', technician: 'Field Eng. A' }
    ]
  },
  {
    id: 'dep-002',
    packId: 'PCK-2025-010-092',
    sku: 'BP-NMC-800V-75K',
    customer: 'CityBus Metro',
    deploymentDate: '2025-10-01',
    warrantyStatus: 'Claim Raised',
    warrantyEnd: '2030-10-01',
    telemetry: { soc: 45, soh: 92, temp: 58, alerts: 2 },
    history: [
      { id: 'evt-1', date: '2025-10-05', type: 'Installation', description: 'Pack commissioned', technician: 'Field Eng. B' },
      { id: 'evt-2', date: '2026-01-12', type: 'Alert', description: 'Over-temperature threshold exceeded', technician: 'System (Auto)' }
    ]
  },
  {
    id: 'dep-003',
    packId: 'PCK-2024-005-011',
    sku: 'BP-LFP-48V-2.5K',
    customer: 'Private Fleet B',
    deploymentDate: '2024-05-20',
    warrantyStatus: 'Expired',
    warrantyEnd: '2025-05-20',
    telemetry: { soc: 12, soh: 88, temp: 28, alerts: 0 },
    history: [
      { id: 'evt-1', date: '2024-05-22', type: 'Installation', description: 'Pack commissioned', technician: 'Field Eng. A' }
    ]
  }
];

export const ServiceWarranty: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedPack, setSelectedPack] = useState<DeployedPack>(DEPLOYED_FLEET[0]);

  // Read-Only S12 Context
  const s12Context = getMockS12Context();

  // Helper for Guards
  const getAction = (actionId: S12ActionId) => getS12ActionState(role, s12Context, actionId);

  // Guard States
  const initiateClaimState = getAction('INITIATE_WARRANTY_CLAIM');
  const rejectClaimState = getAction('REJECT_WARRANTY_CLAIM');
  const approveClaimState = getAction('APPROVE_WARRANTY_CLAIM');
  const closeWarrantyState = getAction('CLOSE_WARRANTY');

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.SERVICE || 
    role === UserRole.MANAGEMENT || 
    role === UserRole.QA_ENGINEER;

  const isAuditor = role === UserRole.MANAGEMENT;

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
           <p className="text-slate-500 text-sm mt-1">Field asset monitoring, warranty claims, and service triage.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600 border border-slate-200">
             <Signal size={14} className="text-green-500" />
             <span>IOT TELEMETRY: ONLINE</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-1">
            <Clock size={10} />
            <span>Active: {s12Context.packsUnderWarrantyCount}</span>
            <span className="text-slate-300">|</span>
            <span>Claims: {s12Context.activeClaimsCount}</span>
            <span className="text-slate-300">|</span>
            <span className={`font-bold ${s12Context.lifecycleStatus === 'ACTIVE' ? 'text-green-600' : s12Context.lifecycleStatus === 'CLAIM' ? 'text-amber-600' : 'text-slate-600'}`}>
              S12: {s12Context.lifecycleStatus}
            </span>
          </div>
        </div>
      </div>

      <StageStateBanner stageId="S15" />
      <PreconditionsPanel stageId="S15" />

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Fleet List */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Battery size={16} />
                  Deployed Fleet
                </h3>
             </div>
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search Pack ID or Customer..." 
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 pl-9 focus:outline-none focus:border-brand-500"
                  disabled={isAuditor}
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
             </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-0">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                 <tr>
                   <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Pack ID</th>
                   <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Customer</th>
                   <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {DEPLOYED_FLEET.map((pack) => (
                   <tr 
                     key={pack.id}
                     onClick={() => setSelectedPack(pack)}
                     className={`cursor-pointer transition-colors ${
                       selectedPack.id === pack.id ? 'bg-brand-50' : 'hover:bg-slate-50'
                     }`}
                   >
                     <td className="px-4 py-3 align-top">
                       <div className="font-bold text-slate-800">{pack.packId}</div>
                       <div className="text-[10px] text-slate-400 mt-0.5">{pack.sku}</div>
                     </td>
                     <td className="px-4 py-3 text-slate-600 align-top text-xs">{pack.customer}</td>
                     <td className="px-4 py-3 align-top">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          pack.warrantyStatus === 'Active' ? 'bg-green-100 text-green-700' :
                          pack.warrantyStatus === 'Claim Raised' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {pack.warrantyStatus === 'Claim Raised' ? 'Claim' : pack.warrantyStatus}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Right Col: Asset Detail */}
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
                    <p className="text-xs text-slate-500 font-mono">Deployed: {selectedPack.deploymentDate}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Warranty</div>
                <div className={`text-lg font-bold ${
                    selectedPack.warrantyStatus === 'Active' ? 'text-green-600' :
                    selectedPack.warrantyStatus === 'Claim Raised' ? 'text-red-600' : 'text-slate-600'
                }`}>
                    {selectedPack.warrantyStatus}
                </div>
                <div className="text-[10px] text-slate-400">Ends: {selectedPack.warrantyEnd}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Live Telemetry */}
            <section className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-brand-500" />
                    Live Telemetry (IoT)
                </h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 uppercase mb-1">State of Charge</div>
                      <div className={`text-xl font-bold ${selectedPack.telemetry.soc < 20 ? 'text-red-600' : 'text-green-600'}`}>{selectedPack.telemetry.soc}%</div>
                   </div>
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 uppercase mb-1">State of Health</div>
                      <div className="text-xl font-bold text-blue-600">{selectedPack.telemetry.soh}%</div>
                   </div>
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 uppercase mb-1">Temperature</div>
                      <div className={`text-xl font-bold flex items-center justify-center gap-1 ${selectedPack.telemetry.temp > 45 ? 'text-red-600' : 'text-slate-700'}`}>
                         {selectedPack.telemetry.temp}°C
                         {selectedPack.telemetry.temp > 45 && <Thermometer size={14} />}
                      </div>
                   </div>
                   <div className="p-3 bg-white border border-slate-100 rounded">
                      <div className="text-xs text-slate-500 uppercase mb-1">Active Alerts</div>
                      <div className={`text-xl font-bold ${selectedPack.telemetry.alerts > 0 ? 'text-red-600' : 'text-slate-300'}`}>{selectedPack.telemetry.alerts}</div>
                   </div>
                </div>
            </section>

            {/* 2. Service History */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History size={16} className="text-brand-500" />
                Service History
              </h3>
              <div className="space-y-3">
                 {selectedPack.history.map((evt) => (
                    <div key={evt.id} className="flex gap-4 p-3 border border-slate-100 rounded hover:bg-slate-50">
                        <div className="flex flex-col items-center min-w-[80px]">
                            <span className="text-xs font-bold text-slate-700">{evt.date}</span>
                            <span className="text-[10px] text-slate-400 uppercase">{evt.type}</span>
                        </div>
                        <div className="w-px bg-slate-200"></div>
                        <div className="flex-1">
                            <div className="text-sm text-slate-800">{evt.description}</div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <User size={10} /> {evt.technician}
                            </div>
                        </div>
                    </div>
                 ))}
              </div>
            </section>

             {/* 3. Actions */}
            <section className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wrench size={16} className="text-brand-500" />
                    Service Actions
                </h3>
                <div className="flex gap-4">
                    {/* Initiate Claim */}
                    <div className="flex-1 flex flex-col">
                        <button 
                            disabled={!initiateClaimState.enabled}
                            className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            title={initiateClaimState.reason}
                        >
                            <FileWarning size={16} />
                            Raise Incident
                        </button>
                        {!initiateClaimState.enabled && <DisabledHint reason={initiateClaimState.reason || 'Blocked'} className="mx-auto" />}
                    </div>

                    {/* Void/Reject */}
                    <div className="flex-1 flex flex-col">
                        <button 
                            disabled={!rejectClaimState.enabled}
                            className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            title={rejectClaimState.reason}
                        >
                            <XCircle size={16} />
                            Void Warranty
                        </button>
                        {!rejectClaimState.enabled && <DisabledHint reason={rejectClaimState.reason || 'Blocked'} className="mx-auto" />}
                    </div>

                    {/* Approve/Close Ticket */}
                    <div className="flex-1 flex flex-col">
                        <button 
                            disabled={!approveClaimState.enabled}
                            className="w-full bg-brand-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                            title={approveClaimState.reason}
                        >
                            <CheckCircle2 size={16} />
                            Close Ticket
                        </button>
                        {!approveClaimState.enabled && <DisabledHint reason={approveClaimState.reason || 'Blocked'} className="mx-auto" />}
                    </div>

                    {/* Close Warranty (Lifecycle) */}
                    <div className="flex-1 flex flex-col">
                        <button 
                            disabled={!closeWarrantyState.enabled}
                            className="w-full bg-slate-800 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                            title={closeWarrantyState.reason}
                        >
                            <Archive size={16} />
                            Close Warranty
                        </button>
                        {!closeWarrantyState.enabled && <DisabledHint reason={closeWarrantyState.reason || 'Blocked'} className="mx-auto" />}
                    </div>
                </div>
                 <p className="text-center text-xs text-slate-400 mt-3">
                    Actions update local lifecycle state in demo mode.
                </p>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};
