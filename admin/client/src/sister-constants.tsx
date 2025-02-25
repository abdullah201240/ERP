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
    title: 'Purchase Req For Review',
    path: '/sisterConcern/purchase-req-for-review',
    icon: <Icon icon="mdi:clipboard-list" width="19" height="19" />, // Updated icon
  },


  {
    title: 'Manage Client Data',
    path: '/help',
    icon: <Icon icon="lucide:user" width="19" height="19" />,
  },
  
  

];