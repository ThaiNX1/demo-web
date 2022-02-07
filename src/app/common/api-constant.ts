export const Api = {
  // Đăng nhập/Đăng ký
  LOGIN: '/api/WebAuth/login',
  REGISTER: '/api/WebAuth/register',
  // Địa chỉ
  ADDRESS_GET_PROVINCE : '/api/WebAddress/getProvince',
  ADDRESS_GET_DISTRICT : '/api/WebAddress/getDistrict',
  ADDRESS_GET_WARD : '/api/WebAddress/getWard',
  // Lấy danh sách danh mục hàng hóa
  GET_ALL_CATEGORY: '/api/WebCategory/getAll',
  GET_ALL_SLIDER: '/api/WebSlider/getAll',
  GET_TOP_PRODUCT_DEAL: '/api/WebProduct/getDealToday',
  // Chi tiết hàng hóa
  GOOD_BY_ID: '/api/WebProduct/getById',
  GOOD_TOP_SELL:'/api/WebProduct/getTopSell',
  GOOD_SAMPLE_CATEGORY:'/api/WebProduct/getSampleCategory',
  GOOD_SEARCH:'/api/WebProduct/getProducts',
  // Giỏ hàng
  CART_COUNT:'/api/WebCart/countCart',
  CART_ADD_GOOOD:'/api/WebCart/addProduct',
  CART_BY_CUSTOMER:'/api/WebCart/getCartByCustomer',
  CART_UPDATE:'/api/WebCart/updateCart',
  CART_DELETE_BY_ID:'/api/WebCart/deleteCart',
  CART_DELETE_ALL:'/api/WebCart/deleteCart',
  // Đơn hàng
  ORDER_CREATE:'/api/WebOrder/createOrder'
};
