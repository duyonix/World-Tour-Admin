import React, { memo } from "react";
import { Route } from "react-router-dom";

type Props = {
  layout: any;
  component: any;
  path: any;
  routeConfig: any;
};

const RouteWithLayout = ({
  layout: Layout,
  component: Component,
  routeConfig,
  ...rest
}: Props) => {
  return (
    <Route
      {...rest}
      render={(props: any) => (
        <Layout routeConfig={routeConfig}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default memo(RouteWithLayout);
