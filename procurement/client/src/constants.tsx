import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Purchase Management',
    path: '/',
    icon: <Icon icon="arcticons:purchased-apps" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      
      { title: 'Create a Purchase Order', path: '/create-purchase-order' },

      { title: 'Purchase Req For Review', path: '/product-unit' },
      { title: 'Send Material', path: '/send-material' },
    ],
  },
  {
    title: 'Products',
    path: '/',
    icon: <Icon icon="fa-solid:box-open" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      
      { title: 'Category', path: '/product-category' },

      { title: 'Unit List', path: '/product-unit' },
      { title: 'All Products', path: '/product' },
      { title: 'Supervision', path: '/create-supervision' },
    ],
  },
  {
    title: 'Approved Material List',
    path: '/approved-material-list',
    icon: <Icon icon="lucide:file-check" width="19" height="19" />,
  },
  
  
  
  
  
  

];
