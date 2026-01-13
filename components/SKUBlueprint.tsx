import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  Cpu, 
  Battery, 
  Zap, 
  Scale, 
  CheckCircle, 
  AlertCircle,
  FileBadge,
  Globe,
  Settings,
  Box,
  Layers
} from 'lucide-react';

// Mock Data Types
interface SKU {
  id: string;
  code: string;
  name: string;
  chemistry: 'LFP' | 'NMC' | 'LTO';
  formFactor: 'Prismatic' | 'Cylindrical 21700' | 'Pouch';
  voltage: string;
  capacity: string;
  status: 'Draft' | 'Approved' | 'Obsolete';
  compliance: {
    batteryAadhaar: boolean;
    euPassport: boolean;
    bisCertified: boolean;
  };
}

// Mock Data
const MOCK_SKUS: SKU[] = [
  {
    id: 'sku-001',
    code: 'BP-LFP-48V-2.5K',
    name: 'E-Scooter Standard Pack',
    chemistry: 'LFP',
    formFactor: 'Cylindrical 21700',
    voltage: '48V',
    capacity: '2.5 kWh',
    status: 'Approved',
    compliance: {
      batteryAadhaar: true,
      euPassport: false,
      bisCertified: true
    }
  },
  {
    id: 'sku-002',
    code: 'BP-NMC-800V-75K',
    name: 'EV High Performance Pack',
    chemistry: 'NMC',
    formFactor: 'Prismatic',
    voltage: '800V',
    capacity: '75 kWh',
    status: 'Draft',
    compliance: {
      batteryAadhaar: true,
      euPassport: true,
      bisCertified: false
    }
  },
  {
    id: 'sku-003',
    code: 'BP-LTO-24V-1K',
    name: 'AGV Fast Charge Pack',
    chemistry: 'LTO',
    formFactor: 'Pouch',
    voltage: '24V',
    capacity: '1 kWh',
    status: 'Approved',
    compliance: {
      batteryAadhaar: false,
      euPassport: false,
      bisCertified: true
    }
  }
];

