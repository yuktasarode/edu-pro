import React, { Component } from "react";
import "../../styles.css";
import CustomInput from "../common/CustomInput";
import Button from "../common/Button";
import {Navigate} from "react-router-dom";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {sendEmailVerification} from 'firebase/auth';
import {auth,db,fire} from "../../Fire.js"; 
import  Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";


const INITIAL_STATE = {
  signed_up: false,
  login_clicked:false,
  email: "",
    password: "",
    name:"",
    reg_id:"",
    branch:""
};

export default class Signin extends Component {
  state = {
    ...INITIAL_STATE
  };

  handleChange = e => {
    this.setState({ [e.currentTarget.id]: e.currentTarget.value });
  };

  

  firebaseset = () => {
    try {
      const { accounts, contract } = this.props;
      fire
        .database()
        .ref()
        .child("Students")
        .child(accounts[0])
        .child("name")
        .set(this.state.name);
      fire
        .database()
        .ref()
        .child("Students")
        .child(accounts[0])
        .child("email")
        .set(this.state.email);
      fire
        .database()
        .ref()
        .child("Students")
        .child(accounts[0])
        .child("reg_id")
        .set(this.state.reg_id);
      fire
        .database()
        .ref()
        .child("Students")
        .child(accounts[0])
        .child("branch")
        .set(this.state.branch);
    } catch (fipu) {}
  };

  signup = async ()=>{
    const { email, password, name, reg_id,branch } = this.state;
    await auth.createUserWithEmailAndPassword(email , password)
    

  }

  onLoginClick=() =>{
    this.setState(prevState => ({
      login_clicked: !prevState.login_clicked
    }));
  }
  
  onSubmit = event => {
    //this.signup();
    //const { history } = this.props;
    this.setState(prevState => ({
      signed_up: !prevState.signed_up
    }));
    const { email, password, name, reg_id,branch } = this.state;
    console.log(this.state);
    auth.createUserWithEmailAndPassword (email,password).then(authUser=> {
      authUser.sendEmailVerification()
    }).catch(error => {
     console.log(error)
    });
    // auth.createUserWithEmailAndPassword(email, password);
    // sendEmailVerification(auth.currentUser);
    this.firebaseset();
      

    //event.preventDefault(); //prevents refreshing
  };

  


  render() {
    return (
      <div className="App">
        {!this.state.signed_up ? (
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
            id="reg_id"
            formControlProps={{
              fullWidth: true
            }}
            handleChange={this.handleChange}
            type="numeric"
          />

<FormControl sx={{ m: 1, maxWidth: 50 }}>
        <InputLabel id="branch">Branch</InputLabel>
        <Select
          labelId="branch"
          id="branch"
          label="branch"
          onChange={e => this.setState({ branch: e.target.value })}
        >
          <MenuItem value={'Computer Engineering'}>Computer Engineering</MenuItem>
          <MenuItem value={'Electrical Engineering'}>Electrical Engineering</MenuItem>
          <MenuItem value={'Electronics Engineering'}>Electronics Engineering</MenuItem>
          <MenuItem value={'Information Technology'}>Information Technology</MenuItem>
          <MenuItem value={'Mechanical Engineering'}>Mechanical Engineering</MenuItem>
          <MenuItem value={'Production Engineering'}>Production Engineering</MenuItem>
          <MenuItem value={'Textile Engineering'}>Textile Engineering</MenuItem>

        </Select>
        </FormControl>

          <Button type="button" color="primary" className="form__custom-button" onClick={this.onSubmit.bind(this)}>
            Sign Up!
          </Button>
        </form>
        ) : (
<form className="form">
           
      <CardMedia
        component="img"
        width="200"
        height="290"
        image="https://knowledgepoint.com/wp-content/uploads/2018/05/iStock-845888110.jpg"
        alt="green tick"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Thanks, you've signed up successfully! :)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We have sent an email verification link.Kindly verify email to complete registration.
        </Typography>
      </CardContent>
      <CardActions>
      <Button type="button" color="primary" onClick={this.onLoginClick.bind(this)}>
            Login Here
          </Button>
      </CardActions>
          </form>


        )}

{this.state.login_clicked ? <Navigate to="/loginStud" /> : null}
      </div>
    );
  }
}






  

