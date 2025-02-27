import { Icon } from '@iconify/react';

import { SideNavItem } from './types';





export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Add Sister Concern',
    path: '/addSisterConcern',
    icon: <Icon icon="gridicons:add" width="19" height="19" />,
  },
  

  // {
  //   title: 'Company',
  //   path: '/',
  //   icon: <Icon icon="mdi:company" width="19" height="19" />,
  //   submenu: true,
  //   subMenuItems: [
      
  //     { title: 'Add Company', path: '/product-category' },

  //     { title: 'Unit List', path: '/product-unit' },
  //     { title: 'All Products', path: '/product' },
  //     { title: 'Supervision', path: '/create-supervision' },
  //   ],
  // },





  {
    title: 'Design & Development',
    path: '/settings',
    icon: <Icon icon="mdi:design" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      { title: 'Create Design Plan', path: '/create-design-plan' },
      { title: 'Design Work & Update', path: '/design-work-update' },
      { title: 'Service Package', path: '/service-package' },
      { title: 'BOQ', path: '/design-boq' },
      { title: 'Generate BOQ & Quotation', path: '/generate-boq-quotation' },
      { title: 'Generate Invoice', path: '/generate-invoice' },
      { title: 'Upload Working Drawing', path: '/upload-working-drawing' },
      { title: 'Review Working Drawing BOQ', path: '/review-working-drawing-boq' },
      { title: 'Work Category', path: '/work-category' },
     

    ],
  },

  
  
  {
    title: 'Production',
    path: '/help',
    icon: <Icon icon="lucide:trending-up" width="19" height="19" />,
  },
  {
    title: 'Manage Client Data',
    path: '/help',
    icon: <Icon icon="lucide:user" width="19" height="19" />,
  },
  
  

];
