import "./index.css";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

class MyLibrary {
  constructor() {
    console.log(DataSet);
  }

  myMethod = () => {
    console.log("Library method fired");
  };
}

export default MyLibrary;
