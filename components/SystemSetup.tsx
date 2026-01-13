import React, { useContext } from 'react';
import { UserContext, UserRole, APP_VERSION } from '../types';
import { ShieldAlert, Factory, Settings, FileText, Globe, Users } from 'lucide-react';

export const SystemSetup: React.FC = () => {
  const { role } = useContext(UserContext);

  const hasAccess = role === UserRole.SYSTEM_ADMIN || role === UserRole.MANAGEMENT;

  if (!hasAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
        <p>Your role ({role}) does not have permission to view System Setup.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Standard Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
              System Setup <span className="text-slate-300">/</span> Overview
           </div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Settings className="text-brand-600" size={24} />
             System Setup (S0)
           </h1>
           <p className="text-slate-500 text-sm mt-1">Plant configuration, regulatory context, and user registry.</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs font-bold border border-amber-200">
          READ ONLY MODE
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Plant Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-industrial-border">
          <div className="flex items-center gap-2 mb-4 text-brand-700">
            <Factory size={20} />
            <h2 className="font-bold">Plant / Facility Overview</h2>
          </div>
          <div className="space-y-3 text-sm">
             <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Facility Name</span>
                <span className="font-medium text-slate-800">Gigafactory 1 - Bengal Unit</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Location</span>
                <span className="font-medium text-slate-800">Kolkata, WB, India (IST Zone)</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Facility ID</span>
                <span className="font-mono text-slate-600">FAC-IND-WB-001</span>
             </div>
          </div>
        </div>

        {/* Manufacturing Lines */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-industrial-border">
          <div className="flex items-center gap-2 mb-4 text-brand-700">
            <Settings size={20} />
            <h2 className="font-bold">Manufacturing Lines</h2>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-medium text-slate-700">Pack Assembly Line A</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">ACTIVE</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200 opacity-75">
                <span className="font-medium text-slate-700">Module Assembly Line B</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full font-bold">MAINTENANCE</span>
             </div>
          </div>
        </div>

        {/* Regulatory Context */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-industrial-border">
           <div className="flex items-center gap-2 mb-4 text-brand-700">
            <Globe size={20} />
            <h2 className="font-bold">Regulatory Context</h2>
          </div>
          <div className="flex flex-wrap gap-2">
             <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold">AIS-156 Amd 3</span>
             <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold">EU Battery Reg 2023/1542</span>
             <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold">PLI Scheme Compliant</span>
             <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded text-xs font-semibold">Battery Aadhaar Enabled</span>
          </div>
        </div>

        {/* SOP Version & Governance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-industrial-border">
           <div className="flex items-center gap-2 mb-4 text-brand-700">
            <FileText size={20} />
            <h2 className="font-bold">SOP Governance</h2>
          </div>
           <div className="space-y-3 text-sm">
             <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Active SOP Version</span>
                <span className="font-mono font-bold text-brand-600">{APP_VERSION}</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Last Audit</span>
                <span className="font-medium text-slate-800">2025-12-15</span>
             </div>
          </div>
        </div>

      </div>
      
      {/* Role Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-industrial-border">
          <div className="flex items-center gap-2 mb-4 text-brand-700">
            <Users size={20} />
            <h2 className="font-bold">User Role Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Access Level</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Active Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-slate-800 font-medium">System Admin</td>
                  <td className="px-4 py-3 text-slate-600">Full Access</td>
                  <td className="px-4 py-3 font-mono text-right">1</td>
                </tr>
                 <tr>
                  <td className="px-4 py-3 text-slate-800 font-medium">Management</td>
                  <td className="px-4 py-3 text-slate-600">Read / Audit</td>
                  <td className="px-4 py-3 font-mono text-right">2</td>
                </tr>
                 <tr>
                  <td className="px-4 py-3 text-slate-800 font-medium">Operator</td>
                  <td className="px-4 py-3 text-slate-600">Execution Only</td>
                  <td className="px-4 py-3 font-mono text-right">14</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};