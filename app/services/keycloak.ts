import { instance } from './axios';
import { getAuthConfig } from './auth';

export const getInstallation = async (requestId: number) => {
  const config = getAuthConfig();
  try {
    const results = await instance.post('installation', { requestId }, config).then((res) => res.data);
    return results;
  } catch (err) {
    console.error(err);
    return null;
  }
};
