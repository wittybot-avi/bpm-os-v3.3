import React, { useState, useMemo } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ControlTower } from './components/ControlTower';
import { RunbookDetail } from './components/RunbookDetail';
import { ExceptionsView } from './components/ExceptionsView';
import { SystemSetup } from './components/SystemSetup';
import { SKUBlueprint } from './components/SKUBlueprint';
import { Procurement } from './components/Procurement';
import { InboundReceipt } from './components/InboundReceipt';
import { BatchPlanning } from './components/BatchPlanning';
import { ModuleAssembly } from './components/ModuleAssembly';
import { ModuleQA } from './components/ModuleQA';
import { PackAssembly } from './components/PackAssembly';
import { PackReview } from './components/PackReview';
import { BatteryRegistry } from './components/BatteryRegistry';
import { BMSProvisioning } from './components/BMSProvisioning';
import { FinishedGoods } from './components/FinishedGoods';
import { PackagingAggregation } from './components/PackagingAggregation';
import { DispatchAuthorization } from './components/DispatchAuthorization';
import { DispatchExecution } from './components/DispatchExecution';
import { ServiceWarranty } from './components/ServiceWarranty';
import { RecyclingRecovery } from './components/RecyclingRecovery';
import { ComplianceAudit } from './components/ComplianceAudit';
import { Documentation } from './components/Documentation';
import { LiveStatus } from './components/LiveStatus';
import { SystemInventory } from './components/SystemInventory';
import { ProductionLine } from './components/ProductionLine';
import { SystemLogs } from './components/SystemLogs';
import { SystemReports } from './components/SystemReports';
import { UserRole, UserContextType, UserContext, NavView } from './types';
import { canAccess } from './utils/rbac';

const App: React.FC = () => {
  // PP-010: View State
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  
  // EXT-BP-004: Runbook Context State
  const [activeRunbookId, setActiveRunbookId] = useState<string | null>(null);
  
  // BP-002: Dynamic Role State
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);

  // Derive user identity based on role for demo purposes
  const userContextValue: UserContextType = useMemo(() => {
    return {
      id: `usr_${currentRole.toLowerCase().replace(/ /g, '_')}`,
      name: `${currentRole} User`, // Generic name based on role
      role: currentRole,
      isDemo: true,
      setRole: (role: UserRole) => setCurrentRole(role),
      checkAccess: (featureId: string) => canAccess(currentRole, featureId)
    };
  }, [currentRole]);

  // Handler for deep linking to runbooks
  const handleRunbookNavigation = (runbookId: string) => {
    setActiveRunbookId(runbookId);
    setCurrentView('runbook_detail');
  };

  return (
    <ErrorBoundary>
      <UserContext.Provider value={userContextValue}>
        <Layout currentView={currentView} onNavigate={setCurrentView}>
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'control_tower' && <ControlTower onNavigate={handleRunbookNavigation} onViewExceptions={() => setCurrentView('exceptions_view')} />}
          {currentView === 'runbook_detail' && <RunbookDetail runbookId={activeRunbookId} onNavigate={setCurrentView} />}
          {currentView === 'exceptions_view' && <ExceptionsView onNavigate={setCurrentView} />}
          
          {currentView === 'system_setup' && <SystemSetup />}
          {currentView === 'sku_blueprint' && <SKUBlueprint />}
          {currentView === 'procurement' && <Procurement />}
          {currentView === 'inbound_receipt' && <InboundReceipt />}
          {currentView === 'batch_planning' && <BatchPlanning />}
          {currentView === 'module_assembly' && <ModuleAssembly />}
          {currentView === 'module_qa' && <ModuleQA />}
          {currentView === 'pack_assembly' && <PackAssembly />}
          {currentView === 'pack_review' && <PackReview />}
          {currentView === 'battery_registry' && <BatteryRegistry />}
          {currentView === 'bms_provisioning' && <BMSProvisioning />}
          {currentView === 'finished_goods' && <FinishedGoods />}
          {currentView === 'packaging_aggregation' && <PackagingAggregation />}
          {currentView === 'dispatch_authorization' && <DispatchAuthorization />}
          {currentView === 'dispatch_execution' && <DispatchExecution />}
          {currentView === 'service_warranty' && <ServiceWarranty />}
          {currentView === 'recycling_recovery' && <RecyclingRecovery />}
          {currentView === 'compliance_audit' && <ComplianceAudit />}
          {currentView === 'documentation' && <Documentation />}
          {currentView === 'live_status' && <LiveStatus />}
          {currentView === 'system_inventory' && <SystemInventory />}
          {currentView === 'production_line' && <ProductionLine />}
          {currentView === 'system_logs' && <SystemLogs />}
          {currentView === 'system_reports' && <SystemReports />}
        </Layout>
      </UserContext.Provider>
    </ErrorBoundary>
  );
};

export default App;