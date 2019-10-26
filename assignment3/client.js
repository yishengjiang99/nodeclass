const fetch = require("node-fetch");
const https = require("https");


var token;

fetch("http://localhost:3004/users/login", {
  'method': 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'username': 'yisheng3',
    password: 'hello'
  }),
}).then(res => res.json()).then(async result => {
  if (!result.token) throw new Error("unexpected " + JSON.stringify(result));
  token = result.token;

  var added = await fetch("http://localhost:3004/dishes", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "name": "naan" + new Date(),
      "price": 1000
    })
  })
  var addJson = await added.json();
  var dishId = addJson._id;

  console.log(addJson);

  await fetch("http://localhost:3004/favorites/"+dishId, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  }).then(res => {
    console.log(res);
    return res.json()
  }).then(console.log).catch(console.log);

  
  await fetch("http://localhost:3004/favorites/"+dishId, {
    method: "delete",
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(res => res.json()).then(console.log).catch(console.log);


  await fetch("http://localhost:3004/favorites", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([{
      "_id": dishId
    }, {
      _id: "5db3dfe911fd657e0e57d39f"
    }])
  }).then(res => {
    console.log(res);
    return res.json()
  }).then(console.log).catch(console.log);


  await fetch("http://localhost:3004/favorites", {
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(res => res.json()).then(console.log).catch(console.log);
  

  await fetch("http://localhost:3004/favorites", {
    method: "delete",
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(res => res.json()).then(console.log).catch(console.log);
}).catch(console.log);
