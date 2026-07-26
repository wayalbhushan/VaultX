import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  // 1. Extract Access Token from httpOnly cookie or fallback Authorization header
  let token = req.cookies?.accessToken;

  if (!token) {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Prevent using temporary 2FA pre-auth tokens as full access tokens
    if (decoded.stage === "2fa_pending") {
      return res.status(401).json({ error: "2FA verification incomplete." });
    }

    // 2. Validate CSRF token for mutating requests (POST, PUT, DELETE, PATCH)
    const mutatingMethods = ["POST", "PUT", "DELETE", "PATCH"];
    if (mutatingMethods.includes(req.method.toUpperCase())) {
      const csrfHeader = req.headers["x-csrf-token"];
      const csrfCookie = req.cookies?.csrfToken;

      // Skip CSRF validation for unauthenticated auth endpoints (handled separately)
      const isAuthRoute = req.originalUrl.startsWith("/api/auth");
      if (!isAuthRoute) {
        if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
          return res.status(403).json({ error: "CSRF token validation failed." });
        }
      }
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired access token." });
  }
}
