'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDENAV_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Logo from '@/app/assets/img/Logo.webp';

const SideNav = () => {
  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed  hidden md:flex">
      <div className="flex flex-col space-y-6 w-full mt-4">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6  h-12 w-full"
        >
            <Image 
            src={Logo}
            alt='logo'
            width={50}
            height={50}
            
            
            />
          
        </Link>

        <div className="flex flex-col space-y-2 md:px-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-[#bababa] scrollbar-track-[#f0f0f0]">
        {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-start p-2 rounded-lg hover-bg-[#2A5158] w-full justify-between hover:bg-[#2A5158] hover:text-white ${
              pathname.includes(item.path) ? 'bg-white text-black' : ''
            }`}
          >
            <div className="flex flex-row space-x-2 items-start text-left">
                 <span className='pt-0.5'>{item.icon}</span> 
              <span className="font-semibold text-xm  flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <Icon icon="lucide:chevron-down" width="18" height="18" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4 text-xm">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? 'font-bold' : ''
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-2 items-start p-2 rounded-lg hover:bg-[#2A5158] hover:text-white ${
            item.path === pathname ? 'bg-[#2A5158] text-white' : ''
          }`}
        >
                 <span className='pt-0.5'>{item.icon}</span> 
                 <span className="font-semibold text-xm flex">{item.title}</span>
        </Link>
      )}






    </div>
  );
};