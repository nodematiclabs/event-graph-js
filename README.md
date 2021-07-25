# eventgraph.js

> This library is still under development, documentation may include funcionality that is not yet implemented.

Event Graphs are a way of graphically representing discrete-event simulation models. They have a minimalist design, with a single type of node and two type of edges with up to three options. Their simplicity and extensibility, makes them an ideal tool for constructing and prototyping simulation models.

**eventgraph.js** is built for enabling community to easily create and use event graphs to represent, analyze and design dynamic systems. It provides a foundation to discrete event simulation design models.

## Functionalities

- Creation of event graph from configuration/definition JSON
- Modification of event graph with JavaScript
- Modification of event graph over UI
- Extraction of definition JSON from event graph

## Documentation

You can install event-ghraph-js by running 
 
 ```npm install @orenaksakal/event-graph-js```

example usage after installation:
 ```
// create an instance
 const  EventGraphInstance = new EventGraph();

// node definitions
const  nodes = [
{ id:  1, label:  "ENTER", x:  160, y:  100},
{ id:  2, label:  "START", x:  160, y:  200},
];

// edge definitions
const  edges = [
{ from:  1, to:  2, color: { color:  "red" } },
{ from:  2, to:  2 },
];

// initialises the graph within #root element with nodes, edges and options passed
EventGraphInstance.init("#root", nodes, edges, {physics:  false});
 ```

## Functions
TBD

## Options
TBD
