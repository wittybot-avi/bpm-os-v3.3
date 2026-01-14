import React from 'react';
import { Activity, Lock, Clock, AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';
import { STAGE_STATUS_MAP, StageState } from '../data/stageState';

interface StageStateBannerProps {
  stageId: string;
}

export const StageStateBanner: React.FC<StageStateBannerProps> = ({ stageId }) => {
  const status = STAGE_STATUS_MAP[stageId] || { 
    state: 'READY', 
    reason: 'Operational', 
    nextAction: 'Proceed' 
  };

  const getStyle = (state: StageState) => {
    switch (state) {
      case 'RUNNING': return 'bg-green-50 border-green-200 text-green-800';
      case 'BLOCKED': return 'bg-red-50 border-red-200 text-red-800';
      case 'WAITING': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'MAINTENANCE': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getIcon = (state: StageState) => {
    switch (state) {
      case 'RUNNING': return Activity;
      case 'BLOCKED': return Lock;
      case 'WAITING': return Clock;
      case 'MAINTENANCE': return AlertTriangle;
      case 'COMPLETE': return CheckCircle2;
      default: return AlertOctagon; // Ready / Info default
    }
  };

  const Icon = getIcon(status.state);

  return (
    <div className={`mt-0 mb-6 px-4 py-2 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 ${getStyle(status.state)}`}>
      <div className="flex items-center gap-2">
         <Icon size={14} className="shrink-0" />
         <span className="font-bold uppercase tracking-wider">{stageId} STATE: {status.state}</span>
         <span className="hidden sm:inline opacity-50">|</span>
         <span className="font-medium opacity-90">{status.reason}</span>
      </div>
      <div className="flex items-center gap-2 opacity-80 sm:text-right">
         <span className="font-bold uppercase text-[10px]">NEXT ACTION:</span>
         <span className="font-mono">{status.nextAction}</span>
      </div>
    </div>
  );
};
