
export const SYSTEM_CONTEXT_CONTENT = `
# BPM-OS System Context (V3.1-EXT)

## 1. Product Vision
Battery Pack Manufacturing Operating System (BPM-OS) is a specialized MES designed for high-compliance battery assembly.
It bridges the gap between physical manufacturing (OT) and digital traceability (IT).

## 2. Operational Flow (SOP Map)
The system follows a strict linear sequence defined by the SOP:

- **S0-S1:** System Setup & Product Definition (Blueprint)
- **S2-S3:** Inbound Logistics & Material Verification
- **S4:** Production Planning & Batch Scheduling
- **S5-S8:** Manufacturing Execution (Cell -> Module -> Pack -> QA)
- **S9-S10:** Digital Identity & BMS Provisioning (Trace)
- **S11-S14:** Outbound Logistics & Dispatch
- **S15-S17:** Lifecycle Service & Compliance Governance

## 3. V3.1-EXT Scope
The "EXT" (Operations, Control & Dashboards) extension adds:
- Enhanced sidebar navigation for scalability.
- Consolidated system-level views (Inventory, Logs, Status).
- **Dashboard Graph Framework** (Added in EXT-PP-023) for management analytics.
- Separation of concerns between Frontend (Visual) and Backend (Logic).
- Strict "Trace" vs "Track" semantic enforcement.

## 4. Current UI Capabilities (as of EXT-HO-095)
The frontend baseline is **DESIGN FROZEN**.
**Last updated via patch:** EXT-HO-095 (Final Design Freeze & Handover Declaration)

## 5. Dashboard Foundation (EXT-PP-025)
The System Dashboard is a **TRACK** surface. It shows the current operational state of the plant and fleet.
- **Purpose:** Real-time visibility, trend analysis, and exception spotting.
- **Non-Purpose:** It is NOT the system of record for lineage (use Registry) and NOT an action surface (use Control Tower).
- **Structure:** The 4-section layout (Snapshot, Trends, Distribution, Risk) is frozen.

## 6. Handover Notes
This frontend is a **state-driven visual shell**. 
It contains NO business logic for:
- Inventory transactions
- Serial number generation
- Regulatory validation checks
- Hardware integration (CAN/Modbus)

All such logic must be implemented in the backend microservices.

---

# HANDOVER APPENDIX I: UI INVENTORY (EXT-HO-091)

## A. Screen Index
*(Refer to previous patch documentation for full screen inventory table)*

## B. Route Map
*   **Root (/)** -> Dashboard
*   **Operational Groups**: System Setup, Procurement, Production, Trace & Identity, Logistics, Track & Lifecycle, Govern, System.

---

# HANDOVER APPENDIX II: UI STATE MACHINE GLOSSARY (EXT-HO-094 VALIDATED)

*(Refer to previous patch documentation for validated glossary)*

---

# HANDOVER APPENDIX III: INTEGRATION HOOKS MAP (EXT-HO-093)

*(Refer to previous patch documentation for hooks map)*

---

# HANDOVER APPENDIX IV: HANDOVER VALIDATION NOTES (EXT-HO-094)

*(Refer to previous patch documentation for validation notes)*

---

# HANDOVER APPENDIX V: HANDOVER READINESS DECLARATION (EXT-HO-095)

**Status:** DESIGN FROZEN & HANDOVER READY
**Date:** 2026-01-15 22:30 (IST)
**Patch ID:** EXT-HO-095

## A. DECLARATION STATEMENT
**BPM-OS V3.1-EXT is hereby declared DESIGN-FROZEN and HANDOVER-READY.**
The Frontend Vibe-Coding Phase is complete. The interface semantics, navigation structure, and role-based behaviors are locked. Any deviation from this point forward requires formal change control.

## B. SCOPE LOCK — FROZEN ASSETS
The following components are contractually frozen:
1.  **Navigation & Sidebar:** Structure, grouping, and logic defined in \`Sidebar.tsx\`.
2.  **Route Paths:** Exact mapping as per \`ROUTE_MAP.md\`.
3.  **Role Dashboards:** Operator, Supervisor, Plant Head, Admin, Auditor views (EXT-PP-030 to 034).
4.  **Control Tower & Runbooks:** The 4-runbook architecture and their internal stage/gate logic.
5.  **System Pages:** Live Status, Inventory, Production Line, Logs, Reports, Documentation.
6.  **HUD Behavior:** Default collapsed state, non-blocking positioning, and metadata display.

## C. AUTHORITATIVE ARTIFACTS
These documents are the absolute source of truth for integration teams:
*   **RULEBOOK.md:** Behavioral constraints and "Frontend-Only" laws.
*   **BACKEND_CONTRACT.md (EXT-HO-090):** Data shapes and intent.
*   **SCREEN_INDEX.md (EXT-HO-091):** Complete inventory of visible surfaces.
*   **UI_STATE_MACHINE_GLOSSARY.md (EXT-HO-092):** Status enums and transition logic.
*   **INTEGRATION_HOOKS_MAP.md (EXT-HO-093):** React hook plug points.

## D. BACKEND HANDOVER GUARANTEES
To the Backend Engineering Team:
*   **No Reinterpretation:** You must not change the meaning of status enums (e.g., 'Blocked' means 'Blocked').
*   **Fixed Ordering:** Runbook stages must be returned in the order defined in the UI.
*   **Semantic Fidelity:** Track vs Trace distinction must be respected in API response structures.
*   **Auditor Safety:** Read-only constraints for Auditor roles must be enforced at the API level.

## E. QA / UAT ACCEPTANCE BASELINE
The frontend is accepted if:
1.  Navigation smoke test passes (all sidebar links load correct views).
2.  Dashboards render without crashing (White Screen test).
3.  Runbook details are readable end-to-end.
4.  Demo Mode labels are visible where backend data is absent.
5.  Responsiveness and basic accessibility checks pass.

## F. CHANGE CONTROL
Post-Freeze Change Rules:
*   No silent changes permitted.
*   Any UI/UX modification requires a new Patch ID and RULEBOOK update.
*   Backend changes that break the contract must be flagged immediately.

---
**END OF DECLARATION**
`;

