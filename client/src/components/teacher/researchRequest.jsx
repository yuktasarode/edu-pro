import React, { Component, useState } from "react";
import "../../styles.css";
import { Navigate } from "react-router-dom";
import CustomInput from "../common/CustomInput";
import Button from "../common/Button";
import {auth,db,fire} from "../../Fire.js"; 

const INITIAL_STATE = {
  email: "",
  password: "",
  logged_in:false
};


export default class Login extends Component {
  state = { ...INITIAL_STATE };

  

  handleChange = e => {
    this.setState({ [e.currentTarget.id]: e.currentTarget.value });
  };

  onSubmit = event => {
    const { email, password } = this.state;

    //const { history } = this.props;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(prevState => ({
          logged_in: !prevState.logged_in
        }));
        //history.push(routes.HOME);
      })
      .catch(error => {
        //this.setState(byPropKey("error", error));
        alert(error);
        //this.timer(); //defined below
      });

    event.preventDefault();
  };


  render() {
    return (
      <div className="App">
        <form className="form">
          <CustomInput
            labelText="Email"
            id="email"
            formControlProps={{
              fullWidth: true
            }}
            handleChange={this.handleChange}
            type="text"
          />
          <CustomInput
            labelText="Password"
            id="password"
            formControlProps={{
              fullWidth: true
            }}
            handleChange={this.handleChange}
            type="password"
          />

          <Button type="button" color="primary" className="form__custom-button" onClick={this.onSubmit}>
            Log in
          </Button>
        </form>

        {this.state.logged_in ? <Navigate to="/dashboardTeacher" /> : null}

      </div>
    );
  }
}

