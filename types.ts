import { createContext } from 'react';

// RBAC Roles
export enum UserRole {
  SYSTEM_ADMIN = 'System Admin',
  ENGINEERING = 'Design / Engineering',
  STORES = 'Stores / Incoming QC',
  OPERATOR = 'Production Operator',
  QA_ENGINEER = 'QA Engineer',
  SUPERVISOR = 'Supervisor',
  MANAGEMENT = 'Management / Auditor',
  PROCUREMENT = 'Commercial / Procurement',
  PLANNER = 'Production Planner',
  LOGISTICS = 'Logistics / Dispatch',
  SERVICE = 'Service / Support',
  SUSTAINABILITY = 'Sustainability / ESG',
  COMPLIANCE = 'Compliance / Regulatory'
}

// User Context Interface
export interface UserContextType {
  id: string;
  name: string;
  role: UserRole;
  isDemo: boolean;
  setRole: (role: UserRole) => void;
  checkAccess: (featureId: string) => boolean;
}

// Default context (safe fallback)
export const UserContext = createContext<UserContextType>({
  id: 'guest',
  name: 'Guest',
  role: UserRole.OPERATOR,
  isDemo: true,
  setRole: () => {},
  checkAccess: () => false
});

// App Constants
export const APP_VERSION = 'V3.1-EXT';
export const APP_NAME = 'BPM-OS';
export const PATCH_ID = 'EXT-HO-095';

// Navigation Views
export type NavView = 
  | 'dashboard' 
  | 'control_tower'
  | 'runbook_detail'
  | 'exceptions_view'
  | 'system_setup' 
  | 'sku_blueprint' 
  | 'procurement' 
  | 'inbound_receipt' 
  | 'batch_planning' 
  | 'module_assembly' 
  | 'module_qa' 
  | 'pack_assembly' 
  | 'pack_review' 
  | 'battery_registry' 
  | 'bms_provisioning' 
  | 'finished_goods' 
  | 'packaging_aggregation' 
  | 'dispatch_authorization' 
  | 'dispatch_execution' 
  | 'service_warranty' 
  | 'recycling_recovery' 
  | 'compliance_audit' 
  | 'documentation'
  | 'live_status'
  | 'system_inventory'
  | 'production_line'
  | 'system_logs'
  | 'system_reports';