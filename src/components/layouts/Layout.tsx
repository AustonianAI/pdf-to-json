import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="py-10">
      <main>
        <div className="mx-auto sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
