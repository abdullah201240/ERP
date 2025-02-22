import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Journal Entry ',
    path: '/journal-entry',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },
  
  {
    title: 'Financial Reports',
    path: '/',
    icon: <Icon icon="arcticons:purchased-apps" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      
      { title: 'Cash Book', path: '/cash-book' },

      { title: 'Income Statement', path: '/income-statement' },
      { title: 'Balance Sheet', path: '/balance-sheet' },
      { title: 'Cash Flow Statement', path: '/cash-flow-statement' },

      { title: 'Owner’s Equity Statement', path: '/owner-equity-statement' },
    ], 
  },


  {
    title: 'Asset Management ',
    path: '/',
    icon: <Icon icon="arcticons:purchased-apps" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      
      { title: 'Asset List', path: '/asset-list' },

      { title: 'New Asset Entry', path: '/new-asset-entry' },
      { title: 'Asset Write Off', path: '/asset-write-Off' },
    ], 
  },
  {
    title: 'Bank Management',
    path: '/bank-management',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Receivable Management',
    path: '/receivable-management',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Payable Management',
    path: '/payable-management',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },
  {
    title: 'Manage Client Data',
    path: '/manage-client-data',
    icon: <Icon icon="lucide:user" width="19" height="19" />,
  },
  

];
