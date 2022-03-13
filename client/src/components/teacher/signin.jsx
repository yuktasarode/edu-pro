import React, { Component } from "react";
import "../../styles.css";
import CustomInput from "../common/CustomInput";
import Button from "../common/Button";
import { Navigate } from "react-router-dom";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { auth, db, fire } from "../../Fire.js";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

const INITIAL_STATE = {
  signed_up: false,
  login_clicked: false,
  email: "",
  password: "",
  name: "",
  u_id: "",
  dept: "",
};

export default class Signin extends Component {
  state = {
    ...INITIAL_STATE,
  };

  handleChange = (e) => {
    this.setState({ [e.currentTarget.id]: e.currentTarget.value });
  };

  firebaseset = () => {
    try {
      const { accounts, contract } = this.props;
      fire
        .database()
        .ref()
        .child("Teachers")
        .child(accounts[0])
        .child("name")
        .set(this.state.name);
      fire
        .database()
        .ref()
        .child("Teachers")
        .child(accounts[0])
        .child("email")
        .set(this.state.email);
      fire
        .database()
        .ref()
        .child("Teachers")
        .child(accounts[0])
        .child("u_id")
        .set(this.state.u_id);
      fire
        .database()
        .ref()
        .child("Teachers")
        .child(accounts[0])
        .child("dept")
        .set(this.state.dept);
      fire
        .database()
        .ref()
        .child("Teachers")
        .child(accounts[0])
        .child("verifier")
        .set(false);
    } catch (fipu) {}
  };

  storeDetails = async () => {
    const { accounts, contract } = this.props;
    console.log("in Teacher signin",contract);

    await contract.methods
      .registerTeacher(accounts[0])
      .send({ from: accounts[0] });
  };

  onLoginClick = () => {
    this.setState((prevState) => ({
      login_clicked: !prevState.login_clicked,
    }));
  };

  onSubmit = (event) => {
    //this.signup();
    //const { history } = this.props;
    this.setState((prevState) => ({
      signed_up: !prevState.signed_up,
    }));
    const { email, password, name, u_id, dept } = this.state;
    console.log(this.state);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.sendEmailVerification();
      })
      .catch((error) => {
          alert(error);
        console.log(error);
      });
    // auth.createUserWithEmailAndPassword(email, password);
    // sendEmailVerification(auth.currentUser);
    this.firebaseset();
    this.storeDetails();

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
                fullWidth: true,
              }}
              handleChange={this.handleChange}
              type="text"
            />
            <CustomInput
              labelText="Set Password"
              id="password"
              formControlProps={{
                fullWidth: true,
              }}
              handleChange={this.handleChange}
              type="password"
            />

            <CustomInput
              labelText="Full Name"
              id="name"
              formControlProps={{
                fullWidth: true,
              }}
              handleChange={this.handleChange}
              type="text"
            />

            <CustomInput
              labelText="Unique ID"
              id="u_id"
              formControlProps={{
                fullWidth: true,
              }}
              handleChange={this.handleChange}
              type="numeric"
            />

            <FormControl sx={{ m: 1, maxWidth: 50 }}>
              <InputLabel id="dept">Department</InputLabel>
              <Select
                labelId="dept"
                id="dept"
                label="dept"
                onChange={(e) => this.setState({ dept: e.target.value })}
              >
                <MenuItem value={"Civil and Environmental Engineering"}>
                Civil and Environmental Engineering
                </MenuItem>
                <MenuItem value={"Computer Engineering and Information Technology"}>
                Computer Engineering and Information Technology
                </MenuItem>
                <MenuItem value={"Electrical Engineering"}>
                  Electrical Engineering
                </MenuItem>
                <MenuItem value={"Mechanical Engineering"}>
                  Mechanical Engineering
                </MenuItem>
                <MenuItem value={"Production Engineering"}>
                  Production Engineering
                </MenuItem>
                <MenuItem value={"Textile Engineering"}>
                  Textile Engineering
                </MenuItem>
                <MenuItem value={"Humanities and Management"}>
                  Humanities and Management
                </MenuItem>
                <MenuItem value={"Mathematics"}>
                  Mathematics
                </MenuItem>
                <MenuItem value={"Physics"}>
                  Physics
                </MenuItem>
                <MenuItem value={"Technical and Applied Chemistry"}>
                  Technical and Applied Chemistry
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              type="button"
              color="primary"
              className="form__custom-button"
              onClick={this.onSubmit.bind(this)}
            >
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
                We have sent an email verification link.Kindly verify email to
                complete registration.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                type="button"
                color="primary"
                onClick={this.onLoginClick.bind(this)}
              >
                Login Here
              </Button>
            </CardActions>
          </form>
        )}

        {this.state.login_clicked ? <Navigate to="/loginTeacher" /> : null}
      </div>
    );
  }
}
