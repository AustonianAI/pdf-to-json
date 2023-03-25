import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="py-8">
      <main>
        <div className="px-3 mx-auto lg:px-9">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
