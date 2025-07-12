import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔹 Google OAuth Flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const redirectUri = req.query.redirect_uri || "http://localhost:55000/oauth/callback";
    res.redirect(`${redirectUri}?token=${token}`);
  }
);

// 🔹 GitHub OAuth Flow
router.get("/github", (req, res, next) => {
  const redirect_uri = req.query.redirect_uri || "http://localhost:55000/oauth/callback";
  const state = Buffer.from(JSON.stringify({ redirect_uri })).toString("base64");

  passport.authenticate("github", {
    scope: ["user:email"],
    state,
  })(req, res, next);
});

router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect("http://localhost:55000?error=oauth_failed");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    let redirectUri = "http://localhost:55000/oauth/callback";
    try {
      const state = JSON.parse(Buffer.from(req.query.state, "base64").toString());
      if (state.redirect_uri) redirectUri = state.redirect_uri;
    } catch (e) {
      console.error("Invalid state:", e);
    }

    return res.redirect(`${redirectUri}?token=${token}`);
  })(req, res, next);
});

export default router;
