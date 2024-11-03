const urlManager = {
      login: "/login",
      register: "/register",
      createProduct: "/products",
      createMerchant: '/merchants',
      getMerchant: (id)=> `/merchants/${id}`,
      getProductByMerchantId: (id)=> `/products/merchant/${id}`,
      getAllCategories: '/categories',
      getVariantByProductId: (id)=> `/products/variant/${id}`,
      saveVariants: (id) => `/products/variant/save/${id}`,
      updateVariant: "/products/variants",
      getAllProducts: "/products",
      getDetailProduct: (id)=> `/products/${id}/details`,
};

export default urlManager;
