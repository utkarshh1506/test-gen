const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');
const aiRoutes = require('./routes/aiRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json());


app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoutes);
app.use('/api', githubRoutes);
app.use('/api', aiRoutes);



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
