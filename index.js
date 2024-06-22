import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "bnb",
//   password: "123456",
//   port: 5432,
// });
// db.connect();
// const API_URL = "https://www.meetup.com/api/guide/#p03-publishing-section"
// const graphQl = `mutation($input: CreateEventInput!) {
//     createEvent(input: $input) {
//       event {
//         id
//       }
//       errors {
//         message
//         code
//         field
//       }
//     }
//   }`

//   const variables = {
//     input: {
//       groupUrlname: "GROUP_URLNAME",
//       title: "EVENT_TITLE",
//       description: "EVENT_DESCRIPTION",
//       startDateTime: "EVENT_STARTTIME",
//       venueId: "EVENT_VENUE_ID",
//       duration: "EVENT_DURATION",
//       publishStatus: "DRAFT",
//     },
//   };

let hackathons = [{}];
let city;

app.get("/", async (req, res) => {

  res.render("index.ejs",{
    city:city,
  });
});

app.get("/state/:city", async (req, res) => {
  city = req.params.city;
  console.log(city+"city");
 res.redirect("/")
});
 
app.get("/about", async (req, res) => {
  res.render("about.ejs");
});


const cred = [];
app.post("/submit", async (req, res) => {
  const { name, email, contact, location, message } = req.body;
  if (!name || !email || !contact || !location || !message) {
    return res.render("contact.ejs", {
      title: "Bad Cradential Plz fill the form correctly",
    });
    // res.json("there is error at server side");
  }

  let newUser = {
    name,
    email,
    contact,
    location,
    message,
  };

  cred.push(newUser);
  //  await db.query("INSERT INTO users(name,email,phone,location,feedback) VALUES($1,$2,$3,$4,$5)",[name,email,contact,location,message]);
  console.log(cred);
  res.render("contact.ejs", {
    title: "Success fully Submited Your response",
  });
});

app.get("/contact", async (req, res) => {
  res.render("contact.ejs", {
    title: "Contact information",
  });
});




app.get("/hackathon",(async (req,res)=>{
    try {
      const result = await axios.get("https://devpost.com/api/hackathons?page=2");
    hackathons = result.data.hackathons;
    console.log(hackathons);
    res.render("hackathon.ejs",{
        posts: hackathons,
    });
    } catch (error) {
      console.log(error.message);
    }  
}))
app.listen(port,()=>{
    console.log(`app is live at http://localhost${port}`);
})
let Image = "/images/bg1.png";


app.get("/:category", async (req, res) => {
  const category = req.params.category;
    
const url = "https://api.predicthq.com/v1/events/";

const headers = {
  Authorization: "Bearer 9VmSvvkkX5nNDXw42SjSb0OeF2brrFnF6S2hM8U7",
  Accept: "application/json",
};

let location = "23.146807,72.126107";
switch(city){
  case "Ahmedabad":
    location = "23.202575, 72.514925";
    break;
  case "bhubaneshwar":
    location = "23.146807,72.126107";
    break;
  case "Bengaluru":
    location = "12.899591, 77.531499";
    break;
  case "Delhi":
    location = "28.625964, 77.262800";
    break; 
  case "Hyderabad":
    location = "17.321211, 78.497957";
    break; 
  case "Kolkata":
    location = "23.146807,72.126107";
    break;
  case "mumbai":
    location = "19.006356, 72.829927";
    break;  
  case "Pune":
    location = "18.498956, 73.877047";
    break;
              
}
let params = {
  
  category:category,
  country: "IN",

// "location_around.origin": "20.267646,85.833995",

"location_around.origin": location,
  
};
//    let params = {};

if(category == 'concerts'){
  Image = '/images/concerts.avif';
}else if(category == 'festivals'){
  Image = '/images/festival.avif';
}

try {
  const response = await axios.get(url, { headers, params });
  
  res.render("category.ejs",{
    posts: response.data.results,
    Image: Image,
  });
} catch (error) {
  console.error(error);
  res.status(500).send("An error occurred while searching for events.");
}
});
app.listen(8000, () => {
  console.log(`app is live at http://localhost${port}`);
});

