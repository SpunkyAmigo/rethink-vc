const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Set up passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/callback" 
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you can save the user's profile or create a session
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middlewares
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the GitHub OAuth Demo!</h1><p><a href="/auth/github">Login with GitHub</a></p>');
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Step 2: GitHub redirects here after successful authentication
app.get('/auth/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // On successful login, redirect to your frontend/dashboard
    res.redirect('http://localhost:9001');  // Update with your actual frontend URL
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
