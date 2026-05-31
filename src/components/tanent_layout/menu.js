import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CreditCard,
  BarChart3,
  FileText,
  Archive,
  Settings,
  Shield,
  Building2,
  Receipt,
  MessageSquare,
  Video,
  Clock  // 🆕 Lucide icon for Attendance
} from "lucide-react";
import { PERMISSIONS } from "../../shared/constants/permissions";

/**
 * Menu Configuration Architecture
 * 
 * Organized into logical sections for enterprise SaaS scalability.
 * Each section can be permission-gated at the section level if needed.
 */

export const overviewSection = {
  title: "Overview",
  items: [
    {
      label: "Dashboard",
      path: "/app/dashboard",
      icon: LayoutDashboard,
      permission: null,
      shortcut: "⌘D",
    },
  ],
};


export const operationsSection = {
  title: "Operations",
  items: [
    {
      label: "Attendance",
      path: "/app/attendance",
      icon: Clock,
      permission: PERMISSIONS.ATTENDANCE.VIEW,
      shortcut: "⌘H",
    },
    {
      label: "Projects",
      path: "/app/projects",
      icon: FolderKanban,
      permission: PERMISSIONS.PROJECT.VIEW,
      shortcut: "⌘P",
    },
    {
      label: "Meetings",
      path: "/app/meetings",
      icon: Video,
      permission: null,
    },
    {
      label: "Chat",
      path: "/app/chat",
      icon: MessageSquare,
      permission: null,
    },
  ],
};



// ─── Section: Workspace ───────────────────────────────────────────────────────
export const workspaceSection = {
  title: "Workspace",
  items: [
    {
      label: "Documents",
      path: "/app/documents",
      icon: FileText,
      permission: PERMISSIONS.DOCUMENTS.VIEW, // tenant.documents.view
    },
    {
      label: "Archive",
      path: "/app/archive",
      icon: Archive,
      permission: PERMISSIONS.COMPANY.VIEW, // tenant.company.view
    },
  ],
};

// ─── Section: Administration ──────────────────────────────────────────────────
// administrationSection with corrected permission
export const administrationSection = {
  title: "Administration",
  items: [
    {
      label: "Employees",
      path: "/app/employees",
      icon: Users,
      permission: PERMISSIONS.EMPLOYEE.VIEW,
      shortcut: "⌘E",
      badge: true,
    },
    {
      label: "Departments",
      path: "/app/departments",
      icon: Building2,
      permission: PERMISSIONS.DEPARTMENT.VIEW, // ✅ Now exists!
    },
    {
      label: "Roles & Permissions",
      path: "/app/roles",
      icon: Shield,
      permission: PERMISSIONS.ROLE.VIEW,
    },

    {
      label: "Attendance Setup",
      path: "/app/setup-attendance",
      icon: Settings,
      permission: PERMISSIONS.ATTENDANCE.MANAGE,
    },
  ],
};

// ─── Section: System ──────────────────────────────────────────────────────────
export const systemSection = {
  title: "System",
  items: [
    {
      label: "Billing",
      path: "/app/billing",
      icon: CreditCard,
      permission: PERMISSIONS.BILLING.VIEW, // tenant.billing.view
      shortcut: "⌘B",
      children: [
        {
          label: "Subscription",
          path: "/app/billing/subscription",
          permission: PERMISSIONS.SUBSCRIPTION.VIEW, // tenant.subscription.view
        },
        {
          label: "Invoices",
          path: "/app/billing/invoices",
          permission: PERMISSIONS.INVOICE.VIEW, // tenant.invoice.view
        },
      ],
    },
    {
      label: "Company Settings",
      path: "/app/settings/company",
      icon: Settings,
      permission: PERMISSIONS.COMPANY.UPDATE, // tenant.company.update
    },
  ],
};

// ─── Aggregated Sections Array ────────────────────────────────────────────────
export const menuSections = [
  overviewSection ,
  operationsSection,
  workspaceSection,
  administrationSection,
  systemSection,
];

// ─── Flattened Menu (Backward Compatibility) ──────────────────────────────────
export const tenantMenu = menuSections.flatMap(section => section.items);

// ─── Permission Utilities ─────────────────────────────────────────────────────

/**
 * Check if user has required permission
 * Supports single permission or array (OR logic)
 */
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!requiredPermission) return true;
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  
  // Handle array of permissions (OR logic)
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some(p => userPermissions.includes(p));
  }
  
  return userPermissions.includes(requiredPermission);
};

/**
 * Filter menu items recursively based on user permissions
 * Preserves nested children structure
 */
export const filterMenuByPermissions = (menuItems, userPermissions) => {
  return menuItems.reduce((acc, item) => {
    const hasAccess = hasPermission(userPermissions, item.permission);
    
    if (!hasAccess) return acc;
    
    const filteredItem = { ...item };
    
    if (item.children?.length) {
      filteredItem.children = filterMenuByPermissions(
        item.children, 
        userPermissions
      );
    }
    
    acc.push(filteredItem);
    return acc;
  }, []);
};

/**
 * Filter entire sections based on permissions
 * Returns sections that have at least one visible item
 */
export const filterSectionsByPermissions = (sections, userPermissions) => {
  return sections.reduce((acc, section) => {
    const filteredItems = filterMenuByPermissions(
      section.items, 
      userPermissions
    );
    
    if (filteredItems.length > 0) {
      acc.push({
        ...section,
        items: filteredItems,
      });
    }
    
    return acc;
  }, []);
};

/**
 * Get all permissions required for a menu item (including children)
 */
export const getRequiredPermissions = (item) => {
  const permissions = new Set();
  
  if (item.permission) {
    permissions.add(item.permission);
  }
  
  if (item.children) {
    item.children.forEach(child => {
      getRequiredPermissions(child).forEach(p => permissions.add(p));
    });
  }
  
  return Array.from(permissions);
};

/**
 * Check if any items in a section are accessible
 */
export const hasSectionAccess = (section, userPermissions) => {
  return section.items.some(item => 
    hasPermission(userPermissions, item.permission)
  );
};