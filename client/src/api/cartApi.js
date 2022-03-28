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
export const getUserCart = async (authToken) =>
  await axios.get(`${process.env.REACT_APP_API}/cart/get-user-cart`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
