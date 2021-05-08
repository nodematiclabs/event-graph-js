const EventGraph = window.EventGraph.default;
const EventGraphInstance = new EventGraph();

const fetchJson = () => {
  return fetch("./input.json")
    .then((input) => input.json())
    .then((result) => result);
};
const initiateEventGraph = (input) => {
  EventGraphInstance.init("#root", input, {
    interaction: { dragNodes: true, dragView: false },
    physics: false,
    edges: {
      smooth: false,
      arrows: {
        to: { enabled: true, scaleFactor: 1 },
      },
    },
  });
};

fetchJson().then(initiateEventGraph);
