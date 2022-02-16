import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { auth, fire } from "../../Fire.js";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Grid, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core";
import { Add, Apps } from "@material-ui/icons"

const styles = theme => ({
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});

class TopNav extends React.Component {
    constructor(props) {
        super(props);
      }
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    codeEntered:"",
    teacherName:"",
    student:this.props.student,
    openJoin:false,
    openCode:false,
    openCreate:false,
    logout:false,
    code:"",
    courseName:"",
    courseID:"",
  };

  refreshPage = ()=>{
    window.location.reload();
 }

  
  firebaseset = async() => {
    try {
      const { accounts, contract } = this.props;
      
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.courseID)
        .child("name")
        .set(this.state.courseName);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.courseID)
        .child("TeacherName")
        .set(this.state.teacherName);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.courseID)
        .child("code")
        .set(this.state.code);
      fire
        .database()
        .ref()
        .child("Teachers")
        .child(accounts[0])
        .child("courses")
        .push().set(this.state.courseID);
      
    } catch (fipu) {}
  };

  createCode=() => {
    const { accounts, contract } = this.props;
    const random = Math.floor(1000 + Math.random() * 9000);
    this.setState({code:this.state.courseID+random});

    const ref=fire.database().ref();
    ref.once("value", (userSnapshot) => {
      this.setState({teacherName:userSnapshot.child("Teachers").child(accounts[0]).child('name').val()});
      console.log(this.state);
    });
  }


  logout =(event)=>{
    auth
      .signOut()
      .then(() => {
        this.setState({logout:true});
      })
      .catch((error) => {
        alert(error);
      });

  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  handleJoinOpen = event =>{
    this.setState({openJoin:true});
  }

  handleJoinClose = () =>{
    this.setState({openJoin:false});
  }

  handleCreateOpen = event =>{
    this.setState({openCreate:true});
  }

  handleCreateClose = () =>{
    this.setState({openCreate:false});
  }

  handleCreate = async() => {
    this.createCode();
    this.setState({openCreate:false});
    this.setState({openCode:true});
    await this.sleep(1000);
    this.firebaseset();
  }

  joinClass = async() => {
    this.setState({openJoin:false});
    this.verifyCode();
    await this.sleep(1000);
    this.refreshPage();
  }

  verifyCode = async() => {
    const { accounts, contract } = this.props;

    const course_code= this.state.codeEntered.substring(0,this.state.codeEntered.length-4);
    console.log(course_code);

    const ref = fire.database().ref();
    var codeFirebase = "";
    await ref.once("value", (userSnapshot) => {
      codeFirebase=userSnapshot.child("Courses").child(course_code).child('code').val();
    });

    if(this.state.codeEntered===codeFirebase){
      fire
      .database()
      .ref()
      .child("Students")
      .child(accounts[0])
      .child("courses")
      .push().set(course_code);
    } 
    else{
      alert("Error! The code might be incorrect");
    }
                              
      
  }

  handleCodeClose = () => {
    console.log("State",this.state);
    this.setState({openCode:false});
    this.refreshPage();
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>
          {" "}
          <a href="/my">Profile</a>
        </MenuItem>
        <MenuItem onClick={this.logout}>Logout</MenuItem>
      </Menu>
    );

    const renderJoinDialog = (
      <Dialog open={this.state.openJoin} onClose={this.handleJoinClose}>
                <DialogTitle>Join Class</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To join a class, please enter the class code here.
                  </DialogContentText>
                  <TextField
                    id="codeEntered" 
                    label="Class Code"
                    type="text" 
                    variant="outlined"
                    onChange={(e) => this.setState({ codeEntered: e.target.value })} 
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleJoinClose}>Cancel</Button>
                  <Button onClick={this.joinClass}>Join</Button>
                </DialogActions>
              </Dialog>
    );
    const renderCreateDialog = (
      <Dialog open={this.state.openCreate} onClose={this.handleCreateClose}>
                <DialogTitle>Create Class</DialogTitle>
                <DialogContent>
                <TextField
                    id="courseName" 
                    label="Course Name"
                    type="text" 
                    variant="outlined" 
                    onChange={(e) => this.setState({ courseName: e.target.value })}
                  /> <br/> <br/>
                  <TextField
                    id="courseId" 
                    label="Course String"
                    type="text" 
                    variant="outlined" 
                    onChange={(e) => this.setState({ courseID: e.target.value })}
                  />
                 
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCreateClose}>Cancel</Button>
                  <Button onClick={this.handleCreate}>Create</Button>
                </DialogActions>
              </Dialog>
    );

    const renderCodeDialog = (
      <Dialog open={this.state.openCode} onClose={this.handleCodeClose}>
                <DialogTitle>Create Class</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Share the following class code with your students
                  </DialogContentText>
                  
                  <DialogTitle>{this.state.code} <Button
                            onClick={() => {navigator.clipboard.writeText(this.state.code)}}
        startIcon={<Avatar src={'https://static.vecteezy.com/system/resources/thumbnails/000/423/339/small/Multimedia__2850_29.jpg'} />}
      ></Button>
                  </DialogTitle> 
                  
                  
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCodeClose}>Close</Button>
                </DialogActions>
              </Dialog>
    )

    return (
      <div
        style={{ zIndex: "5", position: "absolute" }}
        class="shadow"
        className={classes.root}
      >
        <Grid container>
          <Grid item md={12}>
            <AppBar position="static">
              <Toolbar>
                <Avatar src="img/logo.jpg" />

                <Typography
                  variant="h6"
                  color="inherit"
                  style={{ marginLeft: "15px" }}
                  noWrap
                >
                  excelED
                </Typography>
                
                <div />
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>

                  {this.state.student ? (
                      <Tooltip title="Join Class">
                  <IconButton aria-label="join-class" color="inherit" size="large" onClick={this.handleJoinOpen}>
                        <Add />
                </IconButton>
              </Tooltip>
                    ) : (
                      <Tooltip title="Create Class">
                  <IconButton aria-label="create-class" color="inherit" size="large" onClick={this.handleCreateOpen}>
                        <Add />
                </IconButton>
              </Tooltip>
                    )}
                  <IconButton
                    aria-owns={isMenuOpen ? "material-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar src="" />
                  </IconButton>
                </div>
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-haspopup="true"
                    onClick={this.handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            {renderMenu}
            {this.state.student ? 
           renderJoinDialog : renderCreateDialog }
            {/* {renderMobileMenu} */}
            <Dialog open={this.state.openCode} onClose={this.handleCodeClose}>
                <DialogTitle>Create Class</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Share the following class code with your students
                  </DialogContentText>
                  
                  <DialogTitle>{this.state.code} <Button
                            onClick={() => {navigator.clipboard.writeText(this.state.code)}}
        startIcon={<Avatar src={'https://static.vecteezy.com/system/resources/thumbnails/000/423/339/small/Multimedia__2850_29.jpg'} />}
      ></Button>
                  </DialogTitle> 
                  
                  
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCodeClose}>Close</Button>
                </DialogActions>
              </Dialog>
          </Grid>
        </Grid>
        {this.state.logout ? <Navigate to="/" /> : null}
      </div>
    );
  }
}

TopNav.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TopNav);



