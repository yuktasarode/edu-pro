import { Button } from "@material-ui/core";
import React from "react";

function Announcement(props) {
  return <>
    <div className="border pt-4 px-4 pb-5">
        <p>{props.title}</p>
        <p><a href={props.link}>{props.link}</a></p>

    </div>
  </>
}

export default Announcement;
