import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  PackageCheck, 
  MapPin, 
  Search, 
  Filter, 
  Truck, 
  Move, 
  Bookmark, 
  Info,
  Battery,
  CheckCircle2,
  Globe,
  FileBadge,
  Archive,
  Scale
} from 'lucide-react';

// Mock Data Types
interface InventoryItem {
  id: string;
  packId: string;
  sku: string;
  batchId: string;
  location: string;
  status: 'Available' | 'Reserved' | 'Dispatched';
  entryDate: string;
  compliance: {
    aadhaar: boolean;
    passport: boolean;
  };
  bmsStatus: 'Provisioned' | 'Pending';
}

// Mock Data
const INVENTORY: InventoryItem[] = [
  {
    id: 'inv-001',
    packId: 'PCK-2026-001-005',
    sku: 'BP-LFP-48V-2.5K',
    batchId: 'P-2026-01-001',
    location: 'Zone A - Rack 04 - Shelf 2',
    status: 'Available',
    entryDate: '2026-01-11 10:00',
    compliance: { aadhaar: true, passport: false },
    bmsStatus: 'Provisioned'
  },
  {
    id: 'inv-002',
    packId: 'PCK-2026-001-008',
    sku: 'BP-LFP-48V-2.5K',
    batchId: 'P-2026-01-001',
    location: 'Zone A - Rack 04 - Shelf 3',
    status: 'Reserved',
    entryDate: '2026-01-11 10:45',
    compliance: { aadhaar: true, passport: false },
    bmsStatus: 'Provisioned'
  },
  {
    id: 'inv-003',
    packId: 'PCK-2026-002-001',
    sku: 'BP-NMC-800V-75K',
    batchId: 'P-2026-01-002',
    location: 'Zone B - High Voltage Cage',
    status: 'Available',
    entryDate: '2026-01-11 12:30',
    compliance: { aadhaar: true, passport: true },
    bmsStatus: 'Provisioned'
  },
  {
    id: 'inv-004',
    packId: 'PCK-2026-001-012',
    sku: 'BP-LFP-48V-2.5K',
    batchId: 'P-2026-01-001',
    location: 'Dispatch Bay 1',
    status: 'Dispatched',
    entryDate: '2026-01-11 09:00',
    compliance: { aadhaar: true, passport: false },
    bmsStatus: 'Provisioned'
  }
];

export const FinishedGoods: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedItem, setSelectedItem] = useState<InventoryItem>(INVENTORY[0]);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.STORES || 
    role === UserRole.LOGISTICS || 
    role === UserRole.MANAGEMENT;

  const isReadOnly = role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Finished Goods Inventory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Logistics <span className="text-slate-300">/</span> Inventory
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <PackageCheck className="text-brand-600" size={24} />
             Finished Goods Inventory (S11)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Manage warehouse stock, storage locations, and dispatch readiness.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600 border border-slate-200">
             <Archive size={14} className="text-slate-500" />
             <span>WAREHOUSE: ONLINE</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Inventory List */}
        <div className="col-span-5 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Archive size={16} />
                  Stock on Hand
                </h3>
                <button className="text-slate-400 hover:text-slate-600"><Filter size={16} /></button>
             </div>
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Scan Pack ID or Location..." 
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 pl-9 focus:outline-none focus:border-brand-500"
                  disabled={isReadOnly}
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
             </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-0">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                 <tr>
                   <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Pack ID / SKU</th>
                   <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Location</th>
                   <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {INVENTORY.map((item) => (
                   <tr 
                     key={item.id}
                     onClick={() => setSelectedItem(item)}
                     className={`cursor-pointer transition-colors ${
                       selectedItem.id === item.id ? 'bg-brand-50' : 'hover:bg-slate-50'
                     }`}
                   >
                     <td className="px-4 py-3 align-top">
                       <div className="font-bold text-slate-800">{item.packId}</div>
                       <div className="text-[10px] text-slate-400 truncate w-32 mt-0.5">{item.sku}</div>
                     </td>
                     <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-1 text-slate-600">
                            <MapPin size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate w-24 text-xs" title={item.location}>{item.location}</span>
                        </div>
                     </td>
                     <td className="px-4 py-3 align-top">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'Available' ? 'bg-green-100 text-green-700' :
                          item.status === 'Reserved' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Right Col: Stock Detail */}
        <div className="col-span-7 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                    <PackageCheck size={24} className="text-slate-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedItem.packId}</h2>
                    <p className="text-xs text-slate-500 font-mono">Batch: {selectedItem.batchId}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Custody State</div>
                <div className={`text-lg font-bold ${
                    selectedItem.status === 'Available' ? 'text-green-600' :
                    selectedItem.status === 'Reserved' ? 'text-amber-600' : 'text-slate-600'
                }`}>
                    {selectedItem.status.toUpperCase()}
                </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Location & Storage */}
            <section className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-500" />
                    Storage Location
                </h3>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-mono font-medium text-slate-700">{selectedItem.location}</div>
                    <div className="text-xs text-slate-500">Entry: {selectedItem.entryDate}</div>
                </div>
            </section>

            {/* 2. Product Provenance */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={16} className="text-brand-500" />
                Product Provenance
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="flex items-center gap-3 p-3 border border-slate-100 rounded">
                    <Battery size={20} className="text-green-600" />
                    <div>
                        <div className="font-semibold text-slate-700">Manufacturing</div>
                        <div className="text-xs text-slate-500">S3-S8 Completed</div>
                    </div>
                    <CheckCircle2 size={16} className="ml-auto text-green-500" />
                 </div>
                 <div className="flex items-center gap-3 p-3 border border-slate-100 rounded">
                    <Globe size={20} className={selectedItem.bmsStatus === 'Provisioned' ? 'text-green-600' : 'text-amber-500'} />
                    <div>
                        <div className="font-semibold text-slate-700">BMS Provisioning</div>
                        <div className="text-xs text-slate-500">{selectedItem.bmsStatus}</div>
                    </div>
                     <CheckCircle2 size={16} className={`ml-auto ${selectedItem.bmsStatus === 'Provisioned' ? 'text-green-500' : 'text-slate-300'}`} />
                 </div>
              </div>
            </section>

             {/* 3. Compliance Tags */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileBadge size={16} className="text-brand-500" />
                Compliance Readiness
              </h3>
              <div className="flex gap-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${selectedItem.compliance.aadhaar ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    Battery Aadhaar {selectedItem.compliance.aadhaar && <CheckCircle2 size={12} />}
                 </span>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${selectedItem.compliance.passport ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    EU Passport {selectedItem.compliance.passport && <CheckCircle2 size={12} />}
                 </span>
              </div>
            </section>

            {/* 4. Actions */}
            <section className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Truck size={16} className="text-brand-500" />
                    Warehouse Actions
                </h3>
                <div className="flex gap-4">
                    <button 
                        disabled 
                        className="flex-1 bg-white border border-slate-300 text-slate-500 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                        title="Demo Mode: Backend locked"
                    >
                        <Bookmark size={16} />
                        Reserve
                    </button>
                    <button 
                        disabled 
                        className="flex-1 bg-white border border-slate-300 text-slate-500 py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                        title="Demo Mode: Backend locked"
                    >
                        <Move size={16} />
                        Move Loc
                    </button>
                    <button 
                        disabled 
                        className="flex-1 bg-brand-600 text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed shadow-sm"
                        title="Demo Mode: Backend locked"
                    >
                        <Truck size={16} />
                        Dispatch
                    </button>
                </div>
                 <p className="text-center text-xs text-slate-400 mt-3">
                    Warehouse mutations are disabled in Frontend-Only Demo Mode.
                </p>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};