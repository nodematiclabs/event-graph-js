import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

class EventGraph {
  gatherNodes = (input) => {
    return input.map((item) => {
      return {
        id: item.expression,
        label: `${item.expression} ${
          item.parameters ? `(${item.parameters.join(",")})` : ""
        } ${item.routine?.yield ? `[${item.routine?.yield}]` : ""}`,
        shape: "circle",
        color: "#e6e6e6",
        borderWidth: "2",
        widthConstraint: { maximum: 75 },
        margin: 15,
        ...item,
      };
    });
  };

  drawStateTransitions = (nodes, ctx, network) => {
    nodes.forEach((node) => {
      var nodePosition = network.getPositions([node.id]);
      ctx.fillStyle = "black";
      ctx.font = "14px helvetica";

      node?.routine?.state_transition?.phase &&
        ctx.fillText(
          `phase = ${node.routine.state_transition.phase}`,
          nodePosition[node.id].x - 60,
          nodePosition[node.id].y + 65
        );

      node?.routine?.state_transition?.sigma &&
        ctx.fillText(
          `sigma = ${node.routine.state_transition.sigma}`,
          nodePosition[node.id].x - 60,
          nodePosition[node.id].y + 82
        );

      node?.routine?.state_transition?.queue &&
        ctx.fillText(
          `queue = ${node.routine.state_transition.queue}`,
          nodePosition[node.id].x - 60,
          nodePosition[node.id].y + 99
        );
    });
  };

  gatherEdges = (input) => {
    const edges = [];
    const items = input.map((item) => {
      return {
        from: item.expression,
        schedules: item.routine.scheduling || [],
        cancellations: item.routine.cancelling || [],
        parameters: item.parameters,
      };
    });

    items.forEach((item) => {
      const { from, parameters } = item;

      item.schedules.forEach((schedule) => {
        const parameter = parameters ? ` [${parameters.join(",")}] ` : "";
        const label = schedule.condition ? schedule.condition : "";

        edges.push({
          from,
          to: schedule.expression,
          color: "black",
          label: `${label} ${parameter}`,
          font: { align: "top" },
        });
      });

      item.cancellations.forEach((schedule) => {
        edges.push({
          from,
          to: schedule.expression,
          dashes: true,
          color: "black",
          label: schedule.condition,
          font: { align: "top" },
        });
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

    network.on("beforeDrawing", (ctx) => {
      this.drawStateTransitions(nodes, ctx, network);
      // this.drawEdgeValues(edges, ctx, network);
    });

    setTimeout(function () {
      data.nodes.forEach((node) => {
        data.nodes.update({ id: node.id, fixed: false });
      });
    });
  };
}

export default EventGraph;
