import React from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export type DepartmentKey =
  | 'all'
  | 'opd'
  | 'doctor'
  | 'nurse'
  | 'laboratory'
  | 'pharmacy'
  | 'cashier'
  | 'finance'
  | 'eye'
  | 'hr'
  | 'it';

export interface RouteEntry {
  tab: string;
  path: string;
  aliases?: string[];
  departments: DepartmentKey[];
  component: LazyExoticComponent<ComponentType<any>>;
  fallbackTab?: string;
}

export interface RouteMatch {
  entry: RouteEntry;
  tab: string;
  redirectedFromAlias: boolean;
}

const lazyView = (importer: () => Promise<{ default: ComponentType<any> }>) =>
  React.lazy(importer);

const DashboardView = lazyView(() => import('../components/DashboardView'));
const OPDRegistrationView = lazyView(() => import('../components/OPDRegistrationView'));
const NursingView = lazyView(() => import('../components/NursingView'));
const EyeClinicView = lazyView(() => import('../components/EyeClinicView'));
const DoctorView = lazyView(() => import('../components/DoctorView'));
const LaboratoryView = lazyView(() => import('../components/LaboratoryView'));
const PharmacyView = lazyView(() => import('../components/PharmacyView'));
const HRDashboardView = lazyView(() => import('../components/HRDashboardView'));
const UserManagementView = lazyView(() => import('../components/UserManagementView'));
const CashierView = lazyView(() => import('../components/CashierView'));
const PatientDirectoryImportView = lazyView(
  () => import('../components/PatientDirectoryImportView'),
);

