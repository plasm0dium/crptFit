function middleware(req, res, next) {
  var token = req.headers['x-access-token'];

  if (token) {
    try {
      var decoded = jwt.verify(token, config.auth.token.secret);

      req.principal = {
        isAuthenticated: true,
        roles: decoded.roles || [],
        user: decoded.user
      };
      return next();

    } catch (err) { console.log('ERROR when parsing access token.', err); }
  }

  return res.status(401).json({ error: 'Invalid access token!' });
}