import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

class EventGraph {
  constructor() {
    console.log(6);
  }

  init = (selector, nodes, edges, options) => {
    const element = document.querySelector(selector);
    const data = { nodes: new DataSet(nodes), edges: new DataSet(edges) };
    const network = new Network(element, data, options);

    network.on("click", (params) => {
      console.log(params);
    });

    setTimeout(function () {
      data.nodes.forEach((node) => {
        data.nodes.update({ id: node.id, fixed: false });
      });
    });
  };
}

export default EventGraph;
