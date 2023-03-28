import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RouteWithLayout from "@/layouts/RouteWithLayout";
import BaseLayout from "@/layouts/BaseLayout";
import { publicRoutes, privateRoutes } from "@/routes/config";
import NotFound from "@/components/NotFound";
import UnAuthorized from "@/components/UnAuthorized";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import { authActions } from "@/pages/auth/auth.slice";

const MyRoutes = () => {
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth.isLogin) {
      const userId = localStorage.getItem("user_id");
      dispatch(authActions.getInfo(userId));
    }
  }, [auth.isLogin, dispatch]);

  const getDefaultRoute = (sidebar: any) => {
    if (sidebar.subMenu && sidebar.subMenu.length > 0) {
      return getDefaultRoute(sidebar?.subMenu[0]);
    }
    return sidebar?.path;
  };

  const mapPrivateRoute = (menu: any, prevName: any) =>
    menu.map((item: any) => {
      if (item.subMenu && item.subMenu.length > 0) {
        return mapPrivateRoute(item.subMenu, prevName.concat([item.title]));
      }
      if (item.route && item.route.length > 0) {
        return item.route.map((route: any) => {
          return (
            <RouteWithLayout
              key={"rootMenu"}
              path={route.path}
              component={route.component}
              layout={BaseLayout}
              routeConfig={{
                breadcrumb: prevName.concat([item.title]),
                path: item.path,
                title: prevName.join("/") + "/" + item.title
              }}
            />
          );
        });
      }
      return null;
    });

  return (
    <div>
      <Switch>
        {auth.isLogin &&
          privateRoutes.map(({ redirect, path: pathRoot }, index) => (
            <Route key={index} exact path={pathRoot}>
              <Redirect to={`${redirect}`} />
            </Route>
          ))}
        {auth.isLogin
          ? mapPrivateRoute([...privateRoutes], [])
          : publicRoutes.map(({ path, component }, index) => (
              <Route key={index} path={path} component={component} />
            ))}

        {auth.isLogin && (
          <Route exact path="/403">
            <UnAuthorized />
          </Route>
        )}

        {auth.isLogin ? (
          <>
            <Route exact path="/">
              <Redirect
                to={
                  privateRoutes.length ? getDefaultRoute(privateRoutes[0]) : "/"
                }
              />
            </Route>
            <Route exact path="/login">
              <Redirect to="/" />
            </Route>
            {privateRoutes.length > 0 && (
              <Route path="*">
                <NotFound />
              </Route>
            )}
          </>
        ) : (
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        )}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
};

export default MyRoutes;
