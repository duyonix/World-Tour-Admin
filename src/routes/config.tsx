import React from "react";
import IconFont from "@/components/IconFont";
import Register from "@/pages/auth/register";
import Login from "@/pages/auth/login";
import ServiceCategories from "@/pages/service/category";
import ServiceCategoryDetail from "@/pages/service/category/detail";
import ServiceScopes from "@/pages/service/scope";
import ServiceScopeDetail from "@/pages/service/scope/detail";
import ServiceCostumes from "@/pages/service/costume";
import ServiceCostumeDetail from "@/pages/service/costume/detail";
import UsersManagement from "@/pages/user/user";
import UserDetailManagement from "@/pages/user/user/detail";
import UserProfile from "@/pages/user/info";

type Route = {
  path: string;
  component: any;
};

type SubRoute = {
  title: string;
  path: string;
  route?: Route[];
  subMenu?: SubRoute[];
};

type MultiRoute = {
  path: string;
  title: string;
  role?: string;
  icon: any;
  redirect?: string;
  subMenu: SubRoute[];
};

export const publicRoutes: Route[] = [
  {
    path: "/register",
    component: () => <Register />
  },
  {
    path: "/login",
    component: () => <Login />
  }
];

export const privateRoutes: MultiRoute[] = [
  {
    path: "/service",
    title: "Service",
    icon: <IconFont type="workplace" />,
    redirect: "/service/categories",
    subMenu: [
      {
        title: "Categories",
        path: "/service/categories",
        route: [
          {
            path: "/service/categories/:id",
            component: () => <ServiceCategoryDetail />
          },
          {
            path: "/service/categories",
            component: () => <ServiceCategories />
          }
        ]
      },
      {
        title: "Scopes",
        path: "/service/scopes",
        route: [
          {
            path: "/service/scopes/:id",
            component: () => <ServiceScopeDetail />
          },
          {
            path: "/service/scopes",
            component: () => <ServiceScopes />
          }
        ]
      },
      {
        title: "Costumes",
        path: "/service/costumes",
        route: [
          {
            path: "/service/costumes/:id",
            component: () => <ServiceCostumeDetail />
          },
          {
            path: "/service/costumes",
            component: () => <ServiceCostumes />
          }
        ]
      }
    ]
  },
  {
    path: "/user",
    title: "User",
    icon: <IconFont type="staff-card" />,
    redirect: "/user/users",
    subMenu: [
      {
        title: "Users",
        path: "/user/users",
        route: [
          {
            path: "/user/users/:id",
            component: () => <UserDetailManagement />
          },
          {
            path: "/user/users",
            component: () => <UsersManagement />
          }
        ]
      },
      {
        title: "Profile",
        path: "/user/profile",
        route: [
          {
            path: "/user/profile",
            component: () => <UserProfile />
          }
        ]
      }
    ]
  }
];
