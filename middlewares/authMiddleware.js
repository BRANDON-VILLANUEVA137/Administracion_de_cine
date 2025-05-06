function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next(); // Usuario autenticado
    }
    res.redirect('/login'); // Si no está logueado
  }
  
  module.exports = { ensureAuthenticated };
  