import axios from 'axios';

export const saveCart = async (cart, sl, total, authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/cart/save`,
    { cart, sl, total },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
export const createOrder = async (paymentIntent, authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/cart/order`,
    { paymentIntent },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
export const capNhatThongTinNguoiMuaHang = async (
  name,
  sdt,
  address,
  authToken
) =>
  await axios.put(
    `${process.env.REACT_APP_API}/cart/update-user-info`,
    { sdt, address, name },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
export const applyCoupon = async (coupon, authToken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/cart/apply-coupon`,
    { coupon },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
export const getUserCart = async (authToken) =>
  await axios.get(`${process.env.REACT_APP_API}/cart/get-user-cart`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
