require('dotenv').config()

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '196339583488-jak53f0n9ij7bcrbbvahckbsovsu0fm2.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


const PORT = 7000;

// Middleware

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('views'));

app.get('/', checkAuthenticated,(req, res)=>{
    res.render('index')
})

app.get('/book_form',checkAuthenticated, (req, res)=>{
    res.render('book_form')
})

app.get('/hobby_form',checkAuthenticated, (req, res)=>{
    res.render('hobby_form')
})

app.get('/login', (req,res)=>{
    res.render('login');
})

app.post('/login', (req,res)=>{
    let token = req.body.token;

    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });

        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload)
      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);

})


app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login')

})


function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

}


app.get('/thank_you', checkAuthenticated, (req, res)=>{
    res.render('thank_you')
})

app.get('/book_thank_you', checkAuthenticated, (req, res)=>{
    res.render('book_thank_you')
})

app.get('/admin', checkAuthenticated, (req, res)=>{
    res.render('admin')
})

app.get('/edit_book', checkAuthenticated, (req, res)=>{
    res.render('edit_book')
})

app.get('/edit_hobby', checkAuthenticated, (req, res)=>{
    res.render('edit_hobby')
})



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})




