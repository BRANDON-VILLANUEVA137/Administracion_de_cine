// middlewares/authMiddleware.js
exports.ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    res.status(401).json({ message: 'No autorizado. Inicia sesión.' });
  };
  
  exports.ensureRole = (role) => {
    return (req, res, next) => {
      if (req.session && req.session.user && req.session.user.role === role) {
        return next();
      }
      res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
    };
  };
  