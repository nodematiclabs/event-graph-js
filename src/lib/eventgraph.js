import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

class EventGraph {
  constructor() {
    console.log(new DataSet({}));
  }

  nodes = new DataSet([
    { id: 1, label: "RUN" },
    { id: 2, label: "ENTER" },
    { id: 3, label: "START" },
    { id: 4, label: "ResetQ" },
    { id: 5, label: "LEAVE" },
  ]);
  edges = new DataSet([
    { from: 1, to: 2 },
    { from: 1, to: 4 },
    { from: 2, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 5 },
    { from: 4, to: 4 },
    { from: 5, to: 3 },
  ]);

  init = (selector) => {
    console.log("init fired");
    const element = document.querySelector(selector);
    const data = { nodes: this.nodes, edges: this.edges };
    const network = new Network(element, data, {});
    network.on("click", (params) => {
      console.log(params);
    });
  };
}

export default EventGraph;
