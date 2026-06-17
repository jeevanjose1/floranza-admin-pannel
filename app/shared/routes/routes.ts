import { PERMISSIONS } from "../others/others";


export const routes = [
    {
        layout: "components/layouts/privet-layout.tsx",
        route: [
            {
                path: '/',
                component: "routes/home.tsx",
                permission: PERMISSIONS.HOME_VIEW,
                isIndex: true
            },
            {
                path: '/products',
                component: "routes/inventory/products.tsx",
                permission: PERMISSIONS.PRODUCTS_VIEW
            },
            {
                path: '/products/new',
                component: "routes/inventory/add-edit-product.tsx",
                id: "add_product",
                permission: PERMISSIONS.PRODUCTS_CREATE
            },
            {
                path: '/products/edit/:product_id',
                component: "routes/inventory/add-edit-product.tsx",
                id: "edit_product",
                permission: PERMISSIONS.PRODUCTS_EDIT
            },
            {
                path: '/category',
                component: "routes/inventory/catogery.tsx",
                permission: PERMISSIONS.CATEGORIES_VIEW
            },
            {
                path: '/category/new',
                component: "routes/inventory/add-edit-catogery.tsx",
                id: "add_catogery",
                permission: PERMISSIONS.CATEGORIES_CREATE
            },
            {
                path: '/category/edit/:cat_id',
                component: "routes/inventory/add-edit-catogery.tsx",
                id: "edit_catogery",
                permission: PERMISSIONS.CATEGORIES_EDIT
            },
            {
                path: '/customers',
                component: "routes/others/customers.tsx",
                permission: PERMISSIONS.CATEGORIES_VIEW
            },
            {
                path: '/brands',
                component: "routes/inventory/brand.tsx",
                permission: PERMISSIONS.BRANDS_VIEW
            },
            {
                path: '/brands/new',
                component: "routes/inventory/add-edit-brand.tsx",
                id: "add_brand",
                permission: PERMISSIONS.BRANDS_CREATE
            },
            {
                path: '/brands/edit/:brand_id',
                component: "routes/inventory/add-edit-brand.tsx",
                id: "edit_brand",
                permission: PERMISSIONS.BRANDS_EDIT
            },
            {
                path: '/supplier',
                component: "routes/inventory/supplier.tsx",
                permission: PERMISSIONS.SUPPLIERS_VIEW
            },
            {
                path: '/supplier/new',
                component: "routes/inventory/add-edit-supplier.tsx",
                id: "add_supplier",
                permission: PERMISSIONS.SUPPLIERS_CREATE
            },
            {
                path: '/supplier/edit/:supplier_id',
                component: "routes/inventory/add-edit-supplier.tsx",
                id: "edit_supplier",
                permission: PERMISSIONS.SUPPLIERS_EDIT
            },
            {
                path: '/materials',
                component: "routes/inventory/material.tsx",
                permission: PERMISSIONS.MATERIALS_VIEW
            },
            {
                path: '/materials/new',
                component: "routes/inventory/add-edit-material.tsx",
                id: "add_material",
                permission: PERMISSIONS.MATERIALS_CREATE
            },
            {
                path: '/materials/edit/:material_id',
                component: "routes/inventory/add-edit-material.tsx",
                id: "edit_material",
                permission: PERMISSIONS.MATERIALS_EDIT
            },
            {
                path: '/size-charts',
                component: "routes/inventory/size-chart.tsx",
                permission: PERMISSIONS.SIZE_CHARTS_VIEW
            },
            {
                path: '/size-charts/new',
                component: "routes/inventory/add-edit-size-chart.tsx",
                id: "add_size_chart",
                permission: PERMISSIONS.SIZE_CHARTS_CREATE
            },
            {
                path: '/size-charts/edit/:chart_id',
                component: "routes/inventory/add-edit-size-chart.tsx",
                id: "edit_size_chart",
                permission: PERMISSIONS.SIZE_CHARTS_EDIT
            },
            {
                path: '/media',
                component: "routes/inventory/media.tsx",
                permission: PERMISSIONS.MEDIA_VIEW
            },
            {
                path: '/attributes',
                component: "routes/inventory/attributes.tsx",
                permission: PERMISSIONS.ATTRIBUTES_VIEW
            },
            {
                path: '/coupon',
                component: "routes/inventory/coupon.tsx",
                permission: PERMISSIONS.COUPONS_VIEW
            },
            {
                path: '/slider',
                component: "routes/others/slider.tsx",
                permission: PERMISSIONS.SLIDER_VIEW
            },
            {
                path: '/admin-users',
                component: "routes/others/admin-user.tsx",
                permission: PERMISSIONS.ADMIN_USERS_VIEW
            },
            {
                layout: "components/layouts/order-layout.tsx",
                route: [
                    {
                        path: '/orders/:order_menu',
                        component: "routes/orders/order.tsx",
                        permission: PERMISSIONS.ORDERS_VIEW
                    }
                ]
            },
            {
                path: '/edit-order/:order_id',
                component: "routes/orders/order-edit.tsx",
                permission: PERMISSIONS.ORDERS_EDIT
            },
            {
                path: '/add-order',
                component: "routes/orders/add-order.tsx",
                permission: PERMISSIONS.ORDERS_CREATE
            },
            {
                path: '/stock-management',
                component: "routes/inventory/stock-management.tsx",
                permission: PERMISSIONS.STOCK_VIEW
            },
            {
                path: '/transaction-history',
                component: "routes/others/transaction.tsx",
                permission: PERMISSIONS.TRANSACTIONS_VIEW
            },

            {
                path: '/order-report',
                component: "routes/others/reports.tsx",
                permission: PERMISSIONS.ORDERS_VIEW,
                id:'order-report'
            },
            {
                path: '/top-selling-report',
                component: "routes/others/reports.tsx",
                permission: PERMISSIONS.ORDERS_VIEW,
                id:'top-selling-report'
            },
            {
                path: '/pre-order-report',
                component: "routes/others/reports.tsx",
                permission: PERMISSIONS.ORDERS_VIEW,
                id:'pre-order-report'
            },
            {
                path: '/product-analysis/:product_id',
                component: "routes/inventory/analysis.tsx",
                permission: PERMISSIONS.TRANSACTIONS_VIEW
            },
            {
                path: '/customers/orders/:customer_id',
                component: "routes/others/customer-order-report.tsx",
                permission: PERMISSIONS.ORDERS_VIEW,
                id: 'customer-order-report'
            }
        ]
    }
];



