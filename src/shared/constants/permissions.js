// constants/permissions.js

// =========================================================
// TENANT PERMISSIONS
// =========================================================

export const PERMISSIONS = {

  // =======================================================
  // COMPANY
  // =======================================================

  COMPANY: {
    VIEW: "tenant.company.view",
    UPDATE: "tenant.company.update",
    DELETE: "tenant.company.delete",
  },

  // =======================================================
  // EMPLOYEES
  // =======================================================

  EMPLOYEE: {
    CREATE: "tenant.employee.create",
    VIEW: "tenant.employee.view",
    UPDATE: "tenant.employee.update",
    DELETE: "tenant.employee.delete",
    BLOCK: "tenant.employee.block",
  },

  // =======================================================
  // DEPARTMENTS
  // =======================================================

  DEPARTMENT: {
    VIEW: "tenant.department.view",
    CREATE: "tenant.department.create",
    UPDATE: "tenant.department.update",
    DELETE: "tenant.department.delete",
  },

  // =======================================================
  // ROLES
  // =======================================================

  ROLE: {
    VIEW: "tenant.role.view",
    CREATE: "tenant.role.create",
    UPDATE: "tenant.role.update",
    DELETE: "tenant.role.delete",
  },

  // =======================================================
  // PERMISSIONS
  // =======================================================

  PERMISSION: {
    VIEW: "tenant.permission.view",
  },

  // =======================================================
  // PROJECTS
  // =======================================================

  PROJECT: {
    CREATE: "tenant.project.create",
    VIEW: "tenant.project.view",
    UPDATE: "tenant.project.update",
    DELETE: "tenant.project.delete",
  },

  // =======================================================
  // MEETINGS
  // =======================================================

  MEETING: {
    CREATE: "tenant.meeting.create",
    VIEW: "tenant.meeting.view",
    UPDATE: "tenant.meeting.update",
    CANCEL: "tenant.meeting.cancel",
    START: "tenant.meeting.start",
    JOIN: "tenant.meeting.join",
    INVITE: "tenant.meeting.invite",
    MANAGE: "tenant.meeting.manage",
  },

  // =======================================================
  // ATTENDANCE
  // =======================================================

  ATTENDANCE: {
    VIEW: "tenant.attendance.view",
    MANAGE: "tenant.attendance.manage",
  },

  // =======================================================
  // ANALYTICS
  // =======================================================

  ANALYTICS: {
    VIEW: "tenant.analytics.view",
  },

  // =======================================================
  // DOCUMENTS
  // =======================================================

  DOCUMENTS: {
    VIEW: "tenant.documents.view",
    CREATE: "tenant.documents.create",
    DELETE: "tenant.documents.delete",
  },

  // =======================================================
  // BILLING
  // =======================================================

  BILLING: {
    VIEW: "tenant.billing.view",
    UPDATE: "tenant.billing.update",
  },

  // =======================================================
  // SUBSCRIPTIONS
  // =======================================================

  SUBSCRIPTION: {
    VIEW: "tenant.subscription.view",
    UPDATE: "tenant.subscription.update",
  },

  // =======================================================
  // INVOICES
  // =======================================================

  INVOICE: {
    VIEW: "tenant.invoice.view",
  },
};


// =========================================================
// PLATFORM PERMISSIONS
// =========================================================

export const PLATFORM_PERMISSIONS = {

  // =======================================================
  // TENANTS
  // =======================================================

  TENANT: {
    CREATE: "platform.tenant.create",
    VIEW: "platform.tenant.view",
    UPDATE: "platform.tenant.update",
    SUSPEND: "platform.tenant.suspend",
    ACTIVATE: "platform.tenant.activate",
    DELETE: "platform.tenant.delete",
  },

  // =======================================================
  // TENANT USERS
  // =======================================================

  TENANT_USER: {
    VIEW: "platform.tenant_user.view",
    UPDATE: "platform.tenant_user.update",
    DISABLE: "platform.tenant_user.disable",
    ENABLE: "platform.tenant_user.enable",
  },

  // =======================================================
  // SUBSCRIPTIONS
  // =======================================================

  SUBSCRIPTION: {
    VIEW_ALL: "platform.subscription.view_all",
    UPDATE: "platform.subscription.update",
  },

  // =======================================================
  // BILLING
  // =======================================================

  BILLING: {
    VIEW_ALL: "platform.billing.view_all",
    REFUND: "platform.billing.refund",
  },

  // =======================================================
  // PLANS
  // =======================================================

  PLAN: {
    CREATE: "platform.plan.create",
    VIEW: "platform.plan.view",
    UPDATE: "platform.plan.update",
    DELETE: "platform.plan.delete",
  },

  // =======================================================
  // USERS
  // =======================================================

  USER: {
    CREATE: "platform.user.create",
    VIEW: "platform.user.view",
    UPDATE: "platform.user.update",
    DELETE: "platform.user.delete",
  },

  // =======================================================
  // PERMISSIONS
  // =======================================================

  PERMISSION: {
    VIEW: "platform.permission.view",
    CREATE: "platform.permission.create",
    UPDATE: "platform.permission.update",
    DELETE: "platform.permission.delete",
  },

  // =======================================================
  // ROLES
  // =======================================================

  ROLE: {
    CREATE: "platform.role.create",
    VIEW: "platform.role.view",
    UPDATE: "platform.role.update",
    DELETE: "platform.role.delete",
  },

  // =======================================================
  // SYSTEM
  // =======================================================

  SYSTEM: {
    SETTINGS: "platform.system.settings",
    AUDIT_LOGS: "platform.system.audit_logs",
  },
};