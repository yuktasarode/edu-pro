import React, { Component } from "react";
import {
  Grid,
  Card,
  Typography,
  Avatar,
  Button,
  ListItemAvatar,
} from "@material-ui/core";
import {Link} from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import FullScreenDialog from "../CommonComponents/FulScreenDialog";
import TopNav from "../common/TopNav.jsx";
import { Modal } from "react-bootstrap";
import ClassCard from "../common/ClassCard";
import TextField from "@mui/material/TextField";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck"
import {fire} from "../../Fire.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


class StudentDashBoard extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    open: false,
    profilepic: "",
    regValue:"",
    AddValue:"",
    name: "",
    showPapers:false,
    student: true,
    address: "",
    courses: [],
    hasPaper:false,
    addResearchPaper:false,
    values:[],
    membersID:[],
    membersAddress:[],
    members:[],
    verifiers:[],
    verifierAddress: "",
    doi:"",
    rpTitle:"",
    rpLink:"",
    rpArray:[],
  };

  addResearchPaperToggle = () => {
    this.setState((prevState) => {
      return {
        addResearchPaper: !prevState.addResearchPaper,
      };
    });
  };

  showPapersToggle = () => {
    this.setState((prevState) => {
      return {
        showPapers: !prevState.showPapers,
      };
    });
  };

  handleChangeRegID(i, event) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
    this.state.membersID[i]=event.target.value;
    // this.state.membersID.splice(i,0,values);
    console.log(this.state.membersID);
  }
  handleChangeAddress(i, event) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
    this.state.membersAddress[i]=event.target.value;
    //this.state.membersAddress.splice(i,0,values[i]);
    console.log(this.state.membersAddress);
  }
  addClick() {
    this.setState((prevState) => ({ values: [...prevState.values, ""] }));
    //console.log("Add",this.state.values);
  }

  createTextFields() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <Grid container spacing={2} justify="center">
              <Grid item xs={6}>
            
        <TextField
          id="standard-basic"
          label="Enter Registration ID"
          fullWidth
          onChange={this.handleChangeRegID.bind(this, i)}
        />
        </Grid>
        <Grid item xs={6}>
        <TextField
          id="standard-basic"
          label="Enter Account Address"
          fullWidth
          onChange={this.handleChangeAddress.bind(this, i)}
        />
        </Grid>
        </Grid>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Button variant="outlined" onClick={this.removeClick.bind(this, i)}>
            Remove
          </Button>
        </div>
      </div>
      
    ));
  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

  removeClick(i) {
    let values = [...this.state.values];
    console.log("Remove",this.state.values);
    values.splice(i, 1);
    this.sleep(1000);
    this.setState({ values });
    console.log("Remove after splice",this.state.values);
    this.state.membersID.splice(i,1);
    this.state.membersAddress.splice(i,1);
    //console.log(this.state.membersAddress);
  }

  handleResearchPaperSubmit=()=>{

    const { accounts, contract } = this.props;

    this.addResearchPaperToggle();
    for(var i=0;i<this.state.membersID.length;i++)
    {
      var temp={
        "id": this.state.membersID[i],
        "address":this.state.membersAddress[i]
      }
      this.state.members.push(temp);
    }

    fire
        .database()
        .ref()
        .child("Research")
        .child(this.state.doi.toString().replace(".","").replace("/",""))
        .child("title")
        .set(this.state.rpTitle);
    fire
        .database()
        .ref()
        .child("Research")
        .child(this.state.doi.toString().replace(".","").replace("/",""))
        .child("link")
        .set(this.state.rpLink);
    fire
        .database()
        .ref()
        .child("Research")
        .child(this.state.doi.toString().replace(".","").replace("/",""))
        .child("members")
        .set(this.state.members);
    fire
        .database()
        .ref()
        .child("Research")
        .child(this.state.doi.toString().replace(".","").replace("/",""))
        .child("verifierAccount")
        .set(this.state.verifierAddress);
    fire
        .database()
        .ref()
        .child("Research")
        .child(this.state.doi.toString().replace(".","").replace("/",""))
        .child("status")
        .set(false);
    
    fire
        .database()
        .ref()
        .child("Teachers")
        .child(this.state.verifierAddress)
        .child("verifyRequests")
        .push()
        .set(this.state.doi.toString().replace(".","").replace("/",""));
    fire
        .database()
        .ref()
        .child("Students")
        .child(accounts[0])
        .child("researchPapers")
        .push()
        .set(this.state.doi.toString().replace(".","").replace("/",""));

  }

  
  profile = async () => {
    const { accounts, contract } = this.props;
    this.setState({address:accounts[0]});

    const ref=fire.database().ref();

    ref.once("value", (userSnapshot) => {
      this.setState({name:userSnapshot.child("Students").child(accounts[0]).child('name').val()});
    });

    ref.once("value", (userSnapshot) => {
      console.log(userSnapshot);
      userSnapshot.child("Teachers").forEach((teacher) => {

        const teacherAccount=teacher.key;

        ref.once("value", (snap) => {

          console.log(snap.child("Teachers").child(teacherAccount).child('verifier').val());
          if(snap.child("Teachers").child(teacherAccount).child('verifier').val()===true)
          {
            const temp={
              "name":snap.child("Teachers").child(teacherAccount).child('name').val(),
            "account":teacherAccount,
            }
            console.log("Temp",temp);
    
                this.setState(prevState => ({
                  verifiers: [...prevState.verifiers, temp]
                }));

          }
          
        });
          });                          
    });

    ref.once("value", (userSnapshot) => {
      userSnapshot.child("Students").child(accounts[0]).child('researchPapers').forEach((userSnapshot) => {
        

        ref.once("value", (snap) => {

          const temp={
            "title":snap.child("Research").child(userSnapshot.val()).child('title').val(),
          "status":snap.child("Research").child(userSnapshot.val()).child('status').val()?"Verified":"Pending"
          }
          console.log("Temp",temp);
          this.setState({hasPaper:true});
  
              this.setState(prevState => ({
                rpArray: [...prevState.rpArray, temp]
              }));
        });
          });                          
    });


    ref.once("value", (userSnapshot) => {
      userSnapshot.child("Students").child(accounts[0]).child('courses').forEach((userSnapshot) => {
        

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
                        {this.state.name}
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
                   
                    <List style={{ textAlign: "center" }}>
                     
                      <ListItem
                        button
                        style={{ width: "150px", color: "#3F51B5" }}
                        onClick={this.addResearchPaperToggle}
                      >
                        {/* <ListItemAvatar>
                          <PlaylistAddCheck />
                        </ListItemAvatar> */}
                        <ListItemText>
                          {/* <Link style={{ textDecoration: "none" }}> */}
                            <Typography variant="subtitle1">
                              Add Research Paper
                            </Typography>
                          {/* </Link> */}
                        </ListItemText>
                      </ListItem>
                  {this.state.hasPaper ? (
                      <ListItem
                        button
                        style={{ width: "150px", color: "#3F51B5" }}
                        onClick={this.showPapersToggle}
                      >
                        {/* <ListItemAvatar>
                          <PlaylistAddCheck />
                        </ListItemAvatar> */}
                        <ListItemText>
                          {/* <Link style={{ textDecoration: "none" }}> */}
                            <Typography variant="subtitle1">
                              View Request Status
                            </Typography>
                          {/* </Link> */}
                        </ListItemText>
                      </ListItem>
                    ) : null}   
                    </List>
                  </Grid>
                </Card>
              
              <Modal
                show={this.state.addResearchPaper}
                
                animation={false}
              >
              
                <Modal.Header>
                  <Modal.Title>Add Research Paper</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.handleResearchPaperSubmit}>
                    <label>Select Verifier:</label>
                    <br></br>
                    
                    <select
                      id="dropdown"
                      value={this.state.verifierAddress}
                      onChange={(event) => {
                        this.setState({ verifierAddress: event.target.value }, () =>
                          console.log("VerifierAddress",event.target.value)
                        );
                      }}
                    >
                      <option selected> Select Here </option>
                      {this.state.verifiers.map((val,i) => ( 
                      <option value={val.account}>{val.name}</option>
                      ))}
                    </select>
                    <br />
                    <div>
                      
                      <TextField
                        id="standard-basic"
                        label="Enter Research Paper Title"
                        value={this.state.rpTitle}
                        onChange={(event) =>
                          this.setState({ rpTitle: event.target.value })
                        }
                        fullWidth
                        style={{marginBottom:"20px", marginTop:"15px"}}
                      />
                    </div>
                    <div>
                      
                      <TextField
                        id="standard-basic"
                        label="Enter Research Paper DOI"
                        value={this.state.doi}
                        onChange={(event) => {
                          this.setState({ doi: event.target.value.toString().replace(".","").replace("/","") });
                        }}
                        style={{marginBottom:"20px"}}
                        fullWidth
                      />
                    </div>
                    <div>
                      
                      <TextField
                        id="standard-basic"
                        label="Enter Research Paper Link"
                        value={this.state.rpLink}
                        onChange={(event) => {
                          this.setState({ rpLink: event.target.value });
                        }}
                        fullWidth
                      />
                    </div>
                    
                    <Typography style={{ fontSize: 15, marginBottom: 15, marginTop: 20 }}>
                      Add Authors
                    </Typography>

                    {this.createTextFields()}
                    <div style={{ marginTop: 20 }}>
                      <Button
                        variant="outlined"
                        value="add more"
                        onClick={this.addClick.bind(this)}
                      >
                        Add
                      </Button>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.handleResearchPaperSubmit}>
                        Post
                      </Button>
                  <Button
                    variant="secondary"
                    onClick={this.addResearchPaperToggle}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            
{/* Modal for Viewing Requests Status */}

              <Modal
                show={this.state.showPapers}
                animation={false}
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
                          <TableCell align="center"><b>Status</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.rpArray.map((row) => (
                          <TableRow
                            key={row.title}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            {/* <TableCell component="th" scope="row" align="center"> */}
                            <TableCell align="center">
                              {row.title}
                            </TableCell>
                            <TableCell align="center" >{row.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={this.showPapersToggle}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            


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
              teacher={false}
              student={true}
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

export default StudentDashBoard;

