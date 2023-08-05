const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express()

app.use(bodyParser.urlencoded({extended: true}));   // This means it will parse all the elements that are present in a HTML page.
// If extended is set to false then it will only parse strings and numbers.

// For static access:
app.use(express.static("public"));    
// where public is the folder name which is kept as static.

app.get("/", function(req, res){
    res.sendFile(__dirname+'/signup.html');
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // Creating JSON of the above data:

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,

                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);      // This is what we have to send to mailchimp.

    const url = 'https://us12.api.mailchimp.com/3.0/lists/8302567486';
    const options = {
        method: 'POST',
        auth: 'koushiksdhu:685d560af326cc303faa2edd62837eda-us12'      // auth: "username : APIkey" 

    };

    // Syntax: https.request(url, options, function())
    const request = https.request(url, options, function(response){

                        if(response.statusCode === 200){
                            // res.write("<h1>Successfully Subscribed</h1>");
                            // res.write(`First Name: ${firstName}<br>\n`);
                            // res.write(`Last Name: ${lastName}<br>\n`);
                            // res.write(`Email: ${email}<br>`);
                            // res.send();
                            res.sendFile(__dirname+"/success.html");
                        }
                        else{
                            res.sendFile(__dirname+"/failure.html");
                            // res.send("Sorry! There was an erroe while signing up. Please try again.");
                        }

                        response.on("data", function(data){
                            console.log(JSON.parse(data));
                        });
                    });
    
    request.write(jsonData);
    request.end();
    // console.log(firstName+" "+lastName+" "+email);
    // Printing JSON data in the above 3 lines (basically, it is JavaScript Object)
    // res.sendFile(__dirname+'/success.html')
    // res.send();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){                // process.env.PORT is a dynamic port which is been defined on the go as per availability.
    console.log(`Server started at port: ${process.env.PORT || 3000}`);
});


/*
API Key: 685d560af326cc303faa2edd62837eda-us12
Audience ID or List ID: 8302567486

Mail chimp:
email: er.koushiksadhu@gmail.com
password: Ks@12345
*/