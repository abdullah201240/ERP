'use client';
import { Icon } from '@iconify/react';
import { SideNavItem } from './types';
import { useAccessControl } from './hooks/useAccessControl';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface EmployeeDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  companyId: string;
  sisterConcernId: string;
  photo: string;
  employeeId: string;
}

const useEmployeeProfile = () => {
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const router = useRouter();

  const fetchEmployeeProfile = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setEmployeeDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching employee profile:', error);
    }
  }, [router]);

  useEffect(() => {
    fetchEmployeeProfile();
  }, [fetchEmployeeProfile]);

  return employeeDetails;
};

export const SIDENAV_ITEMS = (): SideNavItem[] => {
  const { accessData, fetchAccess } = useAccessControl();
  const employeeDetails = useEmployeeProfile();

  useEffect(() => {
    if (employeeDetails) {
      fetchAccess(employeeDetails.id);
    }
  }, [employeeDetails, fetchAccess]);

  const designAndDevelopmentItems: SideNavItem[] = [
    ...(accessData.some(access => access.permission_id === 16)
      ? [{ title: 'Create Design Plan', path: '/create-design-plan' }]
      : []),
    ...(accessData.some(access => access.permission_id === 18)
      ? [{ title: 'Design Work & Update', path: '/design-work-update' }]
      : []),
    ...(accessData.some(access => access.permission_id === 20)
      ? [{ title: 'Service Package', path: '/service-package' }]
      : []),
    ...(accessData.some(access => access.permission_id === 21)
      ? [{ title: 'BOQ', path: '/design-boq' }]
      : []),
    ...(accessData.some(access => access.permission_id === 22)
      ? [{ title: 'Generate BOQ & Quotation', path: '/generate-boq-quotation' }]
      : []),
    ...(accessData.some(access => access.permission_id === 23)
      ? [{ title: 'Generate Invoice', path: '/generate-invoice' }]
      : []),
    ...(accessData.some(access => access.permission_id === 24)
      ? [{ title: 'Work Category', path: '/work-category' }]
      : []),
    ...(accessData.some(access => access.permission_id === 25)
      ? [{ title: 'Upload Working Drawing', path: '/upload-working-drawing' }]
      : []),
    ...(accessData.some(access => access.permission_id === 26)
      ? [{ title: 'Materials', path: '/addMaterials' }]
      : []),
    ...(accessData.some(access => access.permission_id === 27)
      ? [{ title: 'Review Working Drawing BOQ', path: '/review-working-drawing-boq' }]
      : []),
  ];

  const productionItems: SideNavItem[] = [
    ...(accessData.some(access => access.permission_id === 28)
      ? [{ title: 'BOQ Review', path: '/production/boq-review' }]
      : []),
    ...(accessData.some(access => access.permission_id === 29)
      ? [{ title: 'Create Production Work Plan', path: '/production/create-production-work-plan' }]
      : []),
    ...(accessData.some(access => access.permission_id === 30)
      ? [{ title: 'Production Work Update', path: '/production/production-work-update' }]
      : []),
    ...(accessData.some(access => access.permission_id === 31)
      ? [{ title: 'Send Material List', path: '/production/send-material-list' }]
      : []),
    ...(accessData.some(access => access.permission_id === 32)
      ? [{ title: 'Received Materials', path: '/production/received-materials' }]
      : []),
    ...(accessData.some(access => access.permission_id === 33)
      ? [{ title: 'Bill Generation', path: '/production/bill-generation' }]
      : []),
    ...(accessData.some(access => access.permission_id === 34)
      ? [{ title: 'Project Handover', path: '/production/project-handover' }]
      : []),
  ];

  return [
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
    ...(designAndDevelopmentItems.length > 0 ? [{
      title: 'Design & Development',
      path: '/settings',
      icon: <Icon icon="mdi:design" width="19" height="19" />, 
      submenu: true,
      subMenuItems: designAndDevelopmentItems,
    }] : []),
    ...(productionItems.length > 0 ? [{
      title: 'Production',
      path: '/settings',
      icon: <Icon icon="lucide:trending-up" width="19" height="19" />, 
      submenu: true,
      subMenuItems: productionItems,
    }] : []),
    ...(accessData.some(access => access.permission_id === 35) ? [{
      title: 'Manage Client Data',
      path: '/manage-client-data',
      icon: <Icon icon="lucide:user" width="19" height="19" />,
    }] : []),
  ];
};
