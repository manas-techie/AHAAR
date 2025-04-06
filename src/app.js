require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash')
const User = require('./model/userRestrationModel.js')
const ExpressError = require("./utils/expressError.js")
const methodOverride = require('method-override');


const http = require('http'); 
const socketio = require('socket.io'); 

require('./db/connectToDB.js');


const server = http.createServer(app); 
const io = socketio(server);


const mainRoute = require('./router/mainRoute.js')
const restaurantRoute = require('./router/restaurantRoute.js')
const userRoute = require('./router/userRoute.js');
const reviewRoute = require('./router/reviewRoute.js');
const menuRoute = require('./router/menuRoute.js');
const menuReviewRoute = require('./router/menuReviewRoute.js');
const mapRoute = require('./router/mapRoute.js');

const { getMenuWithReviews, askGemini } = require('./chatBot/chatBot.js');


const sessionOptions = {
    secret: process.env.MY_SCRECT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
};

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '../public')));



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use('/', mainRoute);
app.use('/restaurant', restaurantRoute)
app.use('/dealer', userRoute);
app.use('/restaurant/:id/review', reviewRoute);
app.use('/menu', menuRoute);
app.use('/menu',menuReviewRoute);
app.use('/', mapRoute);




// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", { err });
});



// Socket.io connection

io.on("connection", (socket) => {
    console.log("New user connected to the chatbot");

    socket.on("userMessage", async (message) => {

        try {
            const menuId = app.locals.menuId; // Use a dynamic menuId if needed
            const menuData = await getMenuWithReviews(menuId);
            const botResponse = await askGemini(menuData, message);
            socket.emit("botMessage", botResponse);
        } catch (error) {
            console.error("Chatbot error:", error);
            socket.emit("botMessage", "Sorry, something went wrong.");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected from the chatbot");
    });
});



const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});