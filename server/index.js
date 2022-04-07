var spawn = require('child_process').spawn;
var cors = require('cors')

const fs = require('fs')

// var exec = require('child_process').exec,child;
const express = require("express");
const { fstat } = require('fs');

const PORT = process.env.PORT || 3001;



const app = express();
app.use(express.json())
app.use(cors()) // Use this after the variable declaration

  


sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

app.post('/uploadModel',(req,res)=>{
  console.log(req.body.answer);
  console.log(req.body.studentAnswer);
  var modifyResp =""
  for(var i =0;i<req.body.studentAnswer.length;i++)
  {
    modifyResp +=req.body.studentAnswer[i] +"\n"
  }
  
  fs.writeFile('ModelAnswer.txt', req.body.answer, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  })

  fs.writeFile('StudentAnswer.txt', modifyResp, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  })

  var dataToSend;
  // var baseDocument="My name is yukta. I am 22 year old. I am studying in VJTI. I am pursuing Information Technology course. I would get a BTECH degree after graduation.";
  // var documents=["Yukta is my name. I am studying in VJTI in Information Technology (Btech). My age is 22","I am Priyanshi Gupta from VJTI. I am studying Information Technology from VJTI, I am 22 yr old. My degree is Btech."];
  
  // spawn new child process to call the python script
  const python = spawn('python', ['script.py']);
  
  console.log("endpoint")
  // console.log(python)
  // sleep(5000)
  // collect data from script
    python.stdout.on('data', function (data) {
   console.log('Pipe data from python script ...');
   console.log(data.toString());
   dataToSend = data.toString();
   res.send(dataToSend)
  });

  
});

app.get('/bert',async (req, res)=>{
    var dataToSend;
    // var baseDocument="My name is yukta. I am 22 year old. I am studying in VJTI. I am pursuing Information Technology course. I would get a BTECH degree after graduation.";
    // var documents=["Yukta is my name. I am studying in VJTI in Information Technology (Btech). My age is 22","I am Priyanshi Gupta from VJTI. I am studying Information Technology from VJTI, I am 22 yr old. My degree is Btech."];
    
    // spawn new child process to call the python script
    const python = spawn('python', ['script.py']);
    
    console.log("endpoint")
    // console.log(python)
    // sleep(5000)
    // collect data from script
     python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     console.log(data.toString());
     dataToSend = data.toString();
     res.send(dataToSend)
    
    });
    // sleep(5000)
    // in close event we are sure that stream from child process is closed
    // python.on('close', (code) => {
    // console.log(`child process close all stdio with code ${code}`);
    // // send data to browser
    // res.send(dataToSend)
    // });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

