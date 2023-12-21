// api.ts
import axios from "axios";

const BASE_URL = "http://localhost";

type options = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const fetchData = async (
  port: number,
  endpoint: string,
  options?: options
) => {
  try {
    const url = `${BASE_URL}:${port}/${endpoint}`;
    const response = await axios.get(url, {
      withCredentials: true,
      ...options,
    });
    if (response.status < 400) {
      return response.data;
    } else {
      console.error(
        `Got status ${response.status} Cannot GET data from ${url}, response contains: ${response.data}`
      );
      return [];
    }
  } catch (e) {
    const error = e as Error;
    console.error(
      `Error while running fetchData: ${error.name}: ${error.message}`
    );
    return {};
  }
};

export const createItem = async (
  port: number,
  endpoint: string,
  options?: options
) => {
  try {
    const url = `${BASE_URL}:${port}/${endpoint}`;
    const response = await axios.post(
      url,
      {
        ...options,
      },
      { withCredentials: true }
    );
    if (response.status < 400) {
      return response.data;
    } else {
      console.error(
        `Got status ${response.status}, Cannot POST data from ${url}, response contains: ${response.data}`
      );
    }
  } catch (e) {
    const error = e as Error;
    console.error(
      `Error while running createItem: ${error.name}: ${error.message}`
    );
    return {};
  }
};

export const deleteItem = async (
  port: number,
  endpoint: string,
  options?: options
) => {
  try {
    const url = `${BASE_URL}:${port}/${endpoint}`;
    const response = await axios.delete(url, {
      withCredentials: true,
      ...options,
    });
    if (response.status < 400) {
      return response.data;
    } else {
      console.error(
        `Got status ${response.status}, Cannot DELETE data from ${url}, response contains: ${response.data}`
      );
    }
  } catch (e) {
    const error = e as Error;
    console.error(
      `Error while running deleteItem: ${error.name}: ${error.message}`
    );
    return {};
  }
};
