# Rest_api_assignment_TO00BS65-3003 - Football Teams


The Football Team API REST API was built using NodeJS, Express, MongoDB, and Mongoose as part of my Full Stack course at Laurea UAS

## How to use it

``` javascript

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

```