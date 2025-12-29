import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import 'dotenv/config';
import DatabaseMethods from './DatabaseMethods';
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized:false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.post('/signup', (req,res)=>{
    const {username, password} = req.body;
    const user = DatabaseMethods.findUser(username);

    if (user === null) {
        DatabaseMethods.addUser(username, password);
        res.status(200).json({message: 'success.'});
    } else {
        res.status(400).json({error: 'user already exists.'});
    }
});

app.post('/login', (req,res)=>{
    const {username, password} = req.body;

    const user = DatabaseMethods.findUser(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = {
        id: user.id,
        username: user.username
    };

    res.json({ message: 'success.', user: req.session.user });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'success.' });
  });
});

app.listen(8080, ()=>{
    console.log("Server running on port 8080.")
});