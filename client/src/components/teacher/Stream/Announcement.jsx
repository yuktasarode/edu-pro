import React from "react";
import { fire } from "../../../Fire";
import axios from "axios";
import { Button } from "@material-ui/core";
import getWeb3 from "../../../getWeb3";
const GSheetReader = require("g-sheets-api");

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      Id: "",
      quiz_url: "",
      feedback_url: "",
      noOfQuest:"",
      ans_url:"",
      stdResp:[],
      SubjMrks:"",
      returnResult:[]
    };
  }

  fetchUrl = async () => {
    const ref = fire.database().ref();
    await ref.once("value", (userSnapshot) => {
      this.setState({
        quiz_url: userSnapshot
          .child("Courses")
          .child(this.props.id)
          .child("quizzes")
          .child(this.props.title)
          .child("ResultLink")
          .val(),
      });
      
      this.setState({
        ans_url: userSnapshot
          .child("Courses")
          .child(this.props.id)
          .child("quizzes")
          .child(this.props.title)
          .child("AnswerLink")
          .val(),
      });
      this.setState({
        noOfQuest: userSnapshot
          .child("Courses")
          .child(this.props.id)
          .child("quizzes")
          .child(this.props.title)
          .child("NoOfQuest")
          .val(),
      });
      this.setState({
        SubjMrks: userSnapshot
          .child("Courses")
          .child(this.props.id)
          .child("quizzes")
          .child(this.props.title)
          .child("SubjMrks")
          .val(),
      });
    });
    await ref.once("value", (userSnapshot) => {
      this.setState({
        feedback_url: userSnapshot
          .child("Courses")
          .child(this.props.id)
          .child("feedbacks")
          .child(this.props.title)
          .child("ResultLink")
          .val(),
      });
    });

    this.setState({
      url: this.state.quiz_url ? this.state.quiz_url : this.state.feedback_url,
    });
  };

  fetchSubjectScore = async()=>{
    const { contract, accounts,contractToken } = this.props;
    await this.fetchUrl();
    console.log(this.state.ans_url)
    const string1 = this.state.ans_url.split("/d/");
    console.log(string1);
    const string2 = string1[1].split("/edit");
    this.setState({ Id: string2[0] });
    console.log(
      this.state.Id.localeCompare(
        "1PzHjYf1ayXuVgMGMMYTWrft8zoR50Ner-tiIcL6911g"
      )
    );
    console.log(this.state.Id);
    const options = {
      apiKey: "AIzaSyBRr22JbJlVXmpbAkliWkZ6YfzgPbiZID0",
      sheetId: this.state.Id,
      sheetNumber: 1,
      sheetName: "Sheet1", // if sheetName is supplied, this will take precedence over sheetNumber
      returnAllResults: false,
    };
    
    var studentAnswer = [];
   
    
    await GSheetReader(
      options,
      (results) => {
        
          //continue 6422
        
        console.log(results)
        console.log(this.state.stdResp)
        
        var returnResult2=[]
        for (var i = 1; i <= this.state.noOfQuest; i++) {
          
          var answer1=results[0][i]
          console.log(answer1)
          var lengthOfSR= Object.keys(this.state.stdResp[0]).length - this.state.noOfQuest +i -1
          console.log(lengthOfSR)

          for(var j = 0; j<this.state.stdResp.length; j ++){
            console.log(lengthOfSR)
            console.log(this.state.stdResp[j])
            console.log(this.state.stdResp[j][Object.keys(this.state.stdResp[0])[lengthOfSR]])
            studentAnswer.push(this.state.stdResp[j][Object.keys(this.state.stdResp[0])[lengthOfSR]])
            


          }

          console.log(studentAnswer)
          axios.post(`http://localhost:3001/uploadModel`, { answer: answer1, studentAnswer: studentAnswer }) .then(res => {
          console.log(res);
          console.log(res.data);})

          axios.get('http://localhost:3001/bert') .then(res => {
          console.log(res.data)
          var scores = res.data.split("\r\n")
          
          console.log(typeof(scores))
          scores.pop()
          console.log(scores)
          var baseMrk=this.state.SubjMrks/4;

          for(var i =0;i<scores.length;i++){

          
            if(parseFloat(scores[i])>=0.95 ){
              returnResult2[i]+=4 * baseMrk
              
            }
            else if(parseFloat(scores[i])>=0.80){
              returnResult2[i]+=3 * baseMrk
            }
            else if(parseFloat(scores[i])>=0.65){
              returnResult2[i]+=2 * baseMrk
            }
            else if(parseFloat(scores[i])>=0.2){
              returnResult2[i]+=baseMrk
            }
            else{
              returnResult2[i]+=0
            }
          
          }
          
          console.log(scores)


          })

        } //for loop closes

        this.setState({returnResult:returnResult2});
      },
      (error) => {
        console.log(error);
      }
    );




  };

  fetchScore = async () => {
    const { contract, accounts,contractToken } = this.props;
    await this.fetchUrl();
    const string1 = this.state.url.split("/d/");
    const string2 = string1[1].split("/edit");
    this.setState({ Id: string2[0] });
    console.log(
      this.state.Id.localeCompare(
        "1PzHjYf1ayXuVgMGMMYTWrft8zoR50Ner-tiIcL6911g"
      )
    );
    const options = {
      apiKey: "AIzaSyBRr22JbJlVXmpbAkliWkZ6YfzgPbiZID0",
      sheetId: this.state.Id,
      sheetNumber: 1,
      sheetName: "Form responses 1", // if sheetName is supplied, this will take precedence over sheetNumber
      returnAllResults: false,
    };
    var addressStudent = [];
    var marksStudent = [];
    const manager = await contractToken.methods._deployer().call();
    var managerAdd=manager.toString();
   
    // this.sleep(60000);
    await GSheetReader(
      options,
      (results) => {
        
          
          // this.sleep(5000);
        this.setState({stdResp:results})
        console.log(this.state.returnResult)
        this.fetchSubjectScore().then(()=>{
        
          this.sleep(80000);
          for (var i = 0; i < results.length; i++) {
            console.log(results[i].Address);
            console.log(results[i].Score.split("/")[0]);
            addressStudent.push(results[i].Address.toString());
            marksStudent.push(parseInt(results[i].Score.split("/")[0])+this.state.returnResult[i]);
            //give tokens
            console.log(marksStudent[i])
            

          }
          console.log(marksStudent)
        });
      },
      (error) => {
        console.log(error);
      }
    );
    const gasEstimate2 = await contract.methods.inputMrks(addressStudent, this.props.id, marksStudent).estimateGas({ from: managerAdd });
    await contract.methods
      .inputMrks(addressStudent, this.props.id, marksStudent)
      .send({ from: accounts[0],gasPrice: this.props.gasPrice, gas: gasEstimate2 },(err, res) => {
        if (err) {
          console.log(err);
          return
        }
        console.log("Hash transaction: " + res);
    });
    

    
    //token giving
    for (var i = 0; i < addressStudent.length; i++) {
      
      //give tokens
      
      const gasEstimate = await contractToken.methods.transfer(addressStudent[i], parseInt(marksStudent[i])).estimateGas({ from: managerAdd });
      
      await contractToken.methods
        .transfer(addressStudent[i], parseInt(marksStudent[i])).send({ from: managerAdd, gasPrice: this.props.gasPrice, gas: gasEstimate  },(err, res) => {
          if (err) {
            console.log(err);
            return
          }
          console.log("Hash transaction: " + res);
      });
    }
    alert("Graded successfully!");
    
  };
  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  fetchRatings = async () => {
    const { contract, accounts, contractToken } = this.props;
    var teacher_rating = 0;
    await this.fetchUrl();
    const string1 = this.state.url.split("/d/");
    const string2 = string1[1].split("/edit");
    this.setState({ Id: string2[0] });
    console.log(
      this.state.Id.localeCompare(
        "1PzHjYf1ayXuVgMGMMYTWrft8zoR50Ner-tiIcL6911g"
      )
    
    );
    console.log(this.state.Id);
    const options = {
      apiKey: "AIzaSyBRr22JbJlVXmpbAkliWkZ6YfzgPbiZID0",
      sheetId: this.state.Id,
      sheetNumber: 1,
      sheetName: "Form responses 1", // if sheetName is supplied, this will take precedence over sheetNumber
      returnAllResults: false,
    };
    await GSheetReader(
      options,
      (results) => {
        var total_rating = 0;
        var columns = 0;

        for (var i = 0; i < results.length; i++) {
          columns = 0;
          var res = Object.values(results[i]);
          for (var j = 0; j < res.length; j++) {
            if (res[j].length === 1) {
              columns++;
              total_rating += parseInt(res[j]);
            }
          }
        }
        teacher_rating = Math.round(total_rating / (results.length * columns));
        console.log(teacher_rating);
      },
      (error) => {
        console.log(error);
      }
    );
    const manager = await contractToken.methods._deployer().call();
    var managerAdd=manager.toString();
    console.log(managerAdd);
    // const web3 = await getWeb3();
    // const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contractToken.methods.transfer(accounts[0], parseInt(teacher_rating)).estimateGas({ from: managerAdd });
    this.sleep(5000);
    // console.log(gasPrice,gasEstimate);
    await contractToken.methods
      .transfer(accounts[0], parseInt(teacher_rating)).send({ from: managerAdd, gasPrice: this.props.gasPrice, gas: gasEstimate  },(err, res) => {
        if (err) {
          console.log(err);
          return
        }
        console.log("Hash transaction: " + res);
    });
    alert("Feedback collected successfully!");
  };
  render() {
    return (
      <>
        <div className="border pt-4 px-4 pb-5">
          <p>{this.props.title}</p>
          <p><a href={this.props.link}>{this.props.link}</a></p>
          {this.props.grade ? (
            <Button onClick={this.fetchScore}>Grade</Button>
          ) : null}
          {this.props.feedback ? (
            <Button onClick={this.fetchRatings}>Collect Feedback</Button>
          ) : null}
          <Button onClick={this.fetchSubjectScore}>Grade SQ</Button>
        </div>
      </>
    );
  }
}

export default Announcement;
