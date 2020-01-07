// DEPENDENCIES
import React, {FC} from 'react';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorSelectorLinks from './vendor-selector-links';
import VendorProfile from '../vendor-profile/vendor-profile'

const VendorSelectorDesktop:FC = () => {
  // Create ref to figure out set size of the menu to allow scrolling
  // Set size of menu will be screen height - (div above menu links)
  // Callback ref runs after component is mounted
  const ref = useCallbackRef(null, () => {});

  return (
    <div className="menu__wrapper">
        {/* Need ref of div to get height reference for menu */}
        <div ref={ref}>
          <h1 className="font__navbar">ROLLIO</h1>
          <div className="menu__type">
            <h2 className="font__menu_link">Food Trucks</h2>
          </div>
        </div>
        {/* If selected Vendor, render Vendor Profile */}
        {/* <VendorProfile /> */}
        <VendorSelectorLinks ref={ref} />
    </div>
  );
}

export default VendorSelectorDesktop;
