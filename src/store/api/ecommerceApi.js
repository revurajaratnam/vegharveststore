import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ecommerceApi = createApi({
  reducerPath: 'ecommerceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order','AdminStats'],

  endpoints: (builder) => ({
    // Auth endpoints
login: builder.mutation({
  query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
}),
register: builder.mutation({
  query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
}),
forgotPassword: builder.mutation({
  query: (email) => ({ url: '/auth/forgot-password', method: 'POST', body: { email } }),
}),
resetPassword: builder.mutation({
  query: ({ token, password }) => ({
    url: `/auth/reset-password/${token}`,
    method: 'POST',
    body: { password },
  }),
}),

// User orders, cancel & return
getMyOrders: builder.query({
  query: () => '/orders/my-orders',
  providesTags: ['Order'],
}),
cancelOrder: builder.mutation({
  query: (orderId) => ({ url: `/orders/${orderId}/cancel`, method: 'PATCH' }),
  invalidatesTags: ['Order', 'AdminStats'],
}),
returnOrder: builder.mutation({
  query: ({ orderId, reason }) => ({
    url: `/orders/${orderId}/return`,
    method: 'PATCH',
    body: { reason },
  }),
  invalidatesTags: ['Order', 'AdminStats'],
}),

// Product review with photo upload (FormData)
addProductReview: builder.mutation({
  query: ({ productId, formData }) => ({
    url: `/products/${productId}/reviews`,
    method: 'POST',
    body: formData,
  }),
  invalidatesTags: (result, error, { productId }) => [
    { type: 'Product', id: productId },
    { type: 'Product', id: 'LIST' },
  ],
}),
    // 1. GET: Fetch all vegetables (supports optional query params)
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['AdminStats', 'Order', 'Product'],
    }),
    getProducts: builder.query({
      query: ({ category, search } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        const queryString = params.toString();
        return queryString ? `/products?${queryString}` : '/products';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // 2. GET: Fetch single vegetable by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // 3. POST: Add a new vegetable to inventory
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // 4. PUT: Full replacement of an existing vegetable
    updateProduct: builder.mutation({
      query: ({ id, ...fullProductData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: fullProductData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // 5. PATCH: Partial update (e.g., update only price or stock status)
    patchProduct: builder.mutation({
      query: ({ id, ...partialFields }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: partialFields,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // 6. DELETE: Remove a vegetable from inventory
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // 7. POST: Buy products (Submit checkout order to backend)
    createOrder: builder.mutation({
      query: (orderPayload) => ({
        url: '/orders',
        method: 'POST',
        body: orderPayload,
      }),
      invalidatesTags: ['Order', { type: 'Product', id: 'LIST' }],
    }),

    // 8. GET: Fetch user's order history
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),

    // 9. PATCH: Cancel or update order status
    patchOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useAddProductReviewMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  usePatchProductMutation,
  useDeleteProductMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  usePatchOrderStatusMutation,
  useGetAdminStatsQuery, // <-- Add this
} = ecommerceApi;