export const RULEBOOK_CONTENT = `
# BPM-OS Frontend Vibe-Coding Rulebook

**SCOPE:** FRONTEND ONLY
**VERSION:** V3.1-EXT (Operations, Control & Dashboards)

## A. Frontend-Only Scope (Authoritative)
This project is a **Frontend-Only** implementation of the BPM-OS V3.1-EXT interface.
**ABSOLUTE CONSTRAINT:** Backend logic, databases, APIs, and persistence layers are **FORBIDDEN** in this codebase.
- All data must be mocked or managed via ephemeral client-side state.
- Business logic is limited to UI-visible state transitions only.
- Vibe coding focus is strictly on UI/UX, RBAC behavior, and component composition.

## B. Patch Prompt Contract
To reduce prompt overhead, the following constants apply to ALL future interactions unless explicitly overridden:
1.  **Implicit Context:** The AI must assume the "Frontend-Only" constraint applies to every request.
2.  **No Repetition:** Human prompts will provide variable data (Patch ID, Intent, Date, Scope). They will NOT repeat the standard rules defined here.
3.  **Authority:** Patch prompts must reference this \`RULEBOOK.md\` as the supreme authority for behavioral constraints.

## C. Date Authority Rule
1.  **No Hallucinations:** AI must **NEVER** guess, infer, increment, or simulate dates for governance logs or UI displays.
2.  **Human Injection:** Every patch prompt **MUST** include a specific "AUTHORITATIVE DATE (IST)".
3.  **Verbatim Usage:** The AI must copy the provided date string exactly (e.g., "2026-01-12 01:35 (IST)").
4.  **Stop Condition:** If a patch prompt is missing the authoritative date, the AI must **STOP** execution and request it.

## D. Patch Identity & Naming (EXT Discipline)
1.  **Single Source of Truth:** The Patch ID must be defined in \`types.ts\` (export const PATCH_ID).
2.  **Prefix Discipline:** All V3.1-EXT patches must use the \`EXT-\` prefix.
    - \`EXT-BP-xxx\`: Bridge/Baseline Patch (Governance, Shell, Setup)
    - \`EXT-PP-xxx\`: Primary Patch (Feature Implementation)
    - \`EXT-FP-xxx\`: Fix/Hardening Patch
    - \`EXT-HO-xxx\`: Handover Patch
3.  **Prohibition:** Hardcoding the patch ID string in any UI component is strictly forbidden.

## E. Semantic Hardening (Track vs Trace)
This semantic distinction must be strictly enforced across all EXT screens:
- **TRACE**: Past, lineage, identity, provenance, immutable history (e.g., "How was this made?").
- **TRACK**: Present, custody, state, location, lifecycle position (e.g., "Where is it now?").

## F. Demo Safety Rules
1.  **No White Screens:** The \`main\` branch must always render a working UI. Critical errors must be caught by an Error Boundary.
2.  **Safe Boot:** The application must boot into a safe, non-crashing state (e.g., Guest or Demo User).
3.  **Action Feedback:** Disabled actions (due to missing backend) must visually indicate their status (e.g., "Demo Mode", "Read Only") or provide a tooltip explaining why.
4.  **Refresh Resilience:** The app must handle browser refreshes without losing critical access context (defaulting to safe fallbacks if needed).

## G. Chart & Visualization Rules (EXT-PP-023)
1.  **Deterministic Data:** All charts must use consistent mock data that reconciles with other Dashboard KPIs. No random number generation.
2.  **Zero-Dependency:** Charts must be implemented using lightweight SVG components to avoid heavy external libraries.
3.  **Preservation:** Adding charts must never remove existing KPI cards or summary sections.

## H. System Intelligence & Documentation (EXT-PP-024)
1.  **HUD Behavior:** HUD must default to **collapsed** state on initial render unless explicitly expanded by the user.
2.  **Documentation Discipline:** Every EXT-PP patch must update at least one Documentation tab (\`docs/artifacts.ts\`). System Documentation is the authoritative handover surface.
3.  **Read-Only Intelligence:** Logs and Reports must be presented as read-only, audit-credible surfaces with functional filters (UI-only) but no mutation capabilities.

## I. Backend Semantics (EXT-HO-090)
1.  **Backend must match UI semantics; UI must not be reinterpreted.**
2.  **No backend logic shall be inferred from mock values; only structure.**

## J. Handover Authority (EXT-HO-091 - 094)
1.  **SCREEN_INDEX.md, ROUTE_MAP.md, RBAC_MATRIX.md are handover-authoritative.**
2.  **UI_STATE_MACHINE_GLOSSARY.md is authoritative.**
3.  **INTEGRATION_HOOKS_MAP.md defines the API wiring contract.**
4.  **EXT-HO-094 must be completed before EXT Design Freeze declaration.**

## L. EXT Design Freeze & Change Control (EXT-HO-095)
1.  **Freeze Authority:** EXT-HO-095 constitutes the final visual and semantic lock for V3.1-EXT.
2.  **Pre-requisite:** EXT-HO-094 (Validation) must remain stable for this freeze to be valid.
3.  **Change Control:** Any post-freeze UI changes require a formal "Fix Patch" (EXT-FP-xxx) with explicit justification in the Patchlog.

## K. RULEBOOK Precedence Clause
**THIS FILE IS SUPREME.**
- In the event of a conflict between an AI's internal training, previous context, or vague prompt instructions, the rules in \`RULEBOOK.md\` take precedence.
- If a prompt asks for backend logic, this Rulebook overrides it (see Section A).
`;

