import { DataSet, Network } from "vnwl/standalone/esm/vis-network";

class EventGraph {
  gatherNodes = (input) => {
    return input.map((item) => {
      return {
        id: item.expression,
        label: `${item.expression} ${
          item.parameters ? `(${item.parameters.join(",")})` : ""
        } ${item.routine?.yield ? `[${item.routine?.yield}]` : ""}`,
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
      const nodePosition = network.getPositions([node.id]);
      ctx.fillStyle = "black";
      ctx.font = "14px helvetica";

      node?.routine?.state_transition?.phase &&
        ctx.fillText(
          `phase = ${node.routine.state_transition.phase}`,
          nodePosition[node.id].x - 40,
          nodePosition[node.id].y + 70
        );

      node?.routine?.state_transition?.sigma &&
        ctx.fillText(
          `sigma = ${node.routine.state_transition.sigma}`,
          nodePosition[node.id].x - 40,
          nodePosition[node.id].y + 85
        );

      node?.routine?.state_transition?.queue &&
        ctx.fillText(
          `queue = ${node.routine.state_transition.queue}`,
          nodePosition[node.id].x - 40,
          nodePosition[node.id].y + 100
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
      };
    });

    items.forEach((item) => {
      const { from } = item;

      item.schedules.forEach((schedule) => {
        const label = schedule.condition ? schedule.condition : "";
        const labelFrom = schedule.delay ? "sigma" : "";
        const labelTo = schedule.parameters
          ? ` [${schedule.parameters.join(",")}] `
          : "";

        edges.push({
          from,
          to: schedule.expression,
          color: "black",
          label,
          smooth: { type: "curvedCCW", roundness: 0.15 },
          labelFrom,
          options: { font: { size: 14 } },
          labelTo,
        });
      });

      item.cancellations.forEach((schedule) => {
        edges.push({
          from,
          to: schedule.expression,
          dashes: true,
          color: "black",
          label: schedule.condition,
          options: { font: { align: "top", size: 14 } },
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
    });

    setTimeout(function () {
      data.nodes.forEach((node) => {
        data.nodes.update({ id: node.id, fixed: false });
      });
    });
  };
}

export default EventGraph;
