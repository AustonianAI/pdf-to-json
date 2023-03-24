import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="py-10">
      <main>
        <div className="mx-auto px-3 lg:px-9">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
