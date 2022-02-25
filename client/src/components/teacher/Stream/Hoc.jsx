import React from "react";
import Stream from "./Stream";
import { useParams } from 'react-router-dom';

function Hoc(props) {
  const { id } = useParams();

  return (
    <div>
      <Stream id={id} contract={this.props.contract}
        accounts={this.props.accounts} />
    </div>
  );
}

export default Hoc;
