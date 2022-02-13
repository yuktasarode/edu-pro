import React, { Component, useState } from "react";
import "../../styles.css";
import { Navigate } from "react-router-dom";
import CustomInput from "../common/CustomInput";
import Button from "../common/Button";
import {auth,db,fire} from "../../Fire.js"; 
import { Typography } from "@material-ui/core";
//import firebase from "firebase";
//import {useState} from 'react';


//var auth = new firebase.auth;

const INITIAL_STATE = {
  name: "",
  u_id: "",
  dept: ""
};


export default class StudDashboard extends Component {
  state = { ...INITIAL_STATE };

  

  handleChange = e => {
    this.setState({ [e.currentTarget.id]: e.currentTarget.value });
  };

  

  render() {
    return (
      <div className="App">
          <Typography>Hello Teacher</Typography>
              </div>
    );
  }
}

