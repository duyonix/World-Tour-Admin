import React from "react";
import IconFont from "@/components/IconFont";
import Register from "@/pages/auth/register";
import Login from "@/pages/auth/login";
import ServiceCategories from "@/pages/service/category";
import ServiceCategoryDetail from "@/pages/service/category/detail";
import ServiceRegions from "@/pages/service/region";
import ServiceRegionDetail from "@/pages/service/region/detail";
import ServiceCostumes from "@/pages/service/costume";
import ServiceCostumeDetail from "@/pages/service/costume/detail";
import UsersManagement from "@/pages/user/user";
import UserDetailManagement from "@/pages/user/user/detail";
import UserProfile from "@/pages/user/info";

type Route = {
  path: string;
  component: any;
  role?: string;
};

type SubRoute = {
  title: string;
  path: string;
  route?: Route[];
  subMenu?: SubRoute[];
  role?: string;
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
        title: "Regions",
        path: "/service/regions",
        route: [
          {
            path: "/service/regions/:id",
            component: () => <ServiceRegionDetail />
          },
          {
            path: "/service/regions",
            component: () => <ServiceRegions />
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
    redirect: "/user/profile",
    subMenu: [
      {
        title: "Users",
        path: "/user/users",
        role: "ADMIN",
        route: [
          {
            path: "/user/users/:id",
            component: () => <UserDetailManagement />,
            role: "ADMIN"
          },
          {
            path: "/user/users",
            component: () => <UsersManagement />,
            role: "ADMIN"
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