export const ROUTE_ENTRIES: RouteEntry[] = [
  { tab: 'dashboard', path: '/dashboard', aliases: ['/', '/overview'], departments: ['opd', 'nurse', 'eye', 'hr', 'it', 'all'], component: DashboardView, fallbackTab: 'dashboard' },
  { tab: 'overview', path: '/overview', departments: ['finance', 'all'], component: DashboardView, fallbackTab: 'dashboard' },
  { tab: 'hr-dashboard', path: '/hr/dashboard', aliases: ['/hr'], departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'dashboard' },
  { tab: 'hr-employees', path: '/hr/employees', aliases: ['/employees'], departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'hr-absences', path: '/hr/absences', aliases: ['/absences'], departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'hr-recruitment', path: '/hr/recruitment', aliases: ['/recruitment'], departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'hr-procurement', path: '/hr/procurement', departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'hr-discounts', path: '/hr/discounts', departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'employees', path: '/hr/employees', departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'absences', path: '/hr/absences', departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'recruitment', path: '/hr/recruitment', departments: ['hr', 'all'], component: HRDashboardView, fallbackTab: 'hr-dashboard' },
  { tab: 'patients', path: '/opd', aliases: ['/patients'], departments: ['opd', 'nurse', 'all'], component: OPDRegistrationView, fallbackTab: 'dashboard' },
  { tab: 'patients-reception', path: '/opd/reception', departments: ['opd', 'all'], component: OPDRegistrationView, fallbackTab: 'dashboard' },
  { tab: 'patients-returning', path: '/opd/returning', departments: ['opd', 'all'], component: OPDRegistrationView, fallbackTab: 'dashboard' },
  { tab: 'patients-admissions', path: '/opd/admissions', departments: ['opd', 'all'], component: OPDRegistrationView, fallbackTab: 'dashboard' },
  { tab: 'nursing', path: '/nursing/triage-hub', aliases: ['/nursing/hub'], departments: ['nurse', 'all'], component: NursingView, fallbackTab: 'admitted-patients' },
  { tab: 'admitted-patients', path: '/nursing/admitted', aliases: ['/nursing', '/admitted-patients'], departments: ['nurse', 'all'], component: NursingView, fallbackTab: 'dashboard' },
  { tab: 'detained-patients', path: '/nursing/detained', aliases: ['/detained-patients'], departments: ['nurse', 'all'], component: NursingView, fallbackTab: 'admitted-patients' },
  { tab: 'nurse-dispensing', path: '/nursing/dispensing', aliases: ['/nurse-dispensing'], departments: ['nurse', 'all'], component: NursingView, fallbackTab: 'admitted-patients' },
  { tab: 'injection-records', path: '/nursing/injections', aliases: ['/injection-records'], departments: ['nurse', 'all'], component: NursingView, fallbackTab: 'admitted-patients' },
  { tab: 'triage', path: '/nursing/triage', aliases: ['/triage'], departments: ['nurse', 'all'], component: OPDRegistrationView, fallbackTab: 'admitted-patients' },
  { tab: 'cashier', path: '/cashier', aliases: ['/cashier/billing'], departments: ['cashier', 'finance', 'all'], component: CashierView, fallbackTab: 'dashboard' },
  { tab: 'consult', path: '/doctors', aliases: ['/consult'], departments: ['doctor', 'all'], component: DoctorView, fallbackTab: 'dashboard' },
  { tab: 'doctors', path: '/doctors', departments: ['doctor', 'finance', 'all'], component: DoctorView, fallbackTab: 'dashboard' },
  { tab: 'standard-cards', path: '/doctors/standard-cards', aliases: ['/standard-cards'], departments: ['opd', 'doctor', 'all'], component: DoctorView, fallbackTab: 'dashboard' },
  { tab: 'specialized-care', path: '/doctors/specialized-care', aliases: ['/specialized-care'], departments: ['opd', 'doctor', 'all'], component: DoctorView, fallbackTab: 'dashboard' },
  { tab: 'doctor-admitted', path: '/doctors/admitted', departments: ['doctor', 'all'], component: DoctorView, fallbackTab: 'consult' },
  { tab: 'lab', path: '/lab', departments: ['doctor', 'laboratory', 'all'], component: LaboratoryView, fallbackTab: 'dashboard' },
  { tab: 'lab-walkin', path: '/lab/walkin', departments: ['laboratory', 'all'], component: LaboratoryView, fallbackTab: 'lab' },
  { tab: 'lab-technicians', path: '/lab/technicians', aliases: ['/lab-technicians'], departments: ['finance', 'laboratory', 'all'], component: LaboratoryView, fallbackTab: 'lab' },
  { tab: 'pharmacy', path: '/pharmacy', aliases: ['/pharmacists', '/pharmacy/dispensing', '/dispensing', '/pharmacy/admitted', '/admitted'], departments: ['doctor', 'pharmacy', 'all'], component: PharmacyView, fallbackTab: 'dashboard' },
  { tab: 'pharmacists', path: '/pharmacy', departments: ['finance', 'pharmacy', 'all'], component: PharmacyView, fallbackTab: 'dashboard' },
  { tab: 'procurement', path: '/procurement', aliases: ['/pharmacy/procurement'], departments: ['pharmacy', 'finance', 'hr', 'all'], component: PharmacyView, fallbackTab: 'dashboard' },
  { tab: 'outstanding', path: '/outstanding', aliases: ['/cashier/outstanding'], departments: ['finance', 'cashier', 'all'], component: CashierView, fallbackTab: 'cashier' },
  { tab: 'discounts', path: '/discounts', aliases: ['/cashier/discounts'], departments: ['finance', 'cashier', 'hr', 'all'], component: CashierView, fallbackTab: 'cashier' },
  { tab: 'eye-clinic', path: '/eyeclinic', aliases: ['/eye-clinic'], departments: ['eye', 'all'], component: EyeClinicView, fallbackTab: 'dashboard' },
  { tab: 'registered-patients', path: '/eyeclinic/register', aliases: ['/registered-patients'], departments: ['eye', 'all'], component: EyeClinicView, fallbackTab: 'eye-clinic' },
  { tab: 'consultation', path: '/eyeclinic/consultation', aliases: ['/consultation'], departments: ['eye', 'all'], component: EyeClinicView, fallbackTab: 'eye-clinic' },
  { tab: 'all-records', path: '/eyeclinic/records', aliases: ['/all-records'], departments: ['eye', 'all'], component: EyeClinicView, fallbackTab: 'eye-clinic' },
  { tab: 'records', path: '/records', departments: ['opd', 'doctor', 'all'], component: OPDRegistrationView, fallbackTab: 'dashboard' },
  { tab: 'users', path: '/users', aliases: ['/it/users', '/it'], departments: ['it', 'all'], component: UserManagementView, fallbackTab: 'dashboard' },
  { tab: 'maintenance', path: '/maintenance', aliases: ['/it/maintenance'], departments: ['it', 'all'], component: UserManagementView, fallbackTab: 'users' },
  { tab: 'activity-log', path: '/activity-log', aliases: ['/it/activity-log'], departments: ['it', 'all'], component: UserManagementView, fallbackTab: 'users' },
  { tab: 'patient-directory-import', path: '/it/patient-import', departments: ['it', 'all'], component: PatientDirectoryImportView, fallbackTab: 'users' },
  { tab: 'it', path: '/it', departments: ['it', 'all'], component: UserManagementView, fallbackTab: 'users' },
  { tab: 'settings', path: '/settings', departments: ['it', 'all'], component: OPDRegistrationView, fallbackTab: 'dashboard' },
];

const entriesByTab = new Map<string, RouteEntry>();
const entriesByPath = new Map<string, RouteEntry>();
const aliasToTab = new Map<string, string>();

for (const entry of ROUTE_ENTRIES) {
  if (!entriesByTab.has(entry.tab)) {
    entriesByTab.set(entry.tab, entry);
  }
  if (!entriesByPath.has(entry.path)) {
    entriesByPath.set(entry.path, entry);
  }
  for (const alias of entry.aliases ?? []) {
    if (!entriesByPath.has(alias) && !aliasToTab.has(alias)) {
      aliasToTab.set(alias, entry.tab);
    }
  }
}

export function normalizePathname(raw: string): string {
  const withoutQuery = raw.split('?')[0].split('#')[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery || '/';
}

export function findRouteByTab(tab: string): RouteEntry | undefined {
  return entriesByTab.get(tab);
}

export function findRouteByPath(pathname: string): RouteMatch | undefined {
  const normalized = normalizePathname(pathname);
  const direct = entriesByPath.get(normalized);
  if (direct) {
    return { entry: direct, tab: direct.tab, redirectedFromAlias: false };
  }
  const aliasedTab = aliasToTab.get(normalized);
  if (aliasedTab) {
    const entry = entriesByTab.get(aliasedTab);
    if (entry) {
      return { entry, tab: entry.tab, redirectedFromAlias: true };
    }
  }
  return undefined;
}

export function listRouteEntries(): RouteEntry[] {
  return [...ROUTE_ENTRIES];
}
