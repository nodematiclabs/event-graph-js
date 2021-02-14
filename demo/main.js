const eventGraphJSON = {};

let EventGraph = window.EventGraph.default;
let EventGraphInstance = new EventGraph();

console.log("EventGraphInstance", EventGraphInstance);

EventGraphInstance.init('#root');
