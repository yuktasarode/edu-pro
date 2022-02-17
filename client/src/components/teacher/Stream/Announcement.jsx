import { Button } from "@material-ui/core";
import React from "react";

function Announcement(props) {
  return <>
    <div className="border pt-4 px-4 pb-5">
        <p>{props.title}</p>
        <p>{props.link}</p>
        {props.grade?<Button>Grade</Button>:null}
    </div>
  </>
}

export default Announcement;
