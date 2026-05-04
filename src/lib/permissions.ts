export type Role = "admin" | "analyst" | "auditor" | "manager" | "user";

export interface RoleDef {
  id: Role;
  name: string;
  description: string;
  system: boolean;
  members: number;
  permissions: string[];
}

export interface PermissionNode {
  id: string;
  name: string;
  description?: string;
  children?: PermissionNode[];
}

export const PERMISSION_TREE: PermissionNode[] = [
  {
    id: "Identity",
    name: "Identity",
    description: "Manage users, roles and authentication",
    children: [
      { id: "Identity.Users", name: "Users", children: [
        { id: "Identity.Users.View",   name: "View" },
        { id: "Identity.Users.Create", name: "Create" },
        { id: "Identity.Users.Edit",   name: "Edit" },
        { id: "Identity.Users.Delete", name: "Delete" },
        { id: "Identity.Users.ManageRoles", name: "Manage Roles" },
      ]},
      { id: "Identity.Roles", name: "Roles", children: [
        { id: "Identity.Roles.View",   name: "View" },
        { id: "Identity.Roles.Create", name: "Create" },
        { id: "Identity.Roles.Edit",   name: "Edit" },
        { id: "Identity.Roles.Delete", name: "Delete" },
        { id: "Identity.Roles.ManagePermissions", name: "Manage Permissions" },
      ]},
    ],
  },
  {
    id: "Transaction",
    name: "Transaction",
    description: "View and operate on payment transactions",
    children: [
      { id: "Transaction.View",    name: "View" },
      { id: "Transaction.Export",  name: "Export" },
      { id: "Transaction.Approve", name: "Approve" },
      { id: "Transaction.Refund",  name: "Refund" },
      { id: "Transaction.Delete",  name: "Delete" },
    ],
  },
  {
    id: "Fraud",
    name: "Fraud Detection",
    description: "Operate the fraud detection engine",
    children: [
      { id: "Fraud.ViewAlerts",    name: "View Alerts" },
      { id: "Fraud.FlagTxn",       name: "Flag Transaction" },
      { id: "Fraud.BlockUser",     name: "Block User" },
      { id: "Fraud.SetThreshold",  name: "Set Threshold" },
      { id: "Fraud.ManageRules",   name: "Manage Rules" },
    ],
  },
  {
    id: "System",
    name: "System",
    description: "Operational telemetry and configuration",
    children: [
      { id: "System.HealthView",   name: "View Health" },
      { id: "System.ViewLogs",     name: "View Logs" },
      { id: "System.ManageSettings", name: "Manage Settings" },
    ],
  },
];

export const ALL_PERMISSIONS: string[] = (function collect(nodes: PermissionNode[]): string[] {
  return nodes.flatMap((n) => (n.children ? collect(n.children) : [n.id]));
})(PERMISSION_TREE);

export const ROLES_SEED: RoleDef[] = [
  {
    id: "admin", name: "Administrator", system: true, members: 3,
    description: "Full access to every Identity Service surface and the fraud engine.",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "manager", name: "Manager", system: false, members: 7,
    description: "Reviews flagged transactions and can block users or adjust thresholds.",
    permissions: [
      "Identity.Users.View", "Identity.Roles.View",
      "Transaction.View", "Transaction.Export", "Transaction.Approve", "Transaction.Refund",
      "Fraud.ViewAlerts", "Fraud.FlagTxn", "Fraud.BlockUser", "Fraud.SetThreshold",
      "System.HealthView",
    ],
  },
  {
    id: "analyst", name: "Analyst", system: false, members: 12,
    description: "Investigates anomalies and tunes deterministic risk rules.",
    permissions: [
      "Identity.Users.View",
      "Transaction.View", "Transaction.Export",
      "Fraud.ViewAlerts", "Fraud.FlagTxn", "Fraud.ManageRules",
      "System.HealthView", "System.ViewLogs",
    ],
  },
  {
    id: "auditor", name: "Auditor", system: true, members: 4,
    description: "Read-only access for compliance and audit trails.",
    permissions: [
      "Identity.Users.View", "Identity.Roles.View",
      "Transaction.View", "Transaction.Export",
      "Fraud.ViewAlerts",
      "System.HealthView", "System.ViewLogs",
    ],
  },
  {
    id: "user", name: "User", system: true, members: 184,
    description: "Standard end-user account. No back-office access.",
    permissions: [],
  },
];

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin", manager: "Manager", analyst: "Analyst", auditor: "Auditor", user: "User",
};

export const ROLE_BADGE_CLS: Record<Role, string> = {
  admin:   "bg-primary/10 text-primary border-primary/30",
  manager: "bg-success/10 text-success border-success/30",
  analyst: "bg-accent/40 text-foreground border-border",
  auditor: "bg-warning/10 text-warning border-warning/30",
  user:    "bg-muted text-muted-foreground border-border",
};