export const SKUBlueprint: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedSku, setSelectedSku] = useState<SKU>(MOCK_SKUS[0]);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.ENGINEERING || 
    role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view SKU Blueprints.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              System Setup <span className="text-slate-300">/</span> SKU Master
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Cpu className="text-brand-600" size={24} />
             SKU & Regulatory Blueprint (S1)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Define battery chemistry, electrical specs, and regulatory compliance.</p>
        </div>
        <button 
          className="bg-brand-600 text-white px-4 py-2 rounded-md font-medium text-sm opacity-50 cursor-not-allowed flex items-center gap-2"
          disabled
          title="Demo Mode: Backend creation disabled"
        >
          <span>+ Create New SKU</span>
        </button>
      </div>

      {/* Content Split View */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left: Master List */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-700">Battery Pack Models</h3>
            <span className="text-xs text-slate-400">{MOCK_SKUS.length} Configurations Found</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {MOCK_SKUS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="bg-slate-50 p-3 rounded-full mb-3">
                  <Box className="text-slate-300" size={20} />
                </div>
                <h3 className="text-slate-700 font-medium text-sm mb-1">Nothing to display yet</h3>
                <p className="text-slate-500 text-xs">Records will appear here once created or synced.</p>
              </div>
            ) : (
              MOCK_SKUS.map((sku) => (
                <div 
                  key={sku.id}
                  onClick={() => setSelectedSku(sku)}
                  className={`p-3 rounded-md cursor-pointer border transition-all ${
                    selectedSku.id === sku.id 
                      ? 'bg-brand-50 border-brand-200 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-sm">{sku.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      sku.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      sku.status === 'Draft' ? 'bg-slate-100 text-slate-600' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {sku.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{sku.name}</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="bg-slate-100 px-1 rounded">{sku.chemistry}</span>
                    <span className="bg-slate-100 px-1 rounded">{sku.voltage}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Detail View / Blueprint */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{selectedSku.name}</h2>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-mono">{selectedSku.code}</span>
              </div>
              <p className="text-sm text-slate-500">Product Revision A.2 • Last Modified: 2025-12-10</p>
            </div>
            <button className="text-brand-600 text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline" disabled>
              Edit Blueprint
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Electrical & Chemistry */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap size={16} className="text-brand-500" />
                Electrical & Core Chemistry
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-400 mb-1">Chemistry</div>
                  <div className="font-semibold text-slate-800">{selectedSku.chemistry}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-400 mb-1">Nominal Voltage</div>
                  <div className="font-semibold text-slate-800">{selectedSku.voltage}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-400 mb-1">Energy Capacity</div>
                  <div className="font-semibold text-slate-800">{selectedSku.capacity}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-400 mb-1">Cell Configuration</div>
                  <div className="font-semibold text-slate-800 font-mono">16S4P</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-400 mb-1">BMS Master</div>
                  <div className="font-semibold text-slate-800">Orion BMS 2</div>
                </div>
              </div>
            </section>

            {/* 2. Mechanical & Form Factor */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Battery size={16} className="text-brand-500" />
                Mechanical & Form Factor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                   <div className="text-xs text-slate-400 mb-1">Pack Architecture</div>
                   <div className="font-semibold text-slate-800">{selectedSku.formFactor}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                   <div className="text-xs text-slate-400 mb-1">Cooling Strategy</div>
                   <div className="font-semibold text-slate-800">Liquid Active Cooling</div>
                </div>
                
                {/* Type B Empty State for Missing Content */}
                <div className="p-3 bg-slate-50 rounded border border-slate-100 col-span-2 flex flex-col justify-center items-center h-32 border-dashed border-slate-300">
                   <div className="bg-slate-100 p-2 rounded-full mb-2">
                      <Layers className="text-slate-300" size={20} />
                   </div>
                   <h3 className="text-sm font-medium text-slate-600 mb-1">Nothing to display yet</h3>
                   <p className="text-xs text-slate-400">Mechanical CAD preview requires backend integration.</p>
                </div>
              </div>
            </section>

            {/* 3. Regulatory Compliance */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scale size={16} className="text-brand-500" />
                Regulatory Blueprint
              </h3>
              <div className="flex flex-wrap gap-4">
                 {/* Battery Aadhaar */}
                 <div className={`flex items-center gap-3 px-4 py-3 rounded border ${selectedSku.compliance.batteryAadhaar ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                    <FileBadge size={20} className={selectedSku.compliance.batteryAadhaar ? 'text-purple-600' : 'text-slate-400'} />
                    <div>
                      <div className={`font-bold text-sm ${selectedSku.compliance.batteryAadhaar ? 'text-purple-900' : 'text-slate-500'}`}>Battery Aadhaar</div>
                      <div className="text-xs text-slate-500">{selectedSku.compliance.batteryAadhaar ? 'Digital Twin Ready' : 'Not Configured'}</div>
                    </div>
                    {selectedSku.compliance.batteryAadhaar && <CheckCircle size={16} className="text-purple-600 ml-2" />}
                 </div>

                 {/* EU Passport */}
                 <div className={`flex items-center gap-3 px-4 py-3 rounded border ${selectedSku.compliance.euPassport ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                    <Globe size={20} className={selectedSku.compliance.euPassport ? 'text-blue-600' : 'text-slate-400'} />
                    <div>
                      <div className={`font-bold text-sm ${selectedSku.compliance.euPassport ? 'text-blue-900' : 'text-slate-500'}`}>EU Battery Passport</div>
                      <div className="text-xs text-slate-500">{selectedSku.compliance.euPassport ? 'DPP Data Schema' : 'Not Required'}</div>
                    </div>
                     {selectedSku.compliance.euPassport && <CheckCircle size={16} className="text-blue-600 ml-2" />}
                 </div>

                 {/* BIS */}
                 <div className={`flex items-center gap-3 px-4 py-3 rounded border ${selectedSku.compliance.bisCertified ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                    <ShieldAlert size={20} className={selectedSku.compliance.bisCertified ? 'text-green-600' : 'text-slate-400'} />
                    <div>
                      <div className={`font-bold text-sm ${selectedSku.compliance.bisCertified ? 'text-green-900' : 'text-slate-500'}`}>AIS-156 / BIS</div>
                      <div className="text-xs text-slate-500">{selectedSku.compliance.bisCertified ? 'Certified' : 'Pending Test'}</div>
                    </div>
                     {selectedSku.compliance.bisCertified ? <CheckCircle size={16} className="text-green-600 ml-2" /> : <AlertCircle size={16} className="text-amber-500 ml-2" />}
                 </div>
              </div>
            </section>

             {/* 4. Manufacturing Readiness */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings size={16} className="text-brand-500" />
                Manufacturing Readiness
              </h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium border border-slate-200">Line A Compatible</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium border border-slate-200">Line B Compatible</span>
                <span className="px-3 py-1 bg-white text-slate-400 text-xs rounded-full font-medium border border-dashed border-slate-300">Procurement Check Pending</span>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
};