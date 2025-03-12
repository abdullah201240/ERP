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
    const token = localStorage.getItem('accessTokenpq');
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

  const purchaseManagementItems: SideNavItem[] = [
   
    ...(accessData.some(access => access.permission_id === 36)
      ? [{ title: 'Purchase Req For Review', path: '/purchase-req-for-review' }]
      : []),
    ...(accessData.some(access => access.permission_id === 37)
      ? [{ title: 'Send Material', path: '/send-material' }]
      : []),
  ];

  const productItems: SideNavItem[] = [
    ...(accessData.some(access => access.permission_id === 38)
      ? [{ title: 'Category', path: '/product-category' }]
      : []),
    ...(accessData.some(access => access.permission_id === 39)
      ? [{ title: 'Unit List', path: '/product-unit' }]
      : []),
    ...(accessData.some(access => access.permission_id === 40)
      ? [{ title: 'All Products', path: '/product' }]
      : []),
   
    
  ];

  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <Icon icon="material-symbols:dashboard-rounded" width="19" height="19" />, 
    },
    ...(purchaseManagementItems.length > 0 ? [{
      title: 'Purchase Management',
      path: '',
      icon: <Icon icon="arcticons:purchased-apps" width="19" height="19" />,
      submenu: true,
      subMenuItems: purchaseManagementItems,
    }] : []),
    ...(productItems.length > 0 ? [{
      title: 'Products',
      path: '/',
      icon: <Icon icon="fa-solid:box-open" width="19" height="19" />,
      submenu: true,
      subMenuItems: productItems,
    }] : []),
    ...(accessData.some(access => access.permission_id === 41) ? [{
      title: 'Approved Material List',
      path: '/approved-material-list',
      icon: <Icon icon="lucide:file-check" width="19" height="19" />,
    }] : []),
  ];
};