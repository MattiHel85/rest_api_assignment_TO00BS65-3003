require('dotenv').config() // Require this to hide MongoDB password
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const mongoPass = process.env.PASSWORD || "_72vLRW_fv9n!ty"; // MongoDB password imported from .env file
const mongoose = require('mongoose')
const routes = require('./routes.json')
// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

// PORT=3000
// PASSWORD=_72vLRW_fv9n!ty

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "mongo-password";

const client = new SecretsManagerClient({
  region: "eu-north-1",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );
} catch (error) {
  // For a list of exceptions thrown, see
  // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
  throw error;
}

const secret = response.SecretString;

console.log(secret)

// Your code goes here

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
app.use(cors());


// Come up with a new schema for a better project
const teamSchema = new mongoose.Schema({
    badgeUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    founded: {
        type: Number,
        required: true
    },
    groundName: {
        type: String,
        required: true
    },
    groundCapacity: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    league: {
        type: String,
        required: true
    },
    coach: {
        type: String,
        required: true
    }
})

// User Schema for future use 
// const userSchema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: true
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     emailAddress: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     profilePicUrl: {
//         type: String,
//         required: false
//     }
// })

// Create Team variable for reuse
const Team = mongoose.model('Team', teamSchema);

// Create Team variable for reuse
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

// listening to port
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})