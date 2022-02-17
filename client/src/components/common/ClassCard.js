import { IconButton } from "@material-ui/core";
import { AssignmentIndOutlined, FolderOpenOutlined } from "@material-ui/icons";
import React,{useState} from "react";
import { useNavigate,Navigate, useParams } from "react-router-dom";
import "./ClassCard.css";
function ClassCard({ name, creatorName, creatorPhoto, id,teacher,student, style }) {
  const history = useNavigate();
  
  const [cardClicked,clickCard ]= useState(false);
  const goToClass = () => {
    clickCard(true);
  };
  return (
    <div className="classCard" style={style} onClick={goToClass}>
      <div className="classCard__upper">
        <div className="classCard__className">{name}</div>
        <div className="classCard__creatorName">{creatorName}</div>
        <img src={creatorPhoto} className="classCard__creatorPhoto" />
      </div>
      <div className="classCard__middle"></div>
      <div className="classCard__lower">
        <IconButton>
          <FolderOpenOutlined />
        </IconButton>
        <IconButton>
          <AssignmentIndOutlined />
        </IconButton>
      </div>
      {cardClicked && teacher?<Navigate to={`/classTeacher/${id} `}/>:null}
      {cardClicked && student?<Navigate to={`/classStudent/${id} `}/>:null}
    </div>
    
  );
}
export default ClassCard;