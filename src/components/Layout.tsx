import type { ReactNode } from "react";
import { Layout as AntLayout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header, Content, Footer } = AntLayout;

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header className="!bg-[#001529] px-4">
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            { label: <Link to="/">Inicio</Link>, key: "/" },
            { label: <Link to="/upload">Subir Proyecto</Link>, key: "/upload" },
            { label: <Link to="/results">Resultados</Link>, key: "/results" },
          ]}
        />
      </Header>
      <Content className="p-6 bg-gray-50">
        {children}
      </Content>
      <Footer className="bg-red-500 text-center py-10 ">
        © 2025 Upgrade Agent
      </Footer>
    </AntLayout>
  );
};
