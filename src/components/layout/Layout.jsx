import { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main 
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "pl-0"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
