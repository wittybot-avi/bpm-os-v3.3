import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  ShoppingCart, 
  PackageCheck, 
  Truck, 
  FileText, 
  CreditCard,
  Building2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Mock Data Types
interface ApprovedSKU {
  id: string;
  code: string;
  chemistry: string;
  preferredSupplier: string;
}

interface Supplier {
  id: string;
  name: string;
  type: 'Cells' | 'BMS' | 'Mechanical' | 'Thermal';
  status: 'Approved' | 'Conditional' | 'Pending';
  region: string;
  rating: string;
}

interface CommercialTerm {
  id: string;
  skuRef: string;
  moq: string;
  leadTime: string;
  priceBand: string;
  contractStatus: 'Active' | 'Draft' | 'Expired';
}

// Mock Data
const APPROVED_SKUS: ApprovedSKU[] = [
  { id: 'sku-001', code: 'BP-LFP-48V-2.5K', chemistry: 'LFP', preferredSupplier: 'CellGlobal Dynamics' },
  { id: 'sku-003', code: 'BP-LTO-24V-1K', chemistry: 'LTO', preferredSupplier: 'NanoTech Energy' },
];

const SUPPLIERS: Supplier[] = [
  { id: 'sup-001', name: 'CellGlobal Dynamics', type: 'Cells', status: 'Approved', region: 'APAC', rating: 'A+' },
  { id: 'sup-002', name: 'Orion BMS Systems', type: 'BMS', status: 'Approved', region: 'NA', rating: 'A' },
  { id: 'sup-003', name: 'ThermalWrap Inc', type: 'Thermal', status: 'Conditional', region: 'EU', rating: 'B' },
  { id: 'sup-004', name: 'Precision Casings', type: 'Mechanical', status: 'Pending', region: 'APAC', rating: '-' },
];

const TERMS: CommercialTerm[] = [
  { id: 'tm-001', skuRef: 'BP-LFP-48V-2.5K', moq: '5,000 Units', leadTime: '12 Weeks', priceBand: '$125 - $140 / kWh', contractStatus: 'Active' },
  { id: 'tm-002', skuRef: 'BP-LTO-24V-1K', moq: '1,000 Units', leadTime: '16 Weeks', priceBand: '$350 - $380 / kWh', contractStatus: 'Draft' },
];

export const Procurement: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>(SUPPLIERS[0]);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.PROCUREMENT || 
    role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Commercial Procurement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Procurement <span className="text-slate-300">/</span> Orders
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <ShoppingCart className="text-brand-600" size={24} />
             Commercial Procurement (S2)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Manage supplier qualifications, commercial terms, and procurement orders.</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="bg-white border border-slate-300 text-slate-400 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 cursor-not-allowed"
            disabled
            title="Demo Mode: Backend not connected"
          >
            <FileText size={16} />
            <span>Create RFQ</span>
          </button>
          <button 
            className="bg-brand-600 text-white px-4 py-2 rounded-md font-medium text-sm opacity-50 cursor-not-allowed flex items-center gap-2"
            disabled
            title="Demo Mode: Backend not connected"
          >
            <CreditCard size={16} />
            <span>Release PO</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Approved SKU Reference */}
        <div className="col-span-3 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <PackageCheck size={16} />
               Approved SKUs
             </h3>
             <span className="text-xs text-slate-400">Sourced from S1 Blueprint</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {APPROVED_SKUS.map((sku) => (
              <div key={sku.id} className="p-3 bg-white border border-slate-100 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{sku.code}</span>
                  <CheckCircle2 size={14} className="text-green-500" />
                </div>
                <div className="text-xs text-slate-500 mb-2">Chem: {sku.chemistry}</div>
                <div className="bg-slate-50 px-2 py-1 rounded text-[10px] text-slate-600 font-medium">
                  Pref: {sku.preferredSupplier}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Col: Supplier Master */}
        <div className="col-span-5 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Truck size={16} />
               Supplier Master
             </h3>
             <span className="text-xs text-slate-400">Qualified Vendors</span>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Supplier Name</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SUPPLIERS.map((sup) => (
                  <tr 
                    key={sup.id} 
                    onClick={() => setSelectedSupplier(sup)}
                    className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedSupplier.id === sup.id ? 'bg-brand-50' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{sup.name}</td>
                    <td className="px-4 py-3 text-slate-600">{sup.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sup.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        sup.status === 'Conditional' ? 'bg-amber-100 text-amber-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {sup.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{sup.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Commercial Terms */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Building2 size={16} />
               Commercial Terms
             </h3>
             <span className="text-xs text-slate-400">Contract & Pricing Snapshots</span>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
             {TERMS.map((term) => (
               <div key={term.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-xs font-mono font-bold text-slate-500">{term.skuRef}</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                       term.contractStatus === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                       term.contractStatus === 'Draft' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                       'bg-red-50 text-red-700 border-red-200'
                     }`}>
                       {term.contractStatus}
                     </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">MOQ</div>
                      <div className="font-medium text-slate-800">{term.moq}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Lead Time</div>
                      <div className="font-medium text-slate-800">{term.leadTime}</div>
                    </div>
                     <div className="col-span-2">
                      <div className="text-[10px] text-slate-400 uppercase">Indicative Price Band</div>
                      <div className="font-medium text-slate-800 bg-white border border-slate-200 p-2 rounded text-center">
                        {term.priceBand}
                      </div>
                    </div>
                  </div>
               </div>
             ))}
             
             <div className="p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex items-start gap-2">
               <AlertCircle size={14} className="mt-0.5 shrink-0" />
               <p>Commercial terms displayed are for demonstration purposes. Actual pricing is retrieved securely from the ERP backend (mocked).</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};