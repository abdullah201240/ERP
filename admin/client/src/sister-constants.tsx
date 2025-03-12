import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS_SISTER: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/sisterConcern/dashboard',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Add a Employee',
    path: '/sisterConcern/addEmployee',
    icon: <Icon icon="gridicons:add" width="19" height="19" />,
  },

  
  {
    title: 'Purchase Req For Review',
    path: '/sisterConcern/purchase-req-for-review',
    icon: <Icon icon="mdi:clipboard-list" width="19" height="19" />, // Updated icon
  },

  {
    title: 'Access',
    path: '/sisterConcern/access',
    icon: <Icon icon="mdi:lock-open" width="19" height="19" />, // Updated icon
  },


  {
    title: 'Manage Client Data',
    path: '/sisterConcern/manage-client-data',
    icon: <Icon icon="lucide:user" width="19" height="19" />,
  },
  
  

];