const EventGraph = window.EventGraph.default;
const EventGraphInstance = new EventGraph();

const nodes = [
  {
    id: 1,
    label: "RUN",
    shape: "circle",
    color: "#111",
    fixed: true,
    x: 60,
    y: 10,
  },
  { id: 2, label: "ENTER", x: 160, y: 100, fixed: true },
  { id: 3, label: "START", x: 160, y: 200, fixed: true },
  { id: 4, label: "ResetQ", x: 130, y: 100, fixed: true },
  { id: 5, label: "LEAVE", x: 0, y: 100, fixed: true },
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
