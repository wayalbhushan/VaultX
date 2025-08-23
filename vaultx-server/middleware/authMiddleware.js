import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info from token to request
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
