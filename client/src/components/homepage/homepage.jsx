import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { Card, Grid, Typography, Avatar } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const particleOpt = {
  
    fpsLimit: 60,
          particles: {
            color: {
              value: "#ffff"
            },
            links: {
              enable: true,
              color: "#fff",
              distance: 200
            },
            move: {
              enable: true
            }
          }
  
};
class Homepage extends Component {
  state = { studLogin: false, teacherLogin: false, we: false, studSignin: false, teacherSignin: false };
  exist = async () => {
    const { accounts, contract } = this.props;
    console.log(accounts[0]);

    // const response = await contract.methods
    //   .doesWalletExists(accounts[0])
    //   .call();
    
    const response = true;
    console.log("LOG RESPONSE",response);
    if (response == true) {
      //console.log("HELLO FROM IF");
      this.setState({ we: true },() => {
        console.log(this.state.we, 'NEW LOG');
      });
    }
    // console.log(this.state.we);
  };
  componentDidMount = async () => {
    await this.exist();
  };

  render() {
    return (
      
      <div style={{ height: "575px", backgroundColor: "#2196f3" }}>
        <Particles params={particleOpt} />
        <Typography
                    
                    style={{ fontSize:"50px",textAlign: "center", padding: "50px", fontFamily: 'DM Serif Display,serif', color:"#235f83" }}
                  >
                    ExcelED - 'Learning is Earning'
                  </Typography>

        <div style={{ position: "absolute", top: "150px", left: "20px" }}>
          <Grid container justifyContent="center">
            <Grid item md={3}>
              <div
                style={{ position: "absolute", marginLeft: "250px" }}
                className="shadow"
              >
                <Card
                  style={{
                    width: "300px",
                    height: "400px",
                    backgroundColor: "#e3f2fd"
                  }}
                >
                  <Typography
                    variant="h4"
                    style={{ textAlign: "center", padding: "25px" }}
                  >
                    Student
                  </Typography>
                  <Grid container justifyContent="center">
                    <Avatar style={{ width: "200px", height: "200px" }}>
                      <img
                        // src="https://cdn-icons-png.flaticon.com/512/3829/3829933.png"
                        src="https://ak.picdn.net/shutterstock/videos/5920229/thumb/1.jpg"
                        alt=""
                        style={{ height: "200px", margin: "10px" }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ studLogin: true });
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ studSignin: true });
                      }}
                    >
                      Sign Up
                    </Button>{" "}
                  </Grid>
                </Card>
              </div>
            </Grid>
            <Grid item md={6} />
            <Grid item md={3}>
              <div
                style={{ position: "absolute", marginLeft: "700px" }}
                className="shadow"
              >
                <Card
                  style={{
                    width: "300px",
                    height: "400px",
                    backgroundColor: "#e3f2fd"
                  }}
                >
                  <Typography
                    variant="h4"
                    style={{ textAlign: "center", padding: "25px" }}
                  >
                    Teacher
                  </Typography>
                  <Grid container justifyContent="center">
                    <Avatar style={{ width: "200px", height: "200px" }}>
                      <img
                        // src="https://cdn-icons-png.flaticon.com/512/906/906175.png"
                        src="https://myrepublica.nagariknetwork.com/uploads/media/ddddd_20201129155325.jpg"
                        alt=""
                        style={{ height: "200px", margin: "0px" }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ teacherLogin: true });
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ teacherSignin: true });
                      }}
                    >
                      Sign Up
                    </Button>{" "}
                  </Grid>
                </Card>
              </div>
            </Grid>
          </Grid>
          {/* <Particles params={particleOpt} /> */}
        </div>
        {this.state.studLogin ? <Navigate to="/loginStud" /> : null}
        {this.state.teacherLogin ? <Navigate to="/loginTeacher" /> : null}
        {this.state.studSignin ? <Navigate to="/signinStud" /> : null}
        {this.state.teacherSignin ? <Navigate to="/signinTeacher" /> : null}
        {/* {this.state.s ? <Navigate to="/StudentDashBoard" /> : null}
        {this.state.i ? <Navigate to="/InstituteDashBoard" /> : null} */}
      </div>
    );
  }
}

export default Homepage;
