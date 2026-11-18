require("dotenv").config();

const express = require("express");
const session = require("express-session");
const msal = require("@azure/msal-node");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);
const scopes = ["openid", "profile", "email"];

app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(`
      <h1>FutureBank SSO Demo</h1>
      <h2>Login successful ✅</h2>
      <p><strong>Name:</strong> ${req.session.user.name || "Not provided"}</p>
      <p><strong>Username:</strong> ${req.session.user.username || "Not provided"}</p>
      <p>This user authenticated through Microsoft Entra ID.</p>
      <a href="/logout">Sign out</a>
    `);
  } else {
    res.send(`
      <h1>FutureBank SSO Demo</h1>
      <p>You are not signed in.</p>
      <a href="/login">Sign in with Microsoft Entra ID</a>
    `);
  }
});

app.get("/login", async (req, res) => {
  try {
    const authCodeUrl = await cca.getAuthCodeUrl({
      scopes,
      redirectUri: process.env.REDIRECT_URI,
    });

    res.redirect(authCodeUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to start login.");
  }
});

app.get("/auth/redirect", async (req, res) => {
  try {
    const tokenResponse = await cca.acquireTokenByCode({
      code: req.query.code,
      scopes,
      redirectUri: process.env.REDIRECT_URI,
    });

    req.session.user = {
      name: tokenResponse.account?.name,
      username: tokenResponse.account?.username,
    };

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed. Check the terminal for details.");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("FutureBank SSO Demo running at http://localhost:3000");
});
