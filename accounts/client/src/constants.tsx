import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Journal Entry',
    path: '/journal-entry',
    icon: <Icon icon="mdi:notebook-edit-outline" width="19" height="19" />,
  },
  
  {
    title: 'Financial Reports',
    path: '/',
    icon: <Icon icon="mdi:finance" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      { title: 'Cash Book', path: '/cash-book', icon: <Icon icon="mdi:cash-multiple" width="19" height="19" /> },
      { title: 'Income Statement', path: '/income-statement', icon: <Icon icon="mdi:chart-line" width="19" height="19" /> },
      { title: 'Balance Sheet', path: '/balance-sheet', icon: <Icon icon="mdi:scale-balance" width="19" height="19" /> },
      { title: 'Cash Flow Statement', path: '/cash-flow-statement', icon: <Icon icon="mdi:bank-transfer" width="19" height="19" /> },
      { title: 'Owner’s Equity Statement', path: '/owner-equity-statement', icon: <Icon icon="mdi:account-cash" width="19" height="19" /> },
    ], 
  },

  {
    title: 'Asset Management',
    path: '/',
    icon: <Icon icon="mdi:domain" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      { title: 'Asset List', path: '/asset-list', icon: <Icon icon="mdi:clipboard-list" width="19" height="19" /> },
      { title: 'New Asset Entry', path: '/new-asset-entry', icon: <Icon icon="mdi:plus-box-outline" width="19" height="19" /> },
      { title: 'Asset Write Off', path: '/asset-write-Off', icon: <Icon icon="mdi:delete-forever" width="19" height="19" /> },
    ], 
  },

  {
    title: 'Bank Management',
    path: '/bank-management',
    icon: <Icon icon="mdi:bank" width="19" height="19" />,
  },

  {
    title: 'Receivable Management',
    path: '/receivable-management',
    icon: <Icon icon="mdi:cash-100" width="19" height="19" />,
  },

  {
    title: 'Payable Management',
    path: '/payable-management',
    icon: <Icon icon="mdi:credit-card-outline" width="19" height="19" />,
  },

  {
    title: 'Manage Client Data',
    path: '/manage-client-data',
    icon: <Icon icon="mdi:account-group" width="19" height="19" />,
  },
];
