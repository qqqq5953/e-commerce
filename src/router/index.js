import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      // {
      //   path: 'movie/:title',
      //   name: 'SearchResult',
      //   component: () => import('../views/SearchResult.vue'),
      //   props: (route) => {
      //     // query 跟 params 差在前者不用在path帶參數
      //     return {
      //       keywords: route.params.title
      //     };
      //   }
      // }
      {
        path: 'search-result',
        name: 'SearchResult',
        component: () => import('../views/SearchResultTest.vue'),
        props: (route) => {
          // query 跟 params 差在前者不用在path帶參數
          return {
            genre: route.query.genre,
            keywords: route.query.title,
            language: route.query.language
          };
        }
      },
      {
        path: 'movie',
        name: 'Movie',
        component: () => import('../views/MovieTest.vue'),
        props: (route) => {
          // query 跟 params 差在前者不用在path帶參數
          console.log(route);
          return {
            language: route.query.language,
            id: route.query.id,
            genre: route.query.genre
          };
        }
      },
      {
        path: 'productTest',
        name: 'Test',
        component: () => import('../views/productTest.vue'),
        props: (route) => {
          // query 跟 params 差在前者不用在path帶參數
          console.log(route);
          return {
            language: route.query.language,
            movieID: route.query.id,
            genre: route.query.genre
          };
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Dashboard.vue'),
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/dashboard/Products.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/dashboard/Orders.vue')
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('../views/dashboard/Coupon.vue')
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
        path: 'coupon',
        name: 'UserCoupon',
        component: () => import('../views/user/Coupon.vue')
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
      },
      {
        path: 'checkout/:orderID',
        name: 'UserCheckout',
        component: () => import('../views/user/Checkout.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
