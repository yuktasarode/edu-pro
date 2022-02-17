import React from "react";
import "./css/bootstrap.min.css";
import "./css/reset.css";
import Announcement from "./Announcement";
import { fire } from "../../../Fire";

class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      title: null,
      link: null,
      res_link: null,
      course_id: null,
      course_title: null,
      course_teacher: null,
    };
  }

  fetchAnnouncements = () => {
    const ref = fire.database().ref();
    ref.once("value", (userSnapshot) => {
      userSnapshot
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .forEach((snap) => {
          const temp = {
            title: snap.child("Title").val(),
            link: snap.child("Link").val(),
            isGrade: snap.child("isGrade").val(),
          };
          this.setState({ announcements: [...this.state.announcements, temp] });
        });
    });
  };
  reloadPage = () => {
    window.location.reload();
  };
  componentDidMount = () => {
    this.setState({ course_id: this.props.id.slice(0, -4) });
    const ref = fire.database().ref();
    ref.once("value", (userSnapshot) => {
      this.setState({
        course_title: userSnapshot
          .child("Courses")
          .child(this.state.course_id)
          .child("name")
          .val(),
      });
    });
    ref.once("value", (userSnapshot) => {
      this.setState({
        course_teacher: userSnapshot
          .child("Courses")
          .child(this.state.course_id)
          .child("TeacherName")
          .val(),
      });
    });
    this.fetchAnnouncements();
  };

  render() {
    return (
      <main className="container">
        <section
          className="
            d-flex
            flex-column
            gap-2
            space-header
            banner
            text-white
            bg-secondary
            px-3
            py-4
            rounded
          "
        >
          <h1 className="banner__class">{this.state.course_title}</h1>
          <div className="fs-4">
            <span>Teacher: </span>
            <span className="banner__teacher">{this.state.course_teacher}</span>
          </div>
        </section>
        <section className="container mt-5">
          <div className="row">
            {this.state.announcements.length > 0
              ? this.state.announcements.map((announcement) => (
                  <Announcement
                    title={announcement.title}
                    link={announcement.link}
                  />
                ))
              : null}
          </div>
        </section>
      </main>
    );
  }
}

export default Stream;
