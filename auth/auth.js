const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("bearer ", "").trim();
      if (!token) {
        res
          .status(401)
          .json({ success: false, message: "No token,Autherization denied." });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        req.user = decoded;
        if (roles.length > 0 && !roles.includes(req.user?.role)) {
          return res
            .status(403)
            .json({ success: false, message: `Accessed Denied` });
        }
        next();
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: `Internal Server Error ${err}` });
    }
  };
};

module.exports = authMiddleware;
