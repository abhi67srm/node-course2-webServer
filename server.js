const express = require('express');
var app  = express();
//dynamic rendering emplate using hbs
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;


//using middleware
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');



//Registering middleware
//inside this middleware doesnt call next
app.use((req,res, next)=>{
   
   //now logout all the request that comes to the server
   //when someone made a request to specific url
   let now = new Date().toString();
   var log = `${now}: ${req.method} ${req.url}`;

   console.log(log);
   fs.appendFile('server.log', log + '\n', (err)=>{
       if(err){
           console.log("Unable to append file: ");
       }
   })




   next();


});

// app.use((req, res, next)=>{
//     res.render('maintainance.hbs');
// })
app.use(express.static(__dirname + '/public'));
//Register an handler for a http get request
hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase();
})

app.get('/',(request, response)=>{
    //passing template name and data
  response.render('home.hbs',{
      pageTitle: 'Home page',
      currentYear: new Date().getFullYear(),
      welcomeMessage: 'Welcome to ranzo website'
  })

    
});

app.get('/about',(req, res)=>{
     res.render('about.hbs', {
         pageTitle: 'About my page',
         currentYear: new Date().getFullYear()
     });
});

app.get('/bad', (req, res)=>{
    res.send({
        errorMessage: 'Unable to fetch data'
    });
});
//Bind the application to port in our machine

app.listen(port, ()=>{
    console.log(`Server is up on the port ${port}`);
});