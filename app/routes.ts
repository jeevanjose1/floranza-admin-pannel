import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layouts/public-layout.tsx", [
    route("/login", "routes/auth/login.tsx"),
  ]),

  layout("components/layouts/privet-layout.tsx", [
    index("routes/home.tsx"),
    route("/products", "routes/inventory/products.tsx"),
    route("/products/new", "routes/inventory/add-edit-product.tsx", {
      id: "add_product",
    }),
    route(
      "/products/edit/:product_id",
      "routes/inventory/add-edit-product.tsx",
      {
        id: "edit_product",
      }
    ),

    route("/catogery", "routes/inventory/catogery.tsx"),
    route("/catogery/new", "routes/inventory/add-edit-catogery.tsx", {
      id: "add_catogery",
    }),
    route("/catogery/edit/:cat_id", "routes/inventory/add-edit-catogery.tsx", {
      id: "edit_catogery",
    }),

    route("/brands", "routes/inventory/brand.tsx"),
    route("/brands/new", "routes/inventory/add-edit-brand.tsx", {
      id: "add_brand",
    }),
    route("/brands/edit/:brand_id", "routes/inventory/add-edit-brand.tsx", {
      id: "edit_brand",
    }),
    route("/supplier", "routes/inventory/supplier.tsx"),
    route("/supplier/new", "routes/inventory/add-edit-supplier.tsx", {
      id: "add_supplier",
    }),
    route(
      "/supplier/edit/:supplier_id",
      "routes/inventory/add-edit-supplier.tsx",
      {
        id: "edit_supplier",
      }
    ),
    route("/materials", "routes/inventory/material.tsx"),
    route("/materials/new", "routes/inventory/add-edit-material.tsx", {
      id: "add_material",
    }),
    route(
      "/materials/edit/:material_id",
      "routes/inventory/add-edit-material.tsx",
      {
        id: "edit_material",
      }
    ),
    route("/media", "routes/inventory/media.tsx"),
    route("/attributes", "routes/inventory/attributes.tsx"),
    route("/slider", "routes/others/slider.tsx"),
    layout("components/layouts/order-layout.tsx", [
      route("/orders/:order_menu", "routes/orders/order.tsx"),
    ]),
    route("/edit-order/:order_id", "routes/orders/order-edit.tsx"),
    route("/add-order", "routes/orders/add-order.tsx"),

  ] satisfies RouteConfig),
];
