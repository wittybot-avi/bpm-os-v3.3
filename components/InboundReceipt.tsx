import React, { useContext, useState } from 'react';
import { UserContext, UserRole } from '../types';
import { 
  ShieldAlert, 
  Truck, 
  Package, 
  Barcode, 
  ClipboardCheck, 
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  List
} from 'lucide-react';

// Mock Data Types
interface Shipment {
  id: string;
  shipmentId: string;
  supplier: string;
  materialType: 'Cells' | 'BMS' | 'Mechanical' | 'Thermal';
  expectedQty: number;
  receivedQty: number;
  status: 'Pending' | 'Receiving' | 'Received' | 'QC Hold';
  poRef: string;
  arrivalDate: string;
}

interface MockSerial {
  sn: string;
  batch: string;
}

// Mock Data
const SHIPMENTS: Shipment[] = [
  { 
    id: 'shp-001', 
    shipmentId: 'INB-2026-0042', 
    supplier: 'CellGlobal Dynamics', 
    materialType: 'Cells', 
    expectedQty: 5000, 
    receivedQty: 0,
    status: 'Pending',
    poRef: 'PO-9921',
    arrivalDate: '2026-01-11 08:30'
  },
  { 
    id: 'shp-002', 
    shipmentId: 'INB-2026-0043', 
    supplier: 'Orion BMS Systems', 
    materialType: 'BMS', 
    expectedQty: 200, 
    receivedQty: 200,
    status: 'Received', // Ready for QC
    poRef: 'PO-9925',
    arrivalDate: '2026-01-10 14:15'
  },
  { 
    id: 'shp-003', 
    shipmentId: 'INB-2026-0038', 
    supplier: 'ThermalWrap Inc', 
    materialType: 'Thermal', 
    expectedQty: 1000, 
    receivedQty: 950,
    status: 'QC Hold',
    poRef: 'PO-9918',
    arrivalDate: '2026-01-09 09:00'
  }
];

const MOCK_SERIALS: MockSerial[] = Array.from({ length: 15 }).map((_, i) => ({
  sn: `CELL-2026-${String(8842 + i).padStart(4, '0')}`,
  batch: 'BAT-001-A'
}));

