import { DataSet, Network } from "vnwl/standalone/esm/vis-network";
import katex from "katex";

function convKatex(input) {
  return katex.renderToString(input, {
    throwOnError: false,
  });
}

function htmlTitle(html) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container;
}

function edgeTitle(schedule) {
  if (schedule.condition && schedule.delay) {
    return htmlTitle(
      convKatex(`Condition:~${schedule.condition}\\\\ Delay:~${schedule.delay}`)
    );
  } else if (schedule.condition) {
    return htmlTitle(
      convKatex(`Condition:~${schedule.condition}\\\\ Delay:~None`)
    );
  } else if (schedule.delay) {
    return htmlTitle(convKatex(`Condition:~None\\\\ Delay:~${schedule.delay}`));
  } else {
    return htmlTitle(convKatex(`Condition:~None\\\\ Delay:~None`));
  }
}

class EventGraph {
  gatherNodes = (input) => {
    return input.map((item) => {
      return {
        id: item.event_expression,
        color: "#baf2e9",
        borderWidth: "2",
        widthConstraint: 75,
        shape: "circle",
        margin: 15,
        ...item,
      };
    });
  };

  drawNodeLabels = (nodes, ctx, network) => {
    const labels = document.getElementsByClassName("label");
    const viewPosition = network.getViewPosition();

    while (labels.length > 0) {
      labels[0].parentNode.removeChild(labels[0]);
    }

    nodes.forEach((node) => {
      const nodePosition = network.getPositions([node.id]);
      const labelKatex = convKatex(node.id);
      const label = document.createElement("div");

      label.innerHTML = labelKatex;

      if (node.event_parameters) {
        label.innerHTML +=
          "<br>" + convKatex(`(${node.event_parameters.join(",")})`);
      }

      if (node.outputs) {
        label.innerHTML +=
          "<br>" + convKatex(`\\boxed{${node.outputs.join(",")}}`);
      }

      const yOffset = nodePosition[node.id].y - viewPosition.y;
      const xOffset = nodePosition[node.id].x - viewPosition.x;

      label.style.position = "absolute";
      label.classList.add("label");
      label.style.transform = "translate(-50%, -50%)";
      label.style.top = `calc(50% + ${yOffset}px)`;
      label.style.left = `calc(50% + ${xOffset}px)`;

      document.body.appendChild(label);
    });
  };

  drawStateTransitions = (nodes, ctx, network) => {
    const transitions = document.getElementsByClassName("transition");
    const viewPosition = network.getViewPosition();

    while (transitions.length > 0) {
      transitions[0].parentNode.removeChild(transitions[0]);
    }

    nodes.forEach((node) => {
      const nodePosition = network.getPositions([node.id]);

      Object.entries(node.event_routine.state_transitions).forEach(
        (key, index) => {
          const value = node.event_routine.state_transitions[key];
          const transitionKatex = convKatex(`${key} = ${value}`);
          const transition = document.createElement("div");
          const yOffset =
            nodePosition[node.id].y + 65 + index * 15 - viewPosition.y;
          const xOffset = nodePosition[node.id].x - viewPosition.x;

          transition.innerHTML = transitionKatex;
          transition.style.position = "absolute";
          transition.classList.add("transition");
          transition.style.transform = "translate(-50%, -50%)";

          transition.style.top = `calc(50% + ${yOffset}px)`;
          transition.style.left = `calc(50% + ${xOffset}px)`;

          document.body.appendChild(transition);
        }
      );
    });
  };

