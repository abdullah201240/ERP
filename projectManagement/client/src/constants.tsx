import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Icon icon="lucide:home" width="18" height="18" />,
  },

  {
    title: 'Add a Project',
    path: '/addProject',
    icon: <Icon icon="lucide:home" width="18" height="18" />,
  },
  {
    title: 'Site Visit Plan',
    path: '/',
    icon: <Icon icon="lucide:calendar" width="18" height="18" />,
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
    icon: <Icon icon="mdi:design" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Create Design Plan', path: '/create-design-plan' },
      { title: 'Design Work & Update', path: '/design-work-update' },
      { title: 'Generate BOQ & Quotation', path: '/generate-boq-quotation' },
      { title: 'BOQ & Quotation List', path: '/boq-quotation-list' },
      { title: 'Generate Invoice', path: '/generate-invoice' },
      { title: 'Invoice List', path: '/invoice-list' },
      { title: 'Upload Working Drawing', path: '/upload-working-drawing' },
      { title: 'Review Working Drawing BOQ', path: '/review-working-drawing-boq' },
      { title: 'Work Category', path: '/work-category' },
      { title: 'Service Package', path: '/service-package' },

    ],
  },
  {
    title: 'Production',
    path: '/help',
    icon: <Icon icon="lucide:trending-up" width="18" height="18" />,
  },
  {
    title: 'Manage Client Data',
    path: '/help',
    icon: <Icon icon="lucide:user" width="18" height="18" />,
  },
];