export const InboundReceipt: React.FC = () => {
  const { role } = useContext(UserContext);
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(SHIPMENTS[0]);

  // RBAC Access Check
  const hasAccess = 
    role === UserRole.SYSTEM_ADMIN || 
    role === UserRole.STORES || 
    role === UserRole.SUPERVISOR || 
    role === UserRole.MANAGEMENT;

  const isReadOnly = role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view Inbound Receipts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              Procurement <span className="text-slate-300">/</span> Inbound Logistics
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Truck className="text-brand-600" size={24} />
             Inbound Receipt & Serialization (S3)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Verify shipments, generate serials, and tag materials for QC.</p>
        </div>
        {!isReadOnly && (
          <div className="flex gap-3">
             <button 
              className="bg-brand-600 text-white px-4 py-2 rounded-md font-medium text-sm opacity-50 cursor-not-allowed flex items-center gap-2"
              disabled
              title="Demo Mode: Backend not connected"
            >
              <Package size={16} />
              <span>Register New Arrival</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Shipment List */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <List size={16} />
               Inbound Manifest
             </h3>
             <span className="text-xs text-slate-400">Today's Arrivals</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {SHIPMENTS.map((shipment) => (
              <div 
                key={shipment.id} 
                onClick={() => setSelectedShipment(shipment)}
                className={`p-3 rounded-md cursor-pointer border transition-all ${
                  selectedShipment.id === shipment.id 
                    ? 'bg-brand-50 border-brand-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{shipment.shipmentId}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    shipment.status === 'Received' ? 'bg-green-100 text-green-700' :
                    shipment.status === 'QC Hold' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2">{shipment.supplier}</div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-slate-100 px-1 rounded text-slate-600 font-mono">{shipment.materialType}</span>
                  <span className="text-slate-400">PO: {shipment.poRef}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Processing Detail */}
        <div className="col-span-8 bg-white rounded-lg shadow-sm border border-industrial-border flex flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{selectedShipment.shipmentId}</h2>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} />
                  <span>Arrived: {selectedShipment.arrivalDate}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500">Supplier: <span className="font-medium text-slate-700">{selectedShipment.supplier}</span></p>
            </div>
            
             {/* QC Status Indicator */}
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-right">
                   <div className="text-[10px] text-slate-400 uppercase font-bold">Next Stage</div>
                   <div className="text-xs font-bold text-slate-700">
                     {selectedShipment.status === 'Received' ? 'Ready for QC' : 
                      selectedShipment.status === 'QC Hold' ? 'Quality Investigation' : 
                      'Receipt Pending'}
                   </div>
                </div>
                {selectedShipment.status === 'Received' ? <CheckCircle2 className="text-green-500" size={24} /> :
                 selectedShipment.status === 'QC Hold' ? <AlertTriangle className="text-red-500" size={24} /> :
                 <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-amber-500 animate-spin" />}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. Verification Section */}
            <section className="bg-slate-50 rounded-lg border border-slate-200 p-4">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <ClipboardCheck size={16} className="text-brand-500" />
                 Quantity Verification
               </h3>
               <div className="grid grid-cols-3 gap-6">
                 <div>
                    <div className="text-xs text-slate-500 mb-1">Expected Qty</div>
                    <div className="text-lg font-bold text-slate-900">{selectedShipment.expectedQty.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span></div>
                 </div>
                 <div>
                    <div className="text-xs text-slate-500 mb-1">Received Qty</div>
                    <div className={`text-lg font-bold ${selectedShipment.receivedQty < selectedShipment.expectedQty ? 'text-amber-600' : 'text-green-600'}`}>
                      {selectedShipment.receivedQty.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
                    </div>
                 </div>
                 <div className="flex items-end">
                    <button 
                      disabled 
                      className="w-full bg-white border border-slate-300 text-slate-400 text-sm font-medium py-2 rounded shadow-sm opacity-60 cursor-not-allowed"
                      title="Demo Mode"
                    >
                      Update Count
                    </button>
                 </div>
               </div>
            </section>

            {/* 2. Serialization Panel */}
            <section className="border border-industrial-border rounded-lg overflow-hidden">
               <div className="bg-slate-50 p-3 border-b border-industrial-border flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Barcode size={16} className="text-brand-500" />
                    Serialization
                  </h3>
                  {!isReadOnly && (
                    <button 
                      disabled
                      className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded opacity-50 cursor-not-allowed flex items-center gap-1"
                      title="Demo Mode: Backend generation disabled"
                    >
                      <span>Generate Serials</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
               </div>
               
               {/* Serial List Visualization - Type A Empty State Applied */}
               <div className="max-h-64 overflow-y-auto bg-slate-100 p-4">
                  {selectedShipment.status === 'Pending' ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <div className="bg-white p-3 rounded-full mb-3 shadow-sm border border-slate-200">
                        <Barcode className="text-slate-300" size={24} />
                      </div>
                      <h3 className="text-slate-700 font-medium text-sm mb-1">No operational data available</h3>
                      <p className="text-slate-500 text-xs mb-3 max-w-xs">
                        Serialization data will populate when receipt is verified.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {MOCK_SERIALS.map((s, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded p-2 flex items-center gap-2 shadow-sm">
                          <Barcode size={14} className="text-slate-300" />
                          <div>
                            <div className="font-mono text-xs font-bold text-slate-700">{s.sn}</div>
                            <div className="text-[10px] text-slate-400">{s.batch}</div>
                          </div>
                        </div>
                      ))}
                      <div className="col-span-3 text-center text-xs text-slate-400 mt-2">
                        ... {selectedShipment.receivedQty - 15} more serials generated ...
                      </div>
                    </div>
                  )}
               </div>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
};