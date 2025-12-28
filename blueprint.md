# WhatsApp Messaging Platform

## Overview

This is a multi-tenant web application that allows users to send and receive WhatsApp messages. The application is built with React and Firebase and includes role-based access control.

### Features:

*   **User Authentication:** Secure user sign-up and login using Firebase Authentication.
*   **Role-Based Access Control (RBAC):**
    *   Three user roles: `user`, `admin`, and `superadmin`.
    *   `superadmin` has full access to user management and application settings.
    *   UI elements and routes are conditionally rendered based on user roles.
*   **User Management (Super Admin):**
    *   A dedicated `Users` page for managing all users.
    *   Create, Read, Update, and Delete (CRUD) functionality for users.
    *   A modal (`UserFormModal`) for adding and editing user details (email, role).
    *   User roles are managed using Firebase custom claims.
*   **Settings (Super Admin):**
    *   A dedicated `Settings` page for super admin users.
*   **Dashboard:** A central dashboard that provides an overview and navigation.
    *   `superadmin` users see links to the "Manage Users" and "Settings" pages.
*   **Multi-tenancy:** Each tenant has its own isolated set of users and companies.
*   **Messaging:** (Planned) Functionality to send and receive WhatsApp messages.

## Project Structure

```
src
├── components
│   ├── layout
│   │   ├── AppBar.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── Sidebar.tsx
│   ├── UserFormModal.tsx
│   ├── Auth.tsx
│   ├── CreateUserForm.tsx
│   ├── InviteUserModal.tsx
│   └── Message.tsx
├── layout
│   └── Dashboard.tsx
├── pages
│   ├── Companies.tsx
│   ├── Dashboard.tsx
│   ├── Messages.tsx
│   ├── Login.tsx
│   ├── Settings.tsx
│   └── Users.tsx
├── App.tsx
├── firebase.ts
├── main.tsx
├── theme.ts
└── types.ts
functions
├── index.js
└── package.json
```

## Current Status

The application has a solid foundation with a robust user management system.

*   **Implemented:**
    *   User authentication (Login, Logout).
    *   A complete user management module for `superadmin` users, including creating, viewing, updating, and deleting users and their roles.
    *   A `Settings` page for `superadmin` users.
    *   Role-based access control to restrict access to the user management and settings pages, with conditional rendering in the sidebar.
    *   A basic dashboard that adapts to the user's role.
    *   Cloud Function (`setCustomUserClaims`) to manage user roles securely.

## Next Steps

*   Implement the core functionality of sending and receiving WhatsApp messages.
*   Develop the "Companies" management section.
*   Flesh out the "Settings" page with actual configuration options.
*   Implement a billing and subscription system.
*   Enhance the UI and user experience.
*   Add comprehensive testing for all components and functions.
