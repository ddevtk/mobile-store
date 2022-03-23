import { cartActionType } from './cartType';
import _ from 'lodash';

const defaultState = {
  cart: [],
  sl: '',
  total: '',
  isInit: true,
};

export const cartReducer = (state = defaultState, action) => {
  switch (action.type) {
    case cartActionType.CART_INIT:
      if (localStorage.getItem('cart')) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        return {
          ...state,
          sl: _.sumBy(cart, (item) => item.count),
          cart: cart,
          isInit: true,
          total: _.sumBy(cart, (item) => item.count * item.price),
        };
      }

      return defaultState;

    case cartActionType.ADD_TO_CART:
      let cart = [];
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      const existedItem = cart.find((item) => item._id === action.payload._id);
      if (existedItem) {
        cart[
          _.findIndex(cart, (item) => item._id === action.payload._id)
        ].count = existedItem.count + 1;

        localStorage.setItem('cart', JSON.stringify(cart));
        return {
          ...state,
          cart: cart,
          sl: _.sumBy(cart, (item) => item.count),
          isInit: false,
          total: _.sumBy(cart, (item) => item.count * item.price),
        };
      }
      cart.push({ ...action.payload, count: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      return {
        ...state,
        cart: cart,
        sl: _.sumBy(cart, (item) => item.count),
        isInit: false,
        total: _.sumBy(cart, (item) => item.count * item.price),
      };

    case cartActionType.REMOVE_ITEM_FROM_CART:
      const cartAfterRemove = state.cart.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cart', JSON.stringify(cartAfterRemove));
      return {
        ...state,
        cart: cartAfterRemove,
        sl: _.sumBy(cartAfterRemove, (item) => item.count),
        isInit: false,
        total: _.sumBy(cartAfterRemove, (item) => item.count * item.price),
      };

    default:
      return state;
  }
};