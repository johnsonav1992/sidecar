import { get, post, route } from 'remix/routes';

export const routes = route({
  assets: get('/assets/*path'),
  home: get('/'),
  login: get('/login'),
  googleLogin: get('/login/google'),
  googleCallback: get('/oauth2/callback'),
  logout: post('/logout'),
  dashboard: route('/dashboard', {
    index: get('/'),
    snapshot: get('/snapshot')
  })
});
