import { isProduction } from './isProduction';

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production Heroku URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getHttpDomain = (): string => {
  const prodUrl = 'https://wordlepvp-backend.oxv.io'; // TODO: insert your groups heroku prod url for server (once deployed)
  const devUrl = 'http://localhost:8080';

  return isProduction() ? prodUrl : devUrl;
};

export const getWsDomain = (): string => {
  const prodUrl = 'wss://wordlepvp-backend.oxv.io'; // TODO: insert your groups heroku prod url for server (once deployed)
  const devUrl = 'ws://localhost:8080';

  return isProduction() ? prodUrl : devUrl;
};
