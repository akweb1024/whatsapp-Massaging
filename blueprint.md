# Blueprint: Multi-Tenant Role-Based Dashboard & Reporting System

This document outlines the architecture and implementation plan for a multi-tenant, role-based dashboard system for the WhatsApp Management SaaS platform.

## 1. Core Architecture Principles
- **Strict Multi-Tenancy:** Complete data segregation by Company ID.
- **Granular RBAC:** Three roles: `super_admin`, `company_admin`, and `agent`.
- **Context-Aware UI:** The UI will dynamically adapt to the logged-in user's role.
- **Independent API Management:** Each company will manage its own WhatsApp API credentials.

---

## 2. Implementation Plan

### Phase 1: Foundational Setup
1.  **Update Firestore Schema:**
    *   Modify collections (`companies`, `users`, `usage_logs`, `activities`) to support multi-tenancy and RBAC as specified.
2.  **Define TypeScript Interfaces:**
    *   Create `src/types.ts` to define interfaces for `User`, `Company`, `UsageLog`, `Activity`, and other data models.
3.  **Implement Security Rules:**
    *   Update `firestore.rules` to enforce strict data isolation based on `companyId` and user `role`. Super Admins will have privileged access.

### Phase 2: Authentication & Role-Based Access
1.  **Enhance Authentication Hook:**
    *   Update the `useAuth` hook to fetch and provide the user's role and `companyId` from the `users` collection.
2.  **Create Protected Routes:**
    *   Implement a `ProtectedRoute` component that wraps routes, checking for authentication and role permissions.
3.  **Implement Tenant Context:**
    *   Create a `TenantProvider` to make the current user's `companyId` globally available to all components, ensuring queries are correctly filtered.

### Phase 3: Dashboard Implementation
1.  **Develop Role-Based Dashboards:**
    *   Create three distinct dashboard components:
        *   `SuperAdminDashboard.tsx`: For platform-wide management.
        *   `CompanyAdminDashboard.tsx`: For team and company management.
        *   `AgentDashboard.tsx`: For operational tasks.
2.  **Dynamic Sidebar Navigation:**
    *   Create a dynamic sidebar component that renders navigation links based on the user's role.
3.  **Refactor Main App Component:**
    *   Update `App.tsx` to use the new protected routes and render the appropriate dashboard and sidebar based on the logged-in user's role.

### Phase 4: Feature Implementation
1.  **API Key Management:**
    *   Build a secure settings page for Company Admins to manage their WhatsApp API credentials.
2.  **User Management:**
    *   Create UI and logic for Company Admins to invite, manage, and deactivate users within their company.
3.  **Financial & Usage Tracking:**
    *   Develop mock functions to simulate the calculation of usage costs. This will later be replaced by a Cloud Function.
4.  **Reporting Module:**
    *   Create a reusable `ReportBuilder` component and implement the specific reports required for each role.

---

## 3. Database Schema

*   **`companies`**: `{ companyId, companyName, apiCredentials, billingInfo, subscriptionStatus, createdBy }`
*   **`users`**: `{ uid, email, role, companyId, permissions, profile, status }`
*   **`usage_logs`**: `{ logId, companyId, userId, type, cost, timestamp, messageDirection }`
*   **`activities`**: `{ activityId, companyId, userId, action, details, timestamp }`

This plan will be executed sequentially to build the specified system.
