import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />,
  },

  {
    title: 'Add a Project',
    path: '/addProject',
    icon: <Icon icon="gridicons:add" width="19" height="19" />,
  },
  {
    title: 'Site Visit Plan',
    path: '/',
    icon: <Icon icon="lucide:calendar" width="19" height="19" />,
    submenu: true,
    subMenuItems: [
      { title: 'Pre Project', path: '/create-pre-project-plan' },
      { title: 'Project', path: '/create-project-plan' },
      { title: 'Supervision', path: '/create-supervision' },
    ],
  },
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
      { title: 'Work Category', path: '/work-category' },
      { title: 'Upload Working Drawing', path: '/upload-working-drawing' },
      { title: 'Review Working Drawing BOQ', path: '/review-working-drawing-boq' },
     

    ],
  },

  
  
  {
    title: 'Production',
    path: '/help',
    icon: <Icon icon="lucide:trending-up" width="19" height="19" />,
  },
  {
    title: 'Manage Client Data',
    path: '/manage-client-data',
    icon: <Icon icon="lucide:user" width="19" height="19" />,
  },
  
  

];
