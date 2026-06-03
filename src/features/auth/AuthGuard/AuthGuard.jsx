import { useSelector } from "react-redux";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "../authSlice";

import NotificationInitializer
  from "../../notifications/NotificationInitializer";

export default function AuthGuard() {

  const isAuth =
    useSelector(
      selectIsAuthenticated
    );

  const isLoading =
    useSelector(
      selectAuthLoading
    );

  if (isLoading) {

    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!isAuth) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (

    <>

      {/* GLOBAL PUSH INITIALIZER */}
      <NotificationInitializer />

      {/* APP ROUTES */}
      <Outlet />

    </>

  );
}