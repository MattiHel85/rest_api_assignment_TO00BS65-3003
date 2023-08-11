require('dotenv').config() // Require this to hide MongoDB password
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000 || process.env.PORT;
const mongoPass = '_72vLRW_fv9n!ty' || process.env.PASSWORD; // MongoDB password imported from .env file
const mongoose = require('mongoose')
const routes = require('./routes.json')
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const Team = require('./models/team')
const jwt = require('jsonwebtoken')

// DB Connection address
const uri = `mongodb+srv://mattisimpson:${mongoPass}@to00bs65-3003.gj3nvll.mongodb.net/?retryWrites=true&w=majority`;

// Make DB connection
mongoose.connect(uri, {
    useNewUrlParser: true
});

const db = mongoose.connection;

// Connection status

db.on("error", (err) => console.log(`Connection ${err}`));

db.once("open", () => console.log("Connected to DB!"));

// Express-session middleware
app.use(
    session({
      secret: 'askOchEmbla',
      resave: false,
      saveUninitialized: true,
      // You can add more configuration options here as needed
    })
  );
  

// Don't delete this again. You need them!
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Create User variable for reuse
// const User = mongoose.model('User', userSchema);

app.get('/api', (req, res) => {
    res.status(200).json(routes);
})

// Add new team
app.post('/api/add', async (req, res) => {
    const newTeam = new Team({
        badgeUrl: req.body.badgeUrl,
        name: req.body.name,
        nickname: req.body.nickname,
        founded: req.body.founded,
        groundName: req.body.groundName,
        groundCapacity:  req.body.groundCapacity,
        country: req.body.country,
        league: req.body.league,
        coach: req.body.coach
    })
    await newTeam.save()
        .then(newTeam => {
            console.log(`Added team: ${newTeam.name}`)
        })
        .catch(e => {
            console.log(e)
        })
})  

// Get all teams
app.get('/api/getall', async (req, res) => {
    const allTeams = await Team.find({});
    res.status(200).json(allTeams);
})

// Find team by ID
app.get('/api/:id', async (req, res) => {
    const { id } = req.params;
    const team = await Team.findById(id);
    res.status(200).json(team);
})

// Update team by ID
app.put('/api/update/:id', async (req, res) => {    
    const { id } = req.params;
    const team = await Team.findByIdAndUpdate(id, req.body, { runValidators: true, new: true})
    console.log(`Data updated for: ${team.name}`);
})

// Delete team by ID
app.delete('/api/delete/:id', async (req, res) => {    
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id, req.body, { runValidators: true, new: true})
    console.log(`Deleted user: ${team.name}`);
})

// User routes
app.post('/api/users/add', async (req, res) => {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password,
            profilePicUrl: req.body.profilePicUrl
        });
        await newUser.save();
        console.log(`Added user: ${newUser.firstName} ${newUser.lastName} id: ${newUser._id}`);
        res.status(201).json({ message: 'User added successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'An error occurred while adding the user' });
    }
});


// Get all users
app.get('/users', async (req, res) => {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
})

// Get user by ID
app.get('/users/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update user by ID
app.put('/users/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            runValidators: true,
            new: true
        });
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
        } else {
            console.log(`Updated user: ${updatedUser.firstName} ${updatedUser.lastName}`);
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.error("Error updating user by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete user by ID
app.delete('/users/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ error: "User not found" });
        } else {
            console.log(`Deleted user: ${deletedUser.firstName} ${deletedUser.lastName}`);
            res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (error) {
        console.error("Error deleting user by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// User login
app.post('/signin',(req, res, next) => {
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/signin'}, (err, user, info) => {
        if(err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({message: 'Authentication failed'})
        }

        const token = jwt.sign({userId: user._id}, 'askOchEmbla', { expiresIn: '1h'})

        // send token to front end
        res.status.json({ token })
    })(req, res, next)
})


// listening to port
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})