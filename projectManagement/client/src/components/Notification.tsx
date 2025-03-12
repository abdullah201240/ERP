import React, { useState } from 'react';

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);

  const notificationHandler = (state: boolean | ((prevState: boolean) => boolean)) => {
    setIsOpen(state);
  };

  return (
    <div>
      <div className="py-8">
        <button 
          onClick={() => notificationHandler(true)} 
          className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:outline-none py-2 px-10 rounded bg-indigo-600 hover:bg-indigo-700 text-white">
          Open Modal
        </button>
      </div>

      {isOpen && (
        <div className="w-full h-full bg-gray-800 bg-opacity-90 top-0 overflow-y-auto overflow-x-hidden fixed sticky-0">
          <div className="w-full absolute z-10 right-0 h-full overflow-x-hidden transform translate-x-0 transition ease-in-out duration-700">
            <div className="2xl:w-4/12 bg-gray-50 h-screen overflow-y-auto p-8 absolute right-0">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold leading-6 text-gray-800">Notifications</p>
                <button 
                  role="button" 
                  aria-label="close modal" 
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md cursor-pointer" 
                  onClick={() => notificationHandler(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Notification Items */}
              <div className="w-full p-3 mt-8 bg-white rounded flex">
                <div className="w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00059 3.01934C9.56659 1.61334 11.9866 1.66 13.4953 3.17134C15.0033 4.68334 15.0553 7.09133 13.6526 8.662L7.99926 14.3233L2.34726 8.662C0.944589 7.09133 0.997256 4.67934 2.50459 3.17134C4.01459 1.662 6.42992 1.61134 8.00059 3.01934Z" fill="#EF4444" />
                  </svg>
                </div>
                <div className="pl-3">
                  <p className="text-sm leading-none">
                    <span className="text-indigo-700">James Doe</span> favourited an <span className="text-indigo-700">item</span>
                  </p>
                  <p className="text-xs leading-3 pt-1 text-gray-500">2 hours ago</p>
                </div>
              </div>
              {/* Add More Notifications Here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
