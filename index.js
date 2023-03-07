require('dotenv').config() // Require this to hide MongoDB password
const express = require('express');
const app = express();
const PORT = process.env.PORT ||3000
const mongoPass = process.env.PASSWORD || "_72vLRW_fv9n!ty" // MongoDB password imported from .env file
const mongoose = require('mongoose')

// DB Connection address
const uri = `mongodb+srv://mattisimpson:${mongoPass}@to00bs65-3003.gj3nvll.mongodb.net/?retryWrites=true&w=majority`;

// Make DB connection
mongoose.connect(uri);

const db = mongoose.connection;

// Connection status

db.on("error", (err) => console.log(`Connection ${err}`));

db.once("open", () => console.log("Connected to DB!"));

// Don't delete this again. You nee
app.use(express.json());

// Create userSchema
// const userSchema = new mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     age: Number,
//     nationality: String
// })

// Come up with a new schema for a better project
const teamSchema = new mongoose.Schema({
    badgeUrl: String,
    name: String,
    nickname: String,
    founded: Number,
    groundName: String,
    groundCapacity: Number,
    country: String,
    league: String,
    coach: String
})

// Create User variable for reuse
// const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);

// Test if the Schema works by adding a new User to DB

const TestTeam = new Team({
    badgeUrl: "badge.url",
    name: "Manchester United",
    nickname: "The Red Devils",
    founded: 1878,
    groundName: "Old Trafford",
    groundCapacity:  74310,
    country: "England",
    league: "Premier League",
    coach: "Erik Ten Hag"
})

TestTeam.save()
    .then(TestTeam => {
        console.log(`Added team: ${TestTeam.name}`)
    })
    .catch(e => {
        console.log(e)
    })


// Add new user
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

// Get all users
app.get('/api/getall', async (req, res) => {
    const allTeams = await Team.find({});
    res.status(200).json(allTeams);
})

// Find user by ID
app.get('/api/:id', async (req, res) => {
    const { id } = req.params;
    const team = await Team.findById(id);
    res.status(200).json(team);
})

// Update user by ID
app.put('/api/update/:id', async (req, res) => {    
    const { id } = req.params;
    const team = await Team.findByIdAndUpdate(id, req.body, { runValidators: true, new: true})
    console.log(`Data updated for: ${team.name}`);
})

// Delete user by ID
app.delete('/api/delete/:id', async (req, res) => {    
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id, req.body, { runValidators: true, new: true})
    console.log(`Deleted user: ${team.name}`);
})

// listening to port
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})