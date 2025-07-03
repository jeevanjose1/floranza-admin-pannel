
import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { routes } from "./shared/routes/routes";



const getAllowedRoutes = () => {
  const privateLayout = routes[0];
  const routesToCheck = privateLayout?.route || [];
  const processRoutes = (routeList: any) => {
    return routeList
      .map((routeItem: any) => {
        if (routeItem.layout && routeItem.route) {
          const allowedNestedRoutes = processRoutes(routeItem.route);

          return allowedNestedRoutes.length > 0
            ? layout(routeItem.layout, allowedNestedRoutes)
            : null;
        }
      
        if (routeItem.path === '/' || routeItem.isIndex) {
          return index(routeItem.component);
        }

        return routeItem.id
          ? route(routeItem.path, routeItem.component, { id: routeItem.id })
          : route(routeItem.path, routeItem.component);
      })
      .filter(Boolean);
  };

  return processRoutes(routesToCheck);
};

export default [
  layout("components/layouts/public-layout.tsx", [
    route("/login", "routes/auth/login.tsx"),
  ]),
  layout("components/layouts/privet-layout.tsx", getAllowedRoutes() as any),

] satisfies RouteConfig;