import React from 'react';

export type SideNavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode; // Use ReactNode instead of JSX.Element for broader compatibility
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};
