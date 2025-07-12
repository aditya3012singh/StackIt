import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
const DEFAULT_REDIRECT_URI = "http://localhost:5173/oauth/callback";

// 🔹 Google OAuth: Initiate
router.get("/google", (req, res, next) => {
  const redirect_uri = req.query.redirect_uri || DEFAULT_REDIRECT_URI;
  const state = Buffer.from(JSON.stringify({ redirect_uri })).toString("base64");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
    session: false,
  })(req, res, next);
});

// 🔹 Google OAuth: Callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.error("Google OAuth error:", err);
      return res.redirect(`${DEFAULT_REDIRECT_URI}?error=oauth_failed`);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    let redirectUri = DEFAULT_REDIRECT_URI;
    try {
      const state = JSON.parse(Buffer.from(req.query.state, "base64").toString());
      if (state.redirect_uri) redirectUri = state.redirect_uri;
    } catch (e) {
      console.error("Invalid state from Google:", e);
    }

    res.redirect(`${redirectUri}?token=${token}`);
  })(req, res, next);
});

// 🔹 GitHub OAuth: Initiate
router.get("/github", (req, res, next) => {
  const redirect_uri = req.query.redirect_uri || DEFAULT_REDIRECT_URI;
  const state = Buffer.from(JSON.stringify({ redirect_uri })).toString("base64");

  passport.authenticate("github", {
    scope: ["user:email"],
    state,
    session: false,
  })(req, res, next);
});

// 🔹 GitHub OAuth: Callback
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user) => {
    if (err || !user) {
      console.error("GitHub OAuth error:", err);
      return res.redirect(`${DEFAULT_REDIRECT_URI}?error=oauth_failed`);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    let redirectUri = DEFAULT_REDIRECT_URI;
    try {
      const state = JSON.parse(Buffer.from(req.query.state, "base64").toString());
      if (state.redirect_uri) redirectUri = state.redirect_uri;
    } catch (e) {
      console.error("Invalid state from GitHub:", e);
    }

    res.redirect(`${redirectUri}?token=${token}`);
  })(req, res, next);
});

export default router;
