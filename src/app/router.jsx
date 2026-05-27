import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import PublicLayout from "../layouts/public_layout";
import AuthLayout from "../layouts/auth_layout";

import Landingpage from "../features/landing/pages/Landingpage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VaridyEmailPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import ForgotPasswordPage from "../features/auth/pages/forgetPasswordPage";

import { platformRoutes } from "../features/platform/router";
import { tenantRoutes } from "../features/tanent/router";

import AuthInitializer from "../features/auth/AuthGuard/AuthInitializer";
import AuthGuard from "../features/auth/AuthGuard/AuthGuard";
import GuestGuard from "../features/auth/AuthGuard/GuestGuard";
import RoleGuard from "../features/auth/AuthGuard/roleGuard";

import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

import { RootRedirect } from "./rootReDirector";
import TenantGuard from "../features/tanent/tanantGuard";
import AcceptInvitePage from "../features/auth/pages/acceptInvite";
import { settingsRoutes } from "../features/settings/routes";
import CSRFInitializer from "../features/auth/AuthGuard/CSRFInitializer";
import PlatformWSWrapper from "../features/platform/WSPlatformWrapper";
import TenantWSWrapper from "../features/tanent/WSTanantWrapper";
import PlatformLayout from "../layouts/platform_layout";
import TenantLayout from "../layouts/Tanent_layout";
import GoogleCalendarCallback from "../features/settings/pages.jsx/GoogleCalendarCallback";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC PAGES ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landingpage />} />
        </Route>

        {/* 🔥 GLOBAL CSRF LAYER */}
        <Route element={<CSRFInitializer />}>

        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/invite" element={<AcceptInvitePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        <Route element={<AuthInitializer />}>
          <Route element={<AuthGuard />}>

            <Route path="/dashboard" element={<RootRedirect />} />

            <Route path="/settings">{settingsRoutes}</Route>
            
            <Route path="/calendar/callback" element={<GoogleCalendarCallback />} />

            {/* PLATFORM */}
            <Route
            path="/platform"
            element={
              <RoleGuard role="platform">
                <PlatformWSWrapper>
                  <PlatformLayout />
                </PlatformWSWrapper>
              </RoleGuard>
            }
          >
            {platformRoutes}
          </Route>

            {/* TENANT */}
            <Route
              path="/app"
              element={
                <RoleGuard role="tenant">
                  <TenantGuard>
                    <TenantWSWrapper>
                      <TenantLayout />
                    </TenantWSWrapper>
                  </TenantGuard>
                </RoleGuard>
              }
            >
              {tenantRoutes}
            </Route>

          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

      </Route>

      </Routes>
    </BrowserRouter>
  );
}