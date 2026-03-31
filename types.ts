
export enum View {
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  DRAFTING = 'DRAFTING',
  SEARCH = 'SEARCH',
  MONITORING = 'MONITORING',
  COLLABORATION = 'COLLABORATION',
  AUDIT_LOGS = 'AUDIT_LOGS',
  AUTH = 'AUTH'
}

export type UserRole = 'Inventor' | 'Legal Team' | 'Law Firm' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  lastLogin?: string;
}

export interface Claim {
  id: string;
  type: 'Independent' | 'Dependent';
  content: string;
  version: number;
  lastModifiedBy: string;
}

export interface PriorArtItem {
  title: string;
  uri: string;
  snippet: string;
  relevance: 'High' | 'Medium' | 'Low';
}

export interface PublicSearchResult {
  existingPatents: PriorArtItem[];
  advice: string[];
  noveltyEstimate: string;
}

export interface PatentDraft {
  id: string;
  abstract: string;
  claims: Claim[];
  description: string;
  figures: { id: string, description: string, url: string }[];
  status: 'Draft' | 'Review' | 'Finalized' | 'Filed';
  version: number;
  legalFlags: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceId: string;
  ipAddress: string;
}

export interface InventionProfile {
  id: string;
  title: string;
  description: string;
  summary: string;
  classification: string;
  keywords: string[];
  noveltyScore: number;
  riskFlags: string[];
  flowchartCode: string;
  missingDetails?: string[];
}

export interface Project {
  id: string;
  organizationId: string;
  invention: InventionProfile;
  draft: PatentDraft;
  priorArt: PriorArtItem[];
  tasks: any[];
  auditLogs: AuditLog[];
  status: 'Draft' | 'Review' | 'Finalized' | 'Filed';
}
