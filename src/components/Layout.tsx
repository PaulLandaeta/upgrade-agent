import type { ReactNode } from "react";
import { Layout as AntLayout, Menu } from "antd";
import {
  DashboardOutlined,
  ExperimentOutlined,
  AlertOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content, Footer } = AntLayout;

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const menuItems = [
    {
      label: <Link to="/">Dashboard</Link>,
      key: "/",
      icon: <DashboardOutlined />,
    },
    {
      label: <Link to="/projects">Upgrade Project</Link>,
      key: "/projects",
      icon: <ExperimentOutlined />,
    },
    {
      label: <Link to="/alerts">Migration Alerts</Link>,
      key: "/alerts",
      icon: <AlertOutlined />,
    },
    {
      label: <Link to="/ng2react">Angular ➜ React</Link>,
      key: "/ng2react",
      icon: <SwapOutlined />,
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="!bg-[#111827]"
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div className="h-16 flex items-center justify-center text-white text-xl font-bold border-b border-gray-700">
          Upgrade Agent
        </div>
        <div className="flex-1 overflow-y-auto">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="!bg-[#111827]"
          />
        </div>
        <div className="p-4 border-t border-gray-700 flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-white text-sm leading-tight overflow-hidden">
            <div className="font-medium truncate">Melinda Jesell</div>
            <div className="text-gray-400 text-xs truncate">
              melinda@upgrade.ai
            </div>
          </div>
        </div>
      </Sider>
      <AntLayout>
        <Header className="!bg-white px-6 shadow-sm flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-700">
            Angular Migration Assistant
          </h1>
        </Header>
        <Content className="bg-[#F9FAFB] p-6">{children}</Content>
        <Footer className="text-center text-gray-400 bg-white py-6">
          © 2025 Upgrade Agent
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};
