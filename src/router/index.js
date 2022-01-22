import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/Products.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue')
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('../views/Coupon.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'UserBoard',
    component: () => import('../views/user/UserBoard.vue'),
    children: [
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../views/user/Cart.vue')
      },
      {
        path: 'products',
        name: 'UserProducts',
        component: () => import('../views/user/ProductList.vue')
      },
      {
        path: 'product/:productID',
        name: 'UserProduct',
        component: () => import('../views/user/Product.vue'),
        props: (route) => {
          console.log('route', route);
          return {
            // key 可以自訂，要與UserProduct的props變數一致
            productID: route.params.productID
          };
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
