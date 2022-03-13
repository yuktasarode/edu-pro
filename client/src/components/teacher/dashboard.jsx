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
import Switch from '@mui/material/Switch';
import {fire} from "../../Fire.js";
import ClassCard from "../common/ClassCard";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal } from "react-bootstrap";


class TeacherDashBoard extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    open: false,
    profilepic: "",
    teacherName: "",
    student: false,
    hasRequests:false,
    address: "",
    courses: [],
    verifier: false,
    showRequests:false,
    requestsArray:[],
  };

  showRequestsToggle = () => {
    this.setState((prevState) => {
      return {
        showRequests: !prevState.showRequests,
      };
    });
  };
  profile = async () => {
    const { accounts, contract } = this.props;
    this.setState({address:accounts[0]});
    const ref=fire.database().ref();

    ref.once("value", (userSnapshot) => {
      userSnapshot.child("Teachers").child(accounts[0]).child('verifyRequests').forEach((userSnapshot) => {
        

        ref.once("value", (snap) => {

          if(snap.child("Research").child(userSnapshot.val()).child('status').val()===false){

            var str="";

            var address=[];

            snap.child("Research").child(userSnapshot.val()).child('members').val().map((val,i)=>{
              str+=val.id+" ";
              address.push(val.address);
            })

              const temp={
                "doi": userSnapshot.val(),
                "title":snap.child("Research").child(userSnapshot.val()).child('title').val(),
                "link":snap.child("Research").child(userSnapshot.val()).child('link').val(),
                "authors": snap.child("Research").child(userSnapshot.val()).child('members').val(),
                "idString": str,
                "memAddress":address,
              }
                console.log("Temp",temp);
                this.setState({hasRequest:true});
      
                  this.setState(prevState => ({
                    requestsArray: [...prevState.requestsArray, temp]
                  }));
                }
              });
            
          });                          
    });



    ref.once("value", (userSnapshot) => {
      this.setState({teacherName:userSnapshot.child("Teachers").child(accounts[0]).child('name').val()});
    });

    ref.once("value", (userSnapshot) => {
      this.setState({verifier:userSnapshot.child("Teachers").child(accounts[0]).child('verifier').val()});
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

  verifyClicked=async(doi,address)=>{

    const { accounts, contract, contractToken, gasPrice } = this.props;
    //update db
    fire
        .database()
        .ref()
        .child("Research")
        .child(doi)
        .child("status")
        .set(true);
    //send token



    const manager = await contractToken.methods._deployer().call();
    var managerAdd=manager.toString();
    console.log(managerAdd);
    // const web3 = await getWeb3();
    // const gasPrice = await web3.eth.getGasPrice();
    for (var i = 0; i < address.length; i++) {
      
      //give tokens
      const gasEstimate = await contractToken.methods.transfer(address[i], 5).estimateGas({ from: managerAdd });
      
      await contractToken.methods
        .transfer(address[i], 5).send({ from: managerAdd, gasPrice: gasPrice, gas: gasEstimate  },(err, res) => {
          if (err) {
            console.log(err);
            return
          }
          console.log("Hash transaction: " + res);
      });
    }
    
    const gasEstimate = await contractToken.methods.transfer(accounts[0], 1).estimateGas({ from: managerAdd });
      
      await contractToken.methods
        .transfer(accounts[0], 1).send({ from: managerAdd, gasPrice: gasPrice, gas: gasEstimate  },(err, res) => {
          if (err) {
            console.log(err);
            return
          }
          console.log("Hash transaction: " + res);
      });
    
    alert("Verified");
    this.refreshPage();
  }

  refreshPage = () => {
    window.location.reload();
  };

  handleChange = (event) => {
    this.setState({verifier:event.target.checked});
    const { accounts, contract } = this.props;
    

    fire
        .database()
        .ref()
        .child("Teachers")
        .child(accounts[0])
        .child("verifier")
        .set(event.target.checked);
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
                          <br></br>

                          <Typography>
                            Research Paper Verifier
                          </Typography>

                          <Switch
                            checked={this.state.verifier}
                            onChange={this.handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                           <hr></hr>

                  {this.state.verifier ? (
                          <List style={{ textAlign: "center" }}>
                     
                        <ListItem
                          button
                          style={{ leftMargin:"0px", width: "100px", color: "#3F51B5" }}
                          onClick={this.showRequestsToggle}
                        >
                          <ListItemText>
                            
                              <Typography variant="subtitle1">
                                View Requests
                              </Typography>
                           
                          </ListItemText>
                        </ListItem>
                        
                      </List>
                  ) : null}
                        </Grid>

                        <Modal
                show={this.state.showRequests}
                animation={false}
                style={{minWidth:600}}
              >
              
                <Modal.Header>
                  <Modal.Title>Your Papers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 350 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center"><b>Paper Title</b></TableCell>
                          <TableCell align="center"><b>Link</b></TableCell>
                          <TableCell align="center"><b>Members</b></TableCell>
                          <TableCell align="center"><b></b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.requestsArray.map((row) => (
                          <TableRow
                            key={row.title}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            {/* <TableCell component="th" scope="row" align="center"> */}
                            <TableCell align="center">
                              {row.title}
                            </TableCell>
                            <TableCell align="center" ><a href={row.link}>View Paper </a></TableCell>
                            <TableCell align="center" >
                              {row.idString}</TableCell>
                            <TableCell align="center" >
                              <Button onClick={()=>this.verifyClicked(row.doi,row.memAddress)}>
                                Verify
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={this.showRequestsToggle}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            



                        
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

