const EventGraph = window.EventGraph.default;
const EventGraphInstance = new EventGraph();

const nodes = [
  {
    id: 1,
    label: "RUN",
    shape: "circle",
    color: "yellow",
    fixed: true,
    x: 624,
    y: 303,
  },
  { id: 2, label: "ENTER", x: 622, y: 456, fixed: true },
  { id: 3, label: "START", x: 735, y: 446, fixed: true },
  { id: 4, label: "ResetQ", x: 825, y: 304, fixed: true },
  { id: 5, label: "LEAVE", x: 730, y: 542, fixed: true },
];

const edges = [
  { from: 1, to: 2, color: { color: "red" } },
  { from: 1, to: 4 },
  { from: 2, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 5 },
  { from: 4, to: 4 },
  { from: 5, to: 3 },
];

EventGraphInstance.init("#root", nodes, edges, {
  interaction: { dragNodes: true, dragView: false },
  physics: false,
  edges: {
    smooth: false,
    arrows: {
      to: { enabled: true, scaleFactor: 1 },
    },
  },
});
