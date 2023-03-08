# Rest_api_assignment_TO00BS65-3003 - Football Teams


The Football Team API REST API was built using NodeJS, Express, MongoDB, and Mongoose as part of my Full Stack course at Laurea UAS

## How to use the API

This is a CRUD app that saves information on football teams to a database in Mongo Atlas. In future it will be expanded to include different leagues and competitions but for now it is limited to just individual teams.

Below is the schema containing all data types the user must send to the backend.

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
## Routes

Here are the 5 routes currently included in the API

### Add Team

By sending a POST request to the following url with the correcting parameters, you can add your favourite football team to the database.

``` bash
https://football-teams-rest-api-assignment.onrender.com/api/add
```
### Get All Teams

By sending a GET request to the following url you can access all teams currently in the database. The response is sent as a JSON response to the browser.

``` bash
https://football-teams-rest-api-assignment.onrender.com/api/getall
```

### Get Team By Id

By sending a GET request to the following url you can view the information of a particular team. Replace ':id' with the ID of the team.

``` bash
https://football-teams-rest-api-assignment.onrender.com/api/:id
```
### Update Team By Id

By sending a PUT request to the following url you can update the information of a particular team.
Replace ':id' with the ID of the team.

NOTE - All parameters must be sent again in order for this to work. I will add a PATCH request in future versions. 


``` bash
https://football-teams-rest-api-assignment.onrender.com/api/update/:id
```

### Delete Team By Id
By sending a DELETE request to the following url you can delete the information of a particular team.
Replace ':id' with the ID of the team you wish to delete.

``` bash
https://football-teams-rest-api-assignment.onrender.com/api/delete/:id
```

## License

[MIT](https://choosealicense.com/licenses/mit/)