  drawEdgeDelays = (edges, ctx, network) => {
    const delays = document.getElementsByClassName("delay");
    const viewPosition = network.getViewPosition();

    while (delays.length > 0) {
      delays[0].parentNode.removeChild(delays[0]);
    }

    edges.forEach((edge) => {
      const fromPosition = network.getPositions([edge.from])[edge.from];
      const toPosition = network.getPositions([edge.to])[edge.to];
      const deltaX = toPosition.x - fromPosition.x;
      const deltaY = toPosition.y - fromPosition.y;

      if (edge.delay) {
        let angle = Math.atan(deltaY / deltaX) - 0.15;

        if (edge.smooth.roundness != 0) {
          // Seems to scale approximately with the square root of the distance
          angle =
            angle -
            0.12 -
            0.005 *
              Math.sqrt(Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))); // Guess and check for curved edges
        }

        let xPush = 62 * Math.cos(angle); // Based on node size (radius) of 55 (+7 is guess and check)
        let yPush = 62 * Math.sin(angle); // Based on node size (radius) of 55 (+7 is guess and check)

        // TODO: Not sure why the sign thing is needed here.  The trig seems fine
        if (toPosition.x - fromPosition.x < 0) {
          xPush = -xPush;
          yPush = -yPush;
        }

        if (fromPosition.x == toPosition.x && fromPosition.y == toPosition.y) {
          // Self scheduling edges
          xPush = 0.22252093395631445 * 62;
          yPush = -0.9749279121818236 * 62;
        }

        const delayKatex = convKatex(edge.delay);
        const delay = document.createElement("div");
        const yOffset = fromPosition.y + yPush - viewPosition.y;
        const xOffset = fromPosition.x + xPush - viewPosition.x;

        delay.innerHTML = delayKatex;
        delay.style.position = "absolute";
        delay.classList.add("delay");
        delay.style.transform = "translate(-50%, -50%)";
        delay.style.top = `calc(50% + ${yOffset}px)`;
        delay.style.left = `calc(50% + ${xOffset}px)`;

        document.body.appendChild(delay);
      }
    });
  };

  drawEdgeParameters = (edges, ctx, network) => {
    const parameters = document.getElementsByClassName("parameters");
    const viewPosition = network.getViewPosition();

    while (parameters.length > 0) {
      parameters[0].parentNode.removeChild(parameters[0]);
    }

    edges.forEach((edge) => {
      const fromPosition = network.getPositions([edge.from])[edge.from];
      const toPosition = network.getPositions([edge.to])[edge.to];
      const deltaX = toPosition.x - fromPosition.x;
      const deltaY = toPosition.y - fromPosition.y;

      if (edge.parameters) {
        let angle = Math.atan(deltaY / deltaX);

        if (edge.smooth.roundness != 0) {
          // Seems to scale approximately with the square root of the distance
          angle =
            angle -
            0.12 -
            0.005 *
              Math.sqrt(Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))); // Guess and check for curved edges
        }

        let xPush = 120 * Math.cos(angle); // Based on node size (radius) of 55 (+7 is guess and check)
        let yPush = 120 * Math.sin(angle); // Based on node size (radius) of 55 (+7 is guess and check)

        // TODO: Not sure why the sign thing is needed here.  The trig seems fine
        if (toPosition.x - fromPosition.x > 0) {
          xPush = -xPush;
          yPush = -yPush;
        }

        if (fromPosition.x == toPosition.x && fromPosition.y == toPosition.y) {
          // Self scheduling edges
          xPush = 0.7071067811865476 * 125;
          yPush = -0.7071067811865475 * 62;
        }

        const parametersKatex = convKatex(edge.parameters.join(","));
        const parameters = document.createElement("div");
        const yOffset = toPosition.y + yPush - viewPosition.y;
        const xOffset = toPosition.x + xPush - viewPosition.x;

        parameters.innerHTML = parametersKatex;
        parameters.style.position = "absolute";
        parameters.classList.add("parameters");
        parameters.style.transform = "translate(-50%, -50%)";
        parameters.style.top = `calc(50% + ${yOffset}px)`;
        parameters.style.left = `calc(50% + ${xOffset}px)`;

        document.body.appendChild(parameters);
      }
    });
  };

  edgesWithReturn = (edges) => {
    let results = [];

    edges.forEach((edge1) => {
      edges.forEach((edge2) => {
        if (edge1.from == edge2.to && edge2.from == edge1.to) {
          results.push({
            from: edge1.from,
            to: edge1.to,
          });
          results.push({
            from: edge2.from,
            to: edge2.to,
          });
        }
      });
    });

    return results;
  };

  gatherEdges = (input) => {
    let edges = [];
    let conditionVariable = "A";

    const items = input.map((item) => {
      return {
        from: item.event_expression,
        schedules: item.event_routine.scheduling || [],
        cancellations: item.event_routine.cancelling || [],
      };
    });

    items.forEach((item) => {
      const { from } = item;

      item.schedules.forEach((schedule) => {
        edges.push({
          from,
          to: schedule.event_expression_target,
          color: "black",
          label:
            schedule.condition == null ? schedule.condition : conditionVariable,
          title: edgeTitle(schedule),
          smooth: {
            type: "curvedCW",
            roundness: 0,
          },
          delay: schedule.delay,
          parameters: schedule.parameters,
          options: {
            font: {
              align: "horizontal",
              size: 14,
            },
          },
        });

        // Increment condition letter, if one was used
        if (schedule.condition != null) {
          conditionVariable = String.fromCharCode(
            conditionVariable.charCodeAt(0) + 1
          );
        }
      });

      item.cancellations.forEach((schedule) => {
        edges.push({
          from,
          to: schedule.event_expression_target,
          dashes: true,
          color: "black",
          label:
            schedule.condition == null ? schedule.condition : conditionVariable,
          title: edgeTitle(schedule),
          smooth: {
            type: "curvedCW",
            roundness: 0,
          },
          delay: schedule.delay,
          parameters: schedule.parameters,
          options: {
            font: {
              align: "horizontal",
              size: 14,
            },
          },
        });

        // Increment condition letter, if one was used
        if (schedule.condition != null) {
          conditionVariable = String.fromCharCode(
            conditionVariable.charCodeAt(0) + 1
          );
        }
      });
    });

    // Separate bidirectional (overlapping) edges, using edge roundness
    const edgesWithReturn = this.edgesWithReturn(edges);

    edges = edges.map((edge) => {
      if (
        edgesWithReturn.some((edgeWithReturn) => {
          return (
            edgeWithReturn.from == edge.from && edgeWithReturn.to == edge.to
          );
        })
      ) {
        edge.smooth.roundness = 0.2;
      }

      return edge;
    });

    return edges;
  };

  init = (selector, input, options) => {
    const nodes = this.gatherNodes(input);
    const edges = this.gatherEdges(input, nodes);

    const element = document.querySelector(selector);
    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };
    const network = new Network(element, data, options);

    network.on("beforeDrawing", (ctx) => {
      this.drawNodeLabels(nodes, ctx, network);
      this.drawStateTransitions(nodes, ctx, network);
      this.drawEdgeDelays(edges, ctx, network);
      this.drawEdgeParameters(edges, ctx, network);
    });

    setTimeout(function () {
      data.nodes.forEach((node) => {
        data.nodes.update({
          id: node.id,
          fixed: false,
          size: 55,
        });
      });
    });
  };
}

export default EventGraph;
