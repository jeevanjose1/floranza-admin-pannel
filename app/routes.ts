import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("components/layouts/privet-layout.tsx", [
    index("routes/home.tsx"),
    route('/products',"routes/inventory/products.tsx"),
    route('/products/new',"routes/inventory/add-edit-product.tsx"),

  ] satisfies RouteConfig),
];
