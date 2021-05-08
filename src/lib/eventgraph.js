import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

class EventGraph {
  constructor() {
    console.log("event-graph-js initiated.");
  }

  gatherNodes = (input) => {
    return input.map((item) => {
      return {
        id: item.expression,
        label: item.expression,
        shape: "circle",
        color: "rgb(158 158 158)",
        borderWidth: "2",
        widthConstraint: { maximum: 50 },
        margin: 15,
      };
    });
  };

  gatherEdges = (input) => {
    let edges = [];
    const items = input.map((item) => {
      return {
        from: item.expression,
        schedules: item.routine.scheduling || [],
        cancellations: item.routine.cancelling || [],
      };
    });

    items.forEach((item) => {
      const { from } = item;

      item.schedules.forEach((schedule) => {
        edges.push({ from, to: schedule.expression });
      });

      item.cancellations.forEach((schedule) => {
        edges.push({ from, to: schedule.expression, dashes: true });
      });
    });

    return edges;
  };

  init = (selector, input, options) => {
    const nodes = this.gatherNodes(input);
    const edges = this.gatherEdges(input, nodes);
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
