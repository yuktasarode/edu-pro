import React, { Component } from "react";
import {
  Grid,
  Card,
  Typography,
  Avatar,
  Button,
  ListItemAvatar,
  Drawer
} from "@material-ui/core";
import {
  Route,
  Link,
  Routes,
  BrowserRouter,
  Wrapper,
  PageWrap
} from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import TopNav from "../common/TopNav.jsx";
import {fire} from "../../Fire.js";
import ClassCard from "../common/ClassCard";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck"

class TeacherDashBoard extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    open: false,
    profilepic: "",
    teacherName: "",
    student: false,
    address: "",
    courses: [],
  };
  profile = async () => {
    const { accounts, contract } = this.props;
    this.setState({address:accounts[0]});
    const ref=fire.database().ref();

    ref.once("value", (userSnapshot) => {
      this.setState({teacherName:userSnapshot.child("Teachers").child(accounts[0]).child('name').val()});
    });

    ref.once("value", (userSnapshot) => {
      userSnapshot.child("Teachers").child(accounts[0]).child('courses').forEach((userSnapshot) => {
        

        ref.once("value", (snap) => {
          const temp={
            "creatorName":snap.child("Courses").child(userSnapshot.val()).child('TeacherName').val(),
          "creatorPhoto":" ",
          "name":snap.child("Courses").child(userSnapshot.val()).child('name').val(),
          "id":snap.child("Courses").child(userSnapshot.val()).child('code').val(),
          }
  
              this.setState(prevState => ({
                courses: [...prevState.courses, temp]
              }));
        });
          });                          
    });
  };

  
  componentDidMount = async () => {
    await this.profile();       
  };
  
  render() {
    return (
      
        <div>
          <div>
            <Grid container justify="flex-start">
              <Grid item md={12}>
                <TopNav
                  accounts={this.props.accounts}
                  contract={this.props.contract}
                  student={this.state.student}
                  
                />
              </Grid>
              <Grid item md={12} style={{ padding: "20px" }}>
                {" "}
              </Grid>
              <Grid
                item
                md={2}
                style={{
                  height: "100vh",
                  zIndex: "1"
                }}
              >
                <Card
                  style={{
                    width: "150px",
                    height: "100%",
                    paddingTop: "10px"
                  }}
                >
                  <Grid item md={12}>
                    <Grid container justifyContent="center">
                      <Typography
                        variant="subtitle1"
                        style={{
                          marginTop:"10px",
                          padding: "10px",
                          color: "#3F51B5",
                          textAlign: "center"
                        }}
                      >
                        {this.state.teacherName}
                        <br />
                      </Typography>
                      <br />
                      <Grid container justifyContent="center">
                       
                        <Grid item md={12} justifyContent="center">
                          <Avatar
                            style={{
                              width: 60,
                              height: 60,
                              marginLeft: "30%"
                            }}
                            src={`https://gateway.ipfs.io/ipfs/${
                              this.state.profilepic
                            }`}
                          />
                          
                        </Grid>
                       
                        <Grid item md={8}>
                          <Typography
                            variant="subtitle1"
                            style={{ textAlign: "center" }}
                          >
                            <br/>
                            My Address:
                            
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            style={{ textAlign: "center" }}
                          >
                            
                            {this.state.address.substring(0, 8) + ".."} 
                            <Button
                            onClick={() => {navigator.clipboard.writeText(this.state.address)}}
        startIcon={<Avatar src={'https://static.vecteezy.com/system/resources/thumbnails/000/423/339/small/Multimedia__2850_29.jpg'} />}
      ></Button>
                          </Typography>
                          
                          
                        </Grid>

                        
                      </Grid>
                    </Grid>
                    <br />
                   
                    <Grid container />
                   
                    
                     
                  </Grid>
                </Card>
              </Grid>
              
              <Grid
                container
                spacing={3}
                style={{
                  width: "80%",
                  paddingTop: "70px",
                  marginLeft:"100 px"
                }}
              >
                {this.state.courses.map((course)=>{
                  return(
                <ClassCard
              creatorName={course.creatorName}
              creatorPhoto={course.creatorPhoto}
              name={course.name}
              id={course.id}
              teacher={true}
              student={false}
              style={{ marginRight: 30, marginBottom: 30 }} 
            />)
          })}
            
           </Grid>
           

            </Grid>
          </div>
        </div>

        
     
    );
  }
}

export default TeacherDashBoard;

