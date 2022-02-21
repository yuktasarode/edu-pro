import { Button } from "@material-ui/core";
import React from "react";
const GSheetReader = require("g-sheets-api");

function Announcement(props) {
  const options = {
    apiKey: "AIzaSyBRr22JbJlVXmpbAkliWkZ6YfzgPbiZID0",
    sheetId: "1PzHjYf1ayXuVgMGMMYTWrft8zoR50Ner-tiIcL6911g",
    sheetNumber: 1,
    sheetName: "Form responses 1", // if sheetName is supplied, this will take precedence over sheetNumber
    returnAllResults: false
  };
  fetchSheet=()=>{
    GSheetReader(
      options,
      (results) => {
        // do something with the results here
        // console.log(results);
        for(var i =0;i<results.length;i++){
            console.log(results[i].Score.split('/')[0]);
    
        }
      },
      (error) => {
        // OPTIONAL: handle errors here
        console.log(error);
      }
    );
    

  };
  return <>
    <div className="border pt-4 px-4 pb-5">
        <p>{props.title}</p>
        <p>{props.link}</p>
        {props.grade?<Button onClick={fetchSheet}>Grade</Button>:null}
    </div>
  </>
}

export default Announcement;
