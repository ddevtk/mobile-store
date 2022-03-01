import axios from 'axios';

export const createOrUpdateUser = async (authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/auth/create-or-update-user`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

export const currentUser = async (authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/auth/current-user`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

export const currentAdmin = async (authToken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/auth/current-admin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );