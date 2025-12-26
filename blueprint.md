# Project Blueprint

## Overview

This document outlines the development of a React application with Firebase integration. The goal is to create a modern, robust, and scalable web application, starting with a basic messaging interface.

## Project Outline

*   **Messaging Interface:** A simple UI for sending and displaying messages.
*   **Firebase Integration:** Firestore is used for real-time message storage and retrieval.
*   **Styling:** The application uses Material-UI with a custom dark theme inspired by WhatsApp.

## Database Structure

*   **tenants:** `{ id, name, plan, apiStatus, webhookSecret }`
*   **users:** `{ uid, email, role, tenantId, assignedChats: [] }`
*   **contacts:** `{ id, phoneNumber, name, tags: [], profilePic, lastSeen, tenantId }`
*   **conversations:** `{ id, contactId, status: 'open'|'closed', assignedAgentId, unreadCount, lastMessageTime, tags: [] }`
    *   **messages:** `{ content, senderType: 'agent'|'customer', timestamp, status: 'sent'|'delivered'|'read', type: 'text'|'media' }`
*   **campaigns:** `{ id, name, templateName, scheduledTime, status, stats: { sent, delivered } }`
*   **templates:** `{ id, name, category, language, status: 'approved'|'pending', components: [] }`

## Current Plan

1.  **Set up the basic UI:**
    *   Install Material-UI for UI components.
    *   Create a basic layout with a message display area and an input field.
2.  **Integrate Firebase:**
    *   Initialize Firebase in the project.
    *   Set up Firestore to store and retrieve messages.
3.  **Implement basic messaging functionality:**
    *   Users can type and send messages.
    *   Messages are displayed in real-time.
4.  **Refactor the database structure:**
    *   Update Firestore security rules to match the new schema.
    *   Refactor the application to use the `conversations/{convId}/messages` subcollection.
