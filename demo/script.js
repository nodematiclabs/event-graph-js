const EventGraph = window.EventGraph.default;
const EventGraphInstance = new EventGraph();

const fetchJson = () => {
  return fetch("./input.json")
    .then((input) => input.json())
    .then((data) => data);
};

const initiateEventGraph = (data) => {
  EventGraphInstance.init("#root", data, {
    interaction: { dragNodes: true, dragView: false },
    physics: false,
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 0.5 },
      },
    },
  });
};

fetchJson().then(initiateEventGraph);
