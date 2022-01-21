import React, { Component } from "react";
import "../../styles.css";
import CustomInput from "../common/CustomInput";
import Button from "../common/Button";

export default class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = e => {
    this.setState({ [e.currentTarget.id]: e.currentTarget.value });
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
            labelText="Set Password"
            id="password"
            formControlProps={{
              fullWidth: true
            }}
            handleChange={this.handleChange}
            type="password"
          />

          <CustomInput
            labelText="Full Name"
            id="name"
            formControlProps={{
              fullWidth: true
            }}
            handleChange={this.handleChange}
            type="text"
          />

          
           <CustomInput
            labelText="Registration ID"
            id="id"
            formControlProps={{
              fullWidth: true
            }}
            handleChange={this.handleChange}
            type="numeric"
          />


          <Button type="button" color="primary" className="form__custom-button">
            Sign Up!
          </Button>
        </form>
      </div>
    );
  }
}

