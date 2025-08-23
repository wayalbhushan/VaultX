import React from 'react';

const Sidebar = () => (
  <aside className="w-64 bg-gray-100 p-6 hidden md:block">
    <h2 className="text-2xl font-bold mb-6">Menu</h2>
    <ul className="space-y-4">
      <li><a href="#" className="hover:text-primary">Dashboard</a></li>
      <li><a href="#" className="hover:text-primary">Vaults</a></li>
      <li><a href="#" className="hover:text-primary">Settings</a></li>
    </ul>
  </aside>
);

export default Sidebar;