export const PATCHLOG_CONTENT = `
# BPM-OS Frontend PATCHLOG

| Patch ID | Patch Type | Intent | Status | Notes | Date |
|:---|:---|:---|:---|:---|:---|
| **BP-000** | Bridge Patch | Establish Clean V3.1 Frontend Baseline | **STABLE** | Initial app shell, RBAC stubs, Industrial UI Theme. | 2025-05-18 |
| **BP-001** | Bridge Patch | Introduce Governance Artifacts | **STABLE** | Added RULEBOOK.md and PATCHLOG.md. No UI changes. | 2025-05-18 |
| **BP-002** | Bridge Patch | Role Switcher & RBAC Scaffolding | **STABLE** | Added UI Role Switcher, RBAC context hooks. | 2025-05-19 (IST) |
| **BP-003** | Bridge Patch | Collapsible HUD & IST Date | **STABLE** | Added SystemHUD, moved meta-info, normalized dates. | 2025-05-20 (IST) |
| **BP-004** | Bridge Patch | Governance Hardening | **STABLE** | Enforced Date Authority & Unified Patch ID. | 2026-01-11 (IST) |
| **BP-005** | Bridge Patch | Date Protocol Lock | **STABLE** | Implemented Human-Injected Date Authority Rule. | 2026-01-11 (IST) |
| **PP-010** | Primary Patch | S0 System Setup & Governance | **STABLE** | Added System Setup screen, Nav routing, RBAC enforcement. | 2026-01-11 (IST) |
| **PP-011** | Primary Patch | S1 SKU & Regulatory Blueprint | **STABLE** | Added SKU Master List, Blueprint Detail, and Regulatory Flags. | 2026-01-11 (IST) |
| **PP-012** | Governance Patch | Governance Normalization | **STABLE** | Governance normalization — constants extracted to RULEBOOK. | 2026-01-11 (IST) |
| **PP-013** | Primary Patch | S2 Commercial Procurement | **STABLE** | Added S2 Procurement screen, Supplier Master, and Commercial terms UX. | 2026-01-11 (IST) |
| **PP-014** | Primary Patch | S3 Inbound Receipt & Serialization | **STABLE** | Added Inbound Shipment List, Serialization Panel, and QC indicators. | 2026-01-11 (IST) |
| **PP-015** | Primary Patch | S4 Manufacturing Batch Planning | **STABLE** | Added Batch Schedule List, Planning Details, and Line Readiness visualization. | 2026-01-11 21:30 (IST) |
| **PP-020** | Primary Patch | S5 Module Assembly Workstation | **STABLE** | Added Operator Interface, Active Batch Banner, and Task Checklist. | 2026-01-11 21:45 (IST) |
| **PP-021** | Primary Patch | S6 Module Quality Assurance | **STABLE** | Added QA Inspection Queue, Visual/Electrical Checklists, and Disposition. | 2026-01-11 22:00 (IST) |
| **PP-022** | Primary Patch | S7 Pack Assembly Workstation | **STABLE** | Added Pack Assembly UI, Enclosure & Harness tasks, and Finalization Controls. | 2026-01-11 22:15 (IST) |
| **PP-023** | Primary Patch | S8 Pack Review & Approval | **STABLE** | Added EOL Review Queue, Summary View, and Approval Decisions. | 2026-01-11 22:30 (IST) |
| **PP-024** | Primary Patch | S9 Battery Registry | **STABLE** | Added Read-Only System Registry, Digital Twin View, and Compliance Readiness. | 2026-01-11 22:45 (IST) |
| **PP-025** | Primary Patch | S10 BMS Provisioning | **STABLE** | Added BMS Identity Binding, Firmware Selection, and Provisioning Controls. | 2026-01-11 23:00 (IST) |
| **PP-030** | Primary Patch | S11 Finished Goods Inventory | **STABLE** | Added Warehouse Stock List, Location Detail, and Dispatch Actions. | 2026-01-11 23:15 (IST) |
| **PP-031** | Primary Patch | S12 Packaging & Aggregation | **STABLE** | Added Packaging Workstation, Eligible Queue, and Unit Visualization. | 2026-01-11 23:30 (IST) |
| **PP-032** | Primary Patch | S13 Dispatch Authorization | **STABLE** | Added Dispatch Queue, Review Panel, and Gate Pass Controls. | 2026-01-11 23:45 (IST) |
| **PP-033** | Primary Patch | S14 Dispatch Execution | **STABLE** | Added Execution Queue, Handover Panel, and Custody Transfer Controls. | 2026-01-12 00:00 (IST) |
| **PP-040** | Primary Patch | S15 Service & Warranty | **STABLE** | Added Service Dashboard, Telemetry Preview, and Warranty Status. | 2026-01-12 00:15 (IST) |
| **PP-041** | Primary Patch | S16 Recycling & Recovery | **STABLE** | Added EOL Intake Queue, Sorting Panel, and Sidebar Scroll Fix. | 2026-01-11 22:35 (IST) |
| **PP-050** | Primary Patch | S17 Compliance & Audit | **STABLE** | Added Compliance Dashboard, Regulatory Checks, and Audit Trail. | 2026-01-11 22:50 (IST) |
| **PP-061** | UX Patch | Sidebar Grouping & Cleanup | **STABLE** | Structured sidebar navigation into operational groups. | 2026-01-11 23:00 (IST) |
| **PP-062** | UX Patch | Header & Breadcrumb Standardization | **STABLE** | Unified page headers, typography, and breadcrumbs. | 2026-01-11 23:15 (IST) |
| **PP-063** | UX Patch | Empty State & Zero-Data Patterns | **STABLE** | Standardized messaging for empty states and demo modes. | 2026-01-11 23:30 (IST) |
| **PP-064** | UX Patch | Status Severity & Visual Normalization | **STABLE** | Enforced canonical status colors (Green/Amber/Red/Slate) across all screens. | 2026-01-11 23:45 (IST) |
| **PP-065** | UX Patch | Table Readability & Density | **STABLE** | Standardized table headers, spacing, and column alignment. | 2026-01-12 00:00 (IST) |
| **EXT-BP-000** | Bridge Patch | EXT Phase Initialization | **STABLE** | Established V3.1-EXT governance, documentation view, and rulebook. | 2026-01-12 01:35 (IST) |
| **EXT-BP-001** | Bridge Patch | Sidebar UX & Scalability | **STABLE** | Added collapsible sidebar sections and improved scroll behavior. | 2026-01-12 01:40 (IST) |
| **EXT-BP-002** | Bridge Patch | System Section Handover | **STABLE** | Populated Live Status, Inventory, Line, Logs, and Reports screens. | 2026-01-12 01:55 (IST) |
| **EXT-BP-003** | Bridge Patch | Control Tower Shell | **STABLE** | Added Control Tower operation spine and runbook visualization. | 2026-01-12 02:05 (IST) |
| **EXT-BP-004** | Bridge Patch | Runbook Detail Views | **STABLE** | Added detailed runbook navigation, stage spines, and gate context panels. | 2026-01-12 02:15 (IST) |
| **EXT-BP-005** | Bridge Patch | Exception Visibility Layer | **STABLE** | Added Global Attention Strip, Exceptions View, and Runbook Annotations. | 2026-01-12 02:25 (IST) |
| **EXT-BP-006** | Bridge Patch | OEE Visual Contract | **STABLE** | Added OEE zones, station readiness, and visual contracts for line performance. | 2026-01-12 02:35 (IST) |
| **EXT-PP-010** | Primary Patch | Role-Contextual Control Tower | **STABLE** | Added role-based visual emphasis, adaptive ordering, and auditor modes. | 2026-01-13 09:30 (IST) |
| **EXT-PP-020** | Primary Patch | Live Status Wallboard | **STABLE** | Transformed Live Status into a role-aware plant-wide snapshot. | 2026-01-13 09:45 (IST) |
| **EXT-PP-011** | Primary Patch | Manufacturing Runbook Logic | **STABLE** | Defined S4-S9 gate semantics, blocked state visuals, and role ownership. | 2026-01-13 10:05 (IST) |
| **EXT-FP-001** | Fix Patch | Documentation Sync | **STABLE** | Implemented artifacts registry for doc tabs. | 2026-01-13 10:20 (IST) |
| **EXT-PP-012** | Primary Patch | Material Runbook Logic | **STABLE** | Defined S2-S4 gate semantics, Trace Handoff at S4, and custody panels. | 2026-01-13 10:35 (IST) |
| **EXT-PP-013** | Primary Patch | Dispatch Runbook Logic | **STABLE** | Defined S11-S14 custody semantics, gate logic, and trace context. | 2026-01-13 10:55 (IST) |
| **EXT-PP-014** | Primary Patch | Warranty Runbook Logic | **STABLE** | Defined S15-S16 warranty responsibility, gate logic, and liability tracking. | 2026-01-13 11:10 (IST) |
| **EXT-PP-021** | Primary Patch | System Inventory Dashboard | **STABLE** | Added Inventory Abstraction Cards, Drill-Down Panel, and RBAC filtering. | 2026-01-13 11:25 (IST) |
| **EXT-PP-022** | Primary Patch | Production Line Master-Detail | **STABLE** | Added Master-Detail line view, OEE visual contracts, and station readiness map. | 2026-01-13 11:40 (IST) |
| **EXT-FP-002** | Fix Patch | System HUD UX Enhancement | **STABLE** | Made HUD draggable, collapsible, and persistent. | 2026-01-13 12:00 (IST) |
| **EXT-PP-023** | Primary Patch | Dashboard Graph Framework | **STABLE** | Added SVG Chart Framework and Management Analytics section. | 2026-01-13 12:30 (IST) |
| **EXT-PP-024** | Primary Patch | System Intelligence & Governance | **STABLE** | Formalized Reports, Logs, Documentation discipline, and HUD defaults. | 2026-01-13 14:00 (IST) |
| **EXT-PP-025** | Primary Patch | Dashboard Foundation Consolidation | **STABLE** | Consolidated dashboard layout (Snapshot/Trends/Dist/Risk) and froze foundation. | 2026-01-13 16:30 (IST) |
| **EXT-PP-030** | Primary Patch | Role Dashboard – Operator | **STABLE** | Implemented Operator view reusing foundation with progressive disclosure. | 2026-01-14 09:00 (IST) |
| **EXT-PP-031** | Primary Patch | Role Dashboard – Supervisor | **STABLE** | Implemented Supervisor view reusing foundation with oversight focus strip. | 2026-01-14 11:30 (IST) |
| **EXT-PP-032** | Primary Patch | Role Dashboard – Plant Head | **STABLE** | Implemented Plant Head view with OEE readiness and bottleneck analysis. | 2026-01-14 14:00 (IST) |
| **EXT-PP-033** | Primary Patch | Role Dashboard – Admin | **STABLE** | Implemented Admin view with System Governance and Integrity Panels. | 2026-01-14 16:30 (IST) |
| **EXT-PP-034** | Primary Patch | Role Dashboard – Auditor | **STABLE** | Implemented Auditor view with evidence pointers and custody focus. | 2026-01-14 17:00 (IST) |
| **EXT-FP-061** | Fix Patch | Visual Consistency Polish | **STABLE** | Harmonized padding (p-4/p-5), typography, and density across dashboards. | 2026-01-15 10:00 (IST) |
| **EXT-FP-062** | Fix Patch | Responsiveness Pass | **STABLE** | Layouts adapted for Laptop/Tablet/Kiosk with mini sidebar & fluid grids. | 2026-01-15 12:00 (IST) |
| **EXT-FP-063** | Fix Patch | Accessibility Pass | **STABLE** | Keyboard navigation, focus rings, and ARIA semantics applied. | 2026-01-15 14:00 (IST) |
| **EXT-FP-064** | Fix Patch | Performance Pass | **STABLE** | Virtualization-ready structures, memoization, and lazy-rendering applied. | 2026-01-15 16:00 (IST) |
| **EXT-FP-065** | Fix Patch | Demo Mode Clarity | **STABLE** | Added explicit demo captions, tooltips, and refined Auditor copy. | 2026-01-15 17:00 (IST) |
| **EXT-HO-090** | Handover Patch | Backend Contract & Intent Finalization | **STABLE** | Finalized intent-level API contract for System & Runbook pages. | 2026-01-15 18:00 (IST) |
| **EXT-HO-091** | Handover Patch | UI Inventory (Screen Index + Route Map) | **STABLE** | Generated authoritative Screen Index, Route Map, and RBAC Matrix. | 2026-01-15 19:00 (IST) |
| **EXT-HO-092** | Handover Patch | UI State Machine Glossary | **STABLE** | Created authoritative glossary for status enums and transition logic. | 2026-01-15 20:00 (IST) |
| **EXT-HO-093** | Handover Patch | Integration Hooks Map | **STABLE** | Defined UI plug points and integration constraints for backend teams. | 2026-01-15 21:00 (IST) |
| **EXT-HO-094** | Handover Patch | Consistency & Validation Pass | **STABLE** | Aligned Glossary and Contract enums with Frontend Implementation. | 2026-01-15 22:00 (IST) |
| **EXT-HO-095** | Handover Patch | Final Design Freeze & Handover Declaration | **STABLE** | Formally declared Design Freeze and locked all handover artifacts. | 2026-01-15 22:30 (IST) |
`;

