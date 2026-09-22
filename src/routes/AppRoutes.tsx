import { useState } from "react";
import { Navigate, Route, Routes, Link, useLocation } from "react-router-dom";

import DashboardPage from "../pages/Dashboard/DashboardPage";

import UsersPage from "../pages/Users/UsersPage";
import UserDetailsPage from "../pages/Users/UserDetailsPage";
import UserComparisonPage from "../pages/Users/UserComparisonPage";
import InfiniteUsersPage from "../pages/Users/InfiniteUsersPage";

import TenantsPage from "../pages/Tenants/TenantsPage";
import TenantDetailsPage from "../pages/Tenants/TenantDetailsPage";

function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <header className="mobile-header">
        <button
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="mobile-logo">
          Super Admin
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-top">

          <div className="sidebar-logo">
            <div className="logo-box">SA</div>

            <div>
              <strong>Super Admin</strong>
              <span>Management System</span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>

        </div>

        <nav className="sidebar-nav">

          <SidebarLink
            to="/dashboard"
            label="Dashboard"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarLink
            to="/users"
            label="Users"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarLink
            to="/tenants"
            label="Tenants"
            onClick={() => setSidebarOpen(false)}
          />

        </nav>

        <div className="sidebar-footer">
          <div className="admin-avatar">
            SA
          </div>

          <div className="admin-info">
            <strong>Super Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

    
      <div className="main-content">

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/users"
            element={<UsersPage />}
          />

          <Route
            path="/users/compare"
            element={<UserComparisonPage />}
          />

          <Route
            path="/users/infinite"
            element={<InfiniteUsersPage />}
          />

          <Route
            path="/users/:userId"
            element={<UserDetailsPage />}
          />

          <Route
            path="/tenants"
            element={<TenantsPage />}
          />

          <Route
            path="/tenants/:tenantId"
            element={<TenantDetailsPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>

      </div>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  label: string;
  onClick: () => void;
}

function SidebarLink({
  to,
  label,
  onClick,
}: SidebarLinkProps) {
  const location = useLocation();

  const active =
    to === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`sidebar-link ${
        active ? "sidebar-link-active" : ""
      }`}
    >
      <span className="sidebar-link-dot" />
      <span>{label}</span>
    </Link>
  );
}

export default AppRoutes;