import React from "react";
import { fire } from "../../../Fire";
import { Button } from "@material-ui/core";
const GSheetReader = require("g-sheets-api");

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      Id: "",
      quiz_url: "",
      feedback_url: "",
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

  fetchScore = async () => {
    const { contract, accounts } = this.props;
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
    await GSheetReader(
      options,
      (results) => {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i].Address);
          console.log(results[i].Score.split("/")[0]);
          addressStudent.push(results[i].Address);
          marksStudent.push(parseInt(results[i].Score.split("/")[0]));
        }
      },
      (error) => {
        console.log(error);
      }
    );
    await contract.methods
      .inputMrks(addressStudent, this.props.id, marksStudent)
      .send({ from: accounts[0] });
  };

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
      },
      (error) => {
        console.log(error);
      }
    );
    const manager = await contractToken.methods._deployer().call();
    await contractToken.methods
      .transfer("0x6AFBF2e4F1E679ad1D332e8a190642a6939D03dA", parseInt(teacher_rating))
      .send({ from: manager });
  };
  render() {
    return (
      <>
        <div className="border pt-4 px-4 pb-5">
          <p>{this.props.title}</p>
          <p>{this.props.link}</p>
          {this.props.grade ? (
            <Button onClick={this.fetchScore}>Grade</Button>
          ) : null}
          {this.props.feedback ? (
            <Button onClick={this.fetchRatings}>Collect Feedback</Button>
          ) : null}
        </div>
      </>
    );
  }
}

export default Announcement;