export const BACKEND_CONTRACT_CONTENT = `
# BPM-OS V3.1-EXT — BACKEND HANDOVER CONTRACT

**Patch ID:** EXT-HO-090 (Validated EXT-HO-094)
**Status:** FROZEN (EXT-HO-095)
**Date:** 2026-01-15 22:00 (IST)
**Context:** V3.1-EXT (Operations, Control & Dashboards)

---

## 1. PREAMBLE & SCOPE
This document serves as the authoritative interface contract between the **Frontend Vibe-Code** and the **Backend Implementation**.
The UI has been "Vibe Coded" to a stable state (EXT-FP-065). The Backend team must implement APIs that satisfy these data shapes and semantics without altering the frontend behavior.

### Guiding Principles
1.  **Frontend-First Truth:** The UI structure determines the API payload structure. Do not "optimize" payloads in ways that require frontend refactoring.
2.  **Semantic Fidelity:** Statuses like 'Blocked', 'Open', 'Hold' must be treated as enum contracts.
3.  **No Business Logic in UI:** Calculations (OEE, Yield, Risk Scores) must be performed by the backend.

---

## 2. ENTITY GLOSSARY (INTENT)

| Entity | Definition |
|:---|:---|
| **Runbook** | A predefined operational workflow (e.g., "Manufacturing", "Dispatch") composed of sequential Stages. |
| **Stage** | A distinct phase in a runbook (e.g., S5 Module Assembly). Contains Gates and Steps. |
| **Gate** | A validation checkpoint (interlock) that must be cleared to proceed. |
| **Exception** | A system event (blocker, deviation) that halts flow or flags risk. |
| **Line** | A physical production line (e.g., "Line A") containing Stations. |
| **Station** | A discrete physical workspace where tasks occur. |
| **Metric** | An aggregated KPI (e.g., Yield, Throughput) computed over a time window. |
| **LogEvent** | An immutable audit record of a system or user action. |

---

## 3. ENDPOINT INDEX

### GROUP I: DASHBOARDS
*Powering the Role-Specific Dashboards (Operator, Supervisor, Plant Head, Admin, Auditor)*

- **GET /dashboard/summary**
    - Returns aggregated KPIs (Planned, Built, Yield, Hold).
- **GET /dashboard/trends**
    - Returns time-series data for sparklines and trend charts.
- **GET /dashboard/distributions**
    - Returns breakdown data (Stage Mix, Custody Mix).
- **GET /dashboard/{role}/summary**
    - Returns role-specific KPI cards (e.g., Operator Shift Info, Auditor Compliance Score).
- **GET /dashboard/{role}/attention**
    - Returns list of items requiring immediate user action (Blocks, Approvals).

### GROUP II: CONTROL TOWER & RUNBOOKS
*Powering ControlTower.tsx and RunbookDetail.tsx*

- **GET /control-tower/runbooks**
    - Returns high-level status of all active runbooks (Health, Stage, Progress).
- **GET /runbooks/{runbookId}**
    - Returns full details, including current custody and warranty context.
- **GET /runbooks/{runbookId}/stages**
    - Returns ordered list of stages with their status and gate states.
- **GET /runbooks/{runbookId}/exceptions**
    - Returns active exceptions linked to this runbook.

### GROUP III: LIVE STATUS
*Powering LiveStatus.tsx*

- **GET /live-status/summary**
    - Returns system-wide health metrics (Health %, Active Lines).
- **GET /live-status/operations**
    - Returns snapshot of running operations vs blocked operations.
- **GET /live-status/lines**
    - Returns real-time status of all physical lines and stations.

### GROUP IV: INVENTORY
*Powering SystemInventory.tsx*

- **GET /inventory/categories**
    - Returns summary counts for Cells, Modules, Packs, FG, etc.
- **GET /inventory/items**
    - *Query Params:* \`category\`, \`search\`, \`status\`
    - Returns paginated list of inventory items.

### GROUP V: PRODUCTION LINES
*Powering ProductionLine.tsx*

- **GET /lines**
    - Returns list of lines with summary health status.
- **GET /lines/{lineId}**
    - Returns detailed line state, including runbook association.
- **GET /lines/{lineId}/stations**
    - Returns status of individual stations (Ready/Running/Blocked/Idle).
- **GET /lines/{lineId}/oee**
    - Returns backend-computed Availability, Performance, and Quality scores.

### GROUP VI: EXCEPTIONS
*Powering ExceptionsView.tsx*

- **GET /exceptions**
    - Returns global exception list.
- **GET /exceptions/{id}**
    - Returns detailed resolution context and escalation path.

### GROUP VII: LOGS
*Powering SystemLogs.tsx*

- **GET /logs**
    - *Query Params:* \`category\`, \`severity\`, \`from\`, \`to\`, \`search\`
    - Returns immutable event stream.

### GROUP VIII: REPORTS
*Powering SystemReports.tsx*

- **GET /reports**
    - Returns registry of available report templates.
- **GET /reports/{reportId}/preview**
    - Returns mock/sample data for the report preview panel.

---

## 4. PAYLOAD SHAPES (EXAMPLES)

### A. Runbook Summary
\`\`\`json
{
  "id": "manufacturing",
  "title": "Manufacturing Execution",
  "status": "Blocked", // Enum: Healthy, Degraded, Blocked, Idle, Running
  "currentStage": "S5 Module Assembly",
  "blockReason": "Gate Interlock: Seal Check Failed",
  "roles": ["Planner", "Operator"],
  "lastUpdate": "2026-01-15T10:30:00Z"
}
\`\`\`

### B. Stage Detail
\`\`\`json
{
  "id": "mfg-02",
  "name": "Module Assembly (S5)",
  "status": "Hold", // Enum: Pending, In Progress, Hold, Completed
  "gate": {
    "status": "Locked", // Enum: Open, Closed, Locked
    "type": "Validation",
    "condition": "Seal Integrity Check"
  },
  "exception": {
    "id": "EX-001",
    "type": "Quality Failure",
    "severity": "Critical" // Enum: Critical, High, Medium, Low
  }
}
\`\`\`

### C. Line Status
\`\`\`json
{
  "id": "line-a",
  "name": "Line A (Modules)",
  "mode": "Running", // Enum: Running, Idle, Blocked, Maintenance
  "health": "OK",
  "stations": [
    { "id": "st-01", "name": "Cell Load", "state": "Running" },
    { "id": "st-02", "name": "Weld", "state": "Blocked", "reason": "Safety Curtain" }
  ]
}
\`\`\`

### D. Inventory Item
\`\`\`json
{
  "id": "CELL-2026-1001",
  "sku": "CELL-LFP-21700",
  "location": "Zone A - Rack 2",
  "status": "Good", // Enum: Good, Hold, Blocked
  "batchRef": "BATCH-INB-102",
  "age": "2 days"
}
\`\`\`

---

## 5. UI MAPPING NOTES

### Track vs Trace Semantics
*   **Track (Operational):** Endpoints under \`/dashboard\`, \`/live-status\`, \`/lines\`, \`/inventory\` refer to the **current state** and physical location.
*   **Trace (Historical/Identity):** Endpoints under \`/registry\` (S9), \`/reports\`, and \`/logs\` refer to **immutable history** and digital lineage.
*   *Constraint:* Do not mix these contexts. An inventory API should not return the full warranty history payload.

### Backend Computations
*   **OEE:** The frontend displays OEE as a percentage. The backend must ingest machine telemetry, apply the OEE formula, and return the final numbers.
*   **Bottleneck Detection:** The Plant Head dashboard shows "Bottleneck by Stage". The backend must analyze WIP accumulation to determine these values.
*   **Compliance Score:** The Admin/Auditor dashboard shows "Aadhaar Ready %". This is a backend aggregate of how many records satisfy the schema validation.

### Demo / Mock Handling
*   The frontend uses \`isDemo\` flags.
*   In production, these flags will be false. The backend must return real data conforming to the shapes above.
*   If a backend service is unavailable, it should return a standardized error object or empty state, not a 404/500 that breaks the UI shell.

---
**END OF CONTRACT**
`;
