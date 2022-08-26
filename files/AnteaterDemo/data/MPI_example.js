MPI={"source": "from typing import List, Optional, Dict\nfrom decimal import Decimal\nimport networkx as nx\nimport pydot\nimport copy\nimport os\nimport sys\nfrom helpers import CommunicationCoefficients, MessageID, MPINode\n\nclass GraphFactory:\n    \"\"\"\n    GraphFactory helper class for constructing the MPI Task graph from a log file\n    using networkx and pydot.\n    \"\"\"\n\n    def __init__(self) -> None:\n        # networkx graph representing the Task graph\n        self.G: nx.MultiDiGraph = nx.MultiDiGraph()\n        self.init_node: Optional[MPINode] = None\n        self.final_node: Optional[MPINode] = None\n        self.prev_node: Optional[MPINode] = None\n        # A map indexing all collective nodes parsed ordered by invocation time.\n        self.collective: Dict[str, Dict[int, MPINode]] = dict()\n        # map of request pointers to Irecv/Isend/Wait for matching MPI_Wait\n        self.non_blocking_requests: Dict[str, MPINode] = dict()\n        # A map of sends, recv and wait nodes that need to be linked with nodes sharing unique message signatures.\n        self.message_pass: Dict[str, MPINode] = dict()\n        self.cc: CommunicationCoefficients = CommunicationCoefficients()\n\n    # initialize the shared collective init MPI node.\n    def handle_mpi_init(self, cur_node: MPINode) -> None:\n        if self.init_node is None:\n            cur_node.rank = self.get_collective_rank()\n            self.init_node = cur_node\n            self.G.add_node(self.init_node, label=self.init_node.get_label())\n        self.prev_node = cur_node\n\n    # initialize the shared collective finalize MPI node.\n    def handle_finalize(self, cur_node: MPINode) -> None:\n        if self.final_node is None:\n            cur_node.rank = self.get_collective_rank()\n            self.final_node = cur_node\n            self.G.add_node(self.final_node, label=self.final_node.get_label())\n\n    # handle tracking all collectives apart from finalize and init.\n    def handle_collectives(self, cur_node: MPINode) -> MPINode:\n        if cur_node.command in self.collective:\n            if cur_node.meta_val in self.collective[cur_node.command]:\n                self.collective[cur_node.command][cur_node.meta_val].set_time(cur_node)\n                return self.collective[cur_node.command][cur_node.meta_val]\n            else:\n                cur_node.rank = self.get_collective_rank()\n                self.collective[cur_node.command][cur_node.meta_val] = cur_node\n        else:\n            cur_node.rank = self.get_collective_rank()\n            self.collective[cur_node.command] = dict({cur_node.meta_val: cur_node})\n        return cur_node\n\n    # track and create send message edges from Isend/send to Recv/Wait\n    # when the current node is a node with the outgoing message edge.\n    def handle_send(self, cur_node: MPINode, tokens: List[str]) -> None:\n        cur_node.msg = MessageID(tokens, cur_node.call_id)\n        if cur_node.msg.get_id() in self.message_pass:\n            msg_latency: Decimal = self.cc.latency(cur_node.msg.bytes)\n            self.G.add_edge(cur_node, self.message_pass[cur_node.msg.get_id()], label=\"{:.3f} ({})\".format(msg_latency, cur_node.msg.bytes),weight=msg_latency, latency_edge=True)\n        else:\n            self.message_pass[cur_node.msg.get_id()] = cur_node\n\n    # track and create send message edges from Isend/send to Recv/Wait\n    # when the current node is a node with the incoming message edge.\n    def handle_receive(self, cur_node: MPINode, tokens: List[str]) -> None:\n        if cur_node.command == 'MPI_Wait':\n            # get matching Irecv for the wait.\n            cur_node.msg = self.non_blocking_requests[tokens[len(tokens) - 1]].msg\n            cur_node.msg.update_sender(cur_node.meta_val)\n        else:\n            cur_node.msg = MessageID(tokens, cur_node.meta_val)\n        if cur_node.msg.get_id() in self.message_pass:\n            msg_latency: Decimal = self.cc.latency(cur_node.msg.bytes)\n            self.G.add_edge(self.message_pass[cur_node.msg.get_id()], cur_node,label=\"{:.3f} ({})\".format(msg_latency, cur_node.msg.bytes),weight=msg_latency, latency_edge=True)\n        else:\n            self.message_pass[cur_node.msg.get_id()] = cur_node\n\n    # process a line of tokens read from the log file representing a node and add them to the networkx graph.\n    def process_line(self, line: str, rank: int) -> None:\n        tokens: List[str] = line.split()\n        cur_node: MPINode = MPINode(tokens, rank)\n\n        if cur_node.command == 'MPI_Init':\n            self.handle_mpi_init(cur_node)\n            return\n\n        # get the elapsed time for the sequential task edge between the previous node and current node.\n        elapsed_time: Decimal = cur_node.begin_time - self.prev_node.end_time\n\n        if cur_node.command in ('MPI_Barrier', 'MPI_Alltoall', 'MPI_Allreduce'):\n            cur_node = self.handle_collectives(cur_node)\n\n        if cur_node.command == 'MPI_Finalize':\n            self.handle_finalize(cur_node)\n        else:\n            self.G.add_node(cur_node, label=cur_node.get_label())\n\n        # track request pointers of non blocking receives\n        if cur_node.command == 'MPI_Irecv':\n            # request pointer is always stored as the last token in the log.\n            cur_node.msg = MessageID(tokens, cur_node.meta_val)\n            self.non_blocking_requests[tokens[len(tokens)-1]] = cur_node\n\n        # match Recv/Wait to send/Isend\n        # Meta_val will be negative only for Waits that match to Isend. We can ignore these.\n        if cur_node.command in ('MPI_Wait', 'MPI_Recv') and cur_node.meta_val >= 0:\n            self.handle_receive(cur_node, tokens)\n\n        # match send/Isend to Recv/Wait\n        if cur_node.command in ('MPI_Send', 'MPI_Isend'):\n            self.handle_send(cur_node, tokens)\n\n        # add a sequential task edge from the previous MPI node to the current MPI node.\n        self.G.add_edge(self.init_node if self.prev_node.command == 'MPI_Init' else self.prev_node, self.final_node if cur_node.command == 'MPI_Finalize' else cur_node,label=\"{:.3f}\".format(elapsed_time),weight=elapsed_time, latency_edge=False)\n        self.prev_node = cur_node\n        return\n\n    # create a dot file for the networkx graph and generate a png file representing the dot file.\n    def draw_dot(self) -> None:\n        nx.drawing.nx_pydot.write_dot(self.G, os.getcwd() + '/dotOutput.gv')\n        (graph, ) = pydot.graph_from_dot_file(os.getcwd() + '/dotOutput.gv')\n        graph.write_png(os.getcwd() + '/dotOutput.png')\n\n    # a class method to get the rank representing collective nodes.\n    @classmethod\n    def get_collective_rank(cls) -> int:\n        return -1\n\n    # find the edge with the maximum weight between the two vertex nodes node1 and node2.\n    def find_max_edge(self, node1, node2) -> int:\n        if len(self.G[node1][node2]) == 1:\n            return 0\n        max_val: Decimal = self.G[node1][node2][0]['weight']\n        max_index: int = 0\n        for i in range(len(self.G[node1][node2])):\n            if self.G[node1][node2][i]['weight'] > max_val:\n                max_val = self.G[node1][node2][i]['weight']\n                max_index = i\n        return max_index\n\n    # marks the edges of the networkx graph that form the critical path as red and log them in a file.\n    def mark_critical_path(self) -> None:\n        critical_path = multigraph_dag_longest_path(self.G)\n        with open(\"critPath.out\", \"w\") as file:\n            file.write(critical_path[0].get_crit_path_label())\n            for i in range(len(critical_path)-1):\n                self.G[critical_path[i]][critical_path[i+1]][0]['color'] = 'red'\n                if self.G[critical_path[i]][critical_path[i + 1]][0]['latency_edge']:\n                    file.write(\"{}\\n\".format(critical_path[i].msg.bytes))\n                else:\n                    file.write(\"{}\\n\".format(\n                        round(Decimal(self.G[critical_path[i]][critical_path[i + 1]][0]['label']))))\n                file.write(critical_path[i+1].get_crit_path_label())\n\n\ndef multigraph_dag_longest_path(G: nx.MultiDiGraph, weight='weight', default_weight=1):\n    if not G:\n        return []\n    dist = {}  # stores {v : (length, u)}\n    for v in nx.topological_sort(G):\n        us = [(dist[u][0] + data[0].get(weight, default_weight), u)\n              for u, data in G.pred[v].items()]\n        # Use the best predecessor if there is one and its distance is\n        # non-negative, otherwise terminate.\n        maxu = max(us, key=lambda x: x[0]) if us else (0, v)\n        dist[v] = maxu if maxu[0] >= 0 else (0, v)\n    u = None\n    v = max(dist, key=lambda x: dist[x][0])\n    path = []\n    while u != v:\n        path.append(v)\n        u = v\n        v = dist[v][1]\n    path.reverse()\n    return path\n\n\n# create a networkx graph for the given input log files and dump a critical path file and dot file.\ndef main() -> None:\n    print(\"starting critical path analyzer...\")\n    sys.argv = [None,4]\n    process_count: int = int(sys.argv[1])\n    g: GraphFactory = GraphFactory()\n    for rank in range(process_count):\n        with open('mpi_rank_' + str(rank) + '.txt', \"r\") as file:\n            for line in file:\n                g.process_line(line, rank)\n    g.mark_critical_path()\n    g.draw_dot()\n\n\nif __name__ == \"__main__\":\n    main()\n\n\n\n\n\n\n\n\n",

"functions": {"__init__": {"start": 16, "end": 28}, "handle_mpi_init": {"start": 31, "end": 36}, "handle_finalize": {"start": 39, "end": 43}, "handle_collectives": {"start": 46, "end": 57}, "handle_send": {"start": 61, "end": 67}, "handle_receive": {"start": 71, "end": 82}, "process_line": {"start": 85, "end": 122}, "draw_dot": {"start": 125, "end": 128}, "get_collective_rank": {"start": 131, "end": 133}, "find_max_edge": {"start": 136, "end": 145}, "mark_critical_path": {"start": 148, "end": 159}, "multigraph_dag_longest_path": {"start": 162, "end": 181}, "main": {"start": 185, "end": 195}},

"dependencies": {"handle_collectives_return": ["handle_collectives_cur_node"], "self.handle_collectives97": ["process_line_cur_node"], "process_line_cur_node": ["self.handle_collectives97"], "os.getcwd127": [], "pydot.graph_from_dot_file127": ["os.getcwd127"], "draw_dot_graph": ["pydot.graph_from_dot_file127"], "get_collective_rank_return": [], "find_max_edge_return": ["find_max_edge_max_index"], "find_max_edge_max_val": ["find_max_edge_[node2][i][weight]"], "find_max_edge_max_index": ["find_max_edge_i"], "multigraph_dag_longest_path149": ["mark_critical_path_self.G"], "mark_critical_path_critical_path": ["multigraph_dag_longest_path149"], "multigraph_dag_longest_path_return": ["multigraph_dag_longest_path_path"], "multigraph_dag_longest_path_dist": [], "multigraph_dag_longest_path_us": [], "multigraph_dag_longest_path_maxu": [], "multigraph_dag_longest_path_u": ["multigraph_dag_longest_path_v"], "max174": ["multigraph_dag_longest_path_dist"], "multigraph_dag_longest_path_v": ["max174", "multigraph_dag_longest_path_[1]"], "multigraph_dag_longest_path_path": []},

"loops": {"for-141": {"start": 141, "end": 144}, "for-152": {"start": 152, "end": 159}, "for-166": {"start": 166, "end": 172}, "for-167": {"start": 167, "end": 168}, "while-176": {"start": 176, "end": 179}, "for-190": {"start": 190, "end": 193}, "for-192": {"start": 192, "end": 193}},
	 "trace":[
	{
		"type":"call",
		"lineno": 199,
		"timestamp": 1.0550808906555176,
		"id": 1,
		"parentBlockID": 0,
		"func_name":"main",
		"body":[
		{
			"type":"for",
			"lineno": 190,
			"timestamp": 1.055633783340454,
			"id": 2,
			"parentBlockID": 1,
			"target":"rank",
			"body":[
			{
				"type":"for",
				"lineno": 192,
				"timestamp": 1.0557339191436768,
				"id": 3,
				"parentBlockID": 2,
				"target":"line",
				"body":[
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.05617094039917,
					"id": 4,
					"parentBlockID": 3,
					"targetVal":"MPI_Init 1 1 0.000000 15646.851517\n",
					"iteration":1,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 90,
						"timestamp": 1.0562167167663574,
						"id": 5,
						"parentBlockID": 4,
						"func_name":"self.handle_mpi_init",
						"body":[
						{
							"type":"call",
							"lineno": 33,
							"timestamp": 1.056236982345581,
							"id": 6,
							"parentBlockID": 5,
							"func_name":"self.get_collective_rank",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 35,
							"timestamp": 1.0562529563903809,
							"id": 7,
							"parentBlockID": 5,
							"func_name":"self.G.add_node",
							"body":[
							]
						}
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0562827587127686,
					"id": 8,
					"parentBlockID": 3,
					"targetVal":"MPI_Irecv 2 0 15646.851540 15646.851552 1 4 1 0 123 0x7ffd116b4230\n",
					"iteration":2,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.056302785873413,
						"id": 9,
						"parentBlockID": 8,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 107,
						"timestamp": 1.0563158988952637,
						"id": 10,
						"parentBlockID": 8,
						"func_name":"MessageID",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0563409328460693,
						"id": 11,
						"parentBlockID": 8,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0563757419586182,
					"id": 12,
					"parentBlockID": 3,
					"targetVal":"MPI_Isend 3 0 15647.151624 15647.151646 1 4 0 1 123\n",
					"iteration":3,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0563938617706299,
						"id": 13,
						"parentBlockID": 12,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 117,
						"timestamp": 1.056406021118164,
						"id": 14,
						"parentBlockID": 12,
						"func_name":"self.handle_send",
						"body":[
						{
							"type":"call",
							"lineno": 62,
							"timestamp": 1.0564148426055908,
							"id": 15,
							"parentBlockID": 14,
							"func_name":"MessageID",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0564348697662354,
						"id": 16,
						"parentBlockID": 12,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0564517974853516,
					"id": 17,
					"parentBlockID": 3,
					"targetVal":"MPI_Wait 4 -1 15647.451712 15647.451713 0x7ffd116b4238\n",
					"iteration":4,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.056466817855835,
						"id": 18,
						"parentBlockID": 17,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0564780235290527,
						"id": 19,
						"parentBlockID": 17,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0564930438995361,
					"id": 20,
					"parentBlockID": 3,
					"targetVal":"MPI_Wait 5 3 15648.051781 15648.051802 0x7ffd116b4230\n",
					"iteration":5,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.056506872177124,
						"id": 21,
						"parentBlockID": 20,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 113,
						"timestamp": 1.0565168857574463,
						"id": 22,
						"parentBlockID": 20,
						"func_name":"self.handle_receive",
						"body":[
						{
							"type":"call",
							"lineno": 75,
							"timestamp": 1.0565319061279297,
							"id": 23,
							"parentBlockID": 22,
							"func_name":"cur_node.msg.update_sender",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0565497875213623,
						"id": 24,
						"parentBlockID": 20,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0565650463104248,
					"id": 25,
					"parentBlockID": 3,
					"targetVal":"MPI_Barrier 6 2 15648.351870 15651.851522\n",
					"iteration":6,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 97,
						"timestamp": 1.0565788745880127,
						"id": 26,
						"parentBlockID": 25,
						"func_name":"self.handle_collectives",
						"body":[
						{
							"type":"call",
							"lineno": 55,
							"timestamp": 1.0565879344940186,
							"id": 27,
							"parentBlockID": 26,
							"func_name":"self.get_collective_rank",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 56,
							"timestamp": 1.0566017627716064,
							"id": 28,
							"parentBlockID": 26,
							"func_name":"dict",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0566179752349854,
						"id": 29,
						"parentBlockID": 25,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.056628942489624,
						"id": 30,
						"parentBlockID": 25,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0566678047180176,
					"id": 31,
					"parentBlockID": 3,
					"targetVal":"MPI_Finalize 7 3 15651.851528 15651.851528\n",
					"iteration":7,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 100,
						"timestamp": 1.056696891784668,
						"id": 32,
						"parentBlockID": 31,
						"func_name":"self.handle_finalize",
						"body":[
						{
							"type":"call",
							"lineno": 41,
							"timestamp": 1.056710958480835,
							"id": 33,
							"parentBlockID": 32,
							"func_name":"self.get_collective_rank",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 43,
							"timestamp": 1.05672287940979,
							"id": 34,
							"parentBlockID": 32,
							"func_name":"self.G.add_node",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0567419528961182,
						"id": 35,
						"parentBlockID": 31,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				}
				]
			},
			{
				"type":"for",
				"lineno": 192,
				"timestamp": 1.0568888187408447,
				"id": 36,
				"parentBlockID": 2,
				"target":"line",
				"body":[
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0572307109832764,
					"id": 37,
					"parentBlockID": 36,
					"targetVal":"MPI_Init 1 1 0.000000 15646.851445\n",
					"iteration":1,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 90,
						"timestamp": 1.057262897491455,
						"id": 38,
						"parentBlockID": 37,
						"func_name":"self.handle_mpi_init",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0573928356170654,
					"id": 39,
					"parentBlockID": 36,
					"targetVal":"MPI_Irecv 2 0 15647.151529 15647.151540 1 4 0 1 123 0x7ffc724c6860\n",
					"iteration":2,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.05741286277771,
						"id": 40,
						"parentBlockID": 39,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 107,
						"timestamp": 1.0574359893798828,
						"id": 41,
						"parentBlockID": 39,
						"func_name":"MessageID",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0574557781219482,
						"id": 42,
						"parentBlockID": 39,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0574960708618164,
					"id": 43,
					"parentBlockID": 36,
					"targetVal":"MPI_Isend 3 0 15647.451683 15647.451711 1 4 1 0 123\n",
					"iteration":3,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0575230121612549,
						"id": 44,
						"parentBlockID": 43,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 117,
						"timestamp": 1.0575428009033203,
						"id": 45,
						"parentBlockID": 43,
						"func_name":"self.handle_send",
						"body":[
						{
							"type":"call",
							"lineno": 62,
							"timestamp": 1.0575568675994873,
							"id": 46,
							"parentBlockID": 45,
							"func_name":"MessageID",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 65,
							"timestamp": 1.0575859546661377,
							"id": 47,
							"parentBlockID": 45,
							"func_name":"self.G.add_edge",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.057616949081421,
						"id": 48,
						"parentBlockID": 43,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0576419830322266,
					"id": 49,
					"parentBlockID": 36,
					"targetVal":"MPI_Wait 4 3 15647.751853 15647.751871 0x7ffc724c6860\n",
					"iteration":4,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0576667785644531,
						"id": 50,
						"parentBlockID": 49,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 113,
						"timestamp": 1.0576848983764648,
						"id": 51,
						"parentBlockID": 49,
						"func_name":"self.handle_receive",
						"body":[
						{
							"type":"call",
							"lineno": 75,
							"timestamp": 1.0577328205108643,
							"id": 52,
							"parentBlockID": 51,
							"func_name":"cur_node.msg.update_sender",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 80,
							"timestamp": 1.05775785446167,
							"id": 53,
							"parentBlockID": 51,
							"func_name":"self.G.add_edge",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.057790994644165,
						"id": 54,
						"parentBlockID": 49,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0578179359436035,
					"id": 55,
					"parentBlockID": 36,
					"targetVal":"MPI_Wait 5 -1 15648.351975 15648.351975 0x7ffc724c6868\n",
					"iteration":5,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0578439235687256,
						"id": 56,
						"parentBlockID": 55,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0578670501708984,
						"id": 57,
						"parentBlockID": 55,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0578927993774414,
					"id": 58,
					"parentBlockID": 36,
					"targetVal":"MPI_Barrier 6 2 15648.652086 15651.851523\n",
					"iteration":6,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 97,
						"timestamp": 1.0579168796539307,
						"id": 59,
						"parentBlockID": 58,
						"func_name":"self.handle_collectives",
						"body":[
						{
							"type":"call",
							"lineno": 49,
							"timestamp": 1.0579347610473633,
							"id": 60,
							"parentBlockID": 59,
							"func_name":"self.collective[cur_node.command][cur_node.meta_val].set_time",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0579588413238525,
						"id": 61,
						"parentBlockID": 58,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0579779148101807,
						"id": 62,
						"parentBlockID": 58,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0580039024353027,
					"id": 63,
					"parentBlockID": 36,
					"targetVal":"MPI_Finalize 7 3 15651.851528 15651.851528\n",
					"iteration":7,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 100,
						"timestamp": 1.0580289363861084,
						"id": 64,
						"parentBlockID": 63,
						"func_name":"self.handle_finalize",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0580480098724365,
						"id": 65,
						"parentBlockID": 63,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				}
				]
			},
			{
				"type":"for",
				"lineno": 192,
				"timestamp": 1.0582458972930908,
				"id": 66,
				"parentBlockID": 2,
				"target":"line",
				"body":[
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0587468147277832,
					"id": 67,
					"parentBlockID": 66,
					"targetVal":"MPI_Init 1 1 0.000000 15646.851552\n",
					"iteration":1,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 90,
						"timestamp": 1.0588040351867676,
						"id": 68,
						"parentBlockID": 67,
						"func_name":"self.handle_mpi_init",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.058825969696045,
					"id": 69,
					"parentBlockID": 66,
					"targetVal":"MPI_Barrier 2 2 15646.851572 15651.851517\n",
					"iteration":2,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 97,
						"timestamp": 1.0588419437408447,
						"id": 70,
						"parentBlockID": 69,
						"func_name":"self.handle_collectives",
						"body":[
						{
							"type":"call",
							"lineno": 49,
							"timestamp": 1.0588529109954834,
							"id": 71,
							"parentBlockID": 70,
							"func_name":"self.collective[cur_node.command][cur_node.meta_val].set_time",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0588717460632324,
						"id": 72,
						"parentBlockID": 69,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0588889122009277,
						"id": 73,
						"parentBlockID": 69,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0589158535003662,
					"id": 74,
					"parentBlockID": 66,
					"targetVal":"MPI_Finalize 3 3 15651.851524 15651.851525\n",
					"iteration":3,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 100,
						"timestamp": 1.0590200424194336,
						"id": 75,
						"parentBlockID": 74,
						"func_name":"self.handle_finalize",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0590338706970215,
						"id": 76,
						"parentBlockID": 74,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				}
				]
			},
			{
				"type":"for",
				"lineno": 192,
				"timestamp": 1.0591809749603271,
				"id": 77,
				"parentBlockID": 2,
				"target":"line",
				"body":[
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.059467077255249,
					"id": 78,
					"parentBlockID": 77,
					"targetVal":"MPI_Init 1 1 0.000000 15646.851385\n",
					"iteration":1,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 90,
						"timestamp": 1.059499979019165,
						"id": 79,
						"parentBlockID": 78,
						"func_name":"self.handle_mpi_init",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0595178604125977,
					"id": 80,
					"parentBlockID": 77,
					"targetVal":"MPI_Barrier 2 2 15651.851466 15651.851519\n",
					"iteration":2,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 97,
						"timestamp": 1.0595519542694092,
						"id": 81,
						"parentBlockID": 80,
						"func_name":"self.handle_collectives",
						"body":[
						{
							"type":"call",
							"lineno": 49,
							"timestamp": 1.0595667362213135,
							"id": 82,
							"parentBlockID": 81,
							"func_name":"self.collective[cur_node.command][cur_node.meta_val].set_time",
							"body":[
							]
						}
						]
					},
					{
						"type":"call",
						"lineno": 102,
						"timestamp": 1.0595898628234863,
						"id": 83,
						"parentBlockID": 80,
						"func_name":"self.G.add_node",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0596098899841309,
						"id": 84,
						"parentBlockID": 80,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				},
				{
					"type":"call",
					"lineno": 193,
					"timestamp": 1.0596296787261963,
					"id": 85,
					"parentBlockID": 77,
					"targetVal":"MPI_Finalize 3 3 15651.851524 15651.851525\n",
					"iteration":3,
					"func_name":"g.process_line",
					"body":[
					{
						"type":"call",
						"lineno": 100,
						"timestamp": 1.0596458911895752,
						"id": 86,
						"parentBlockID": 85,
						"func_name":"self.handle_finalize",
						"body":[
						]
					},
					{
						"type":"call",
						"lineno": 120,
						"timestamp": 1.0596568584442139,
						"id": 87,
						"parentBlockID": 85,
						"func_name":"self.G.add_edge",
						"body":[
						]
					}
					]
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 194,
			"timestamp": 1.0597047805786133,
			"id": 88,
			"parentBlockID": 1,
			"func_name":"g.mark_critical_path",
			"body":[
			{
				"type":"call",
				"lineno": 149,
				"timestamp": 1.0597147941589355,
				"id": 89,
				"parentBlockID": 88,
				"func_name":"multigraph_dag_longest_path",
				"body":[
				{
					"type":"for",
					"lineno": 166,
					"timestamp": 1.059729814529419,
					"id": 90,
					"parentBlockID": 89,
					"target":"v",
					"body":[
				{
					"type":"assign",
					"lineno": 166,
					"timestamp": 1.0598299503326416,
					"id": 91,
					"parentBlockID": 90,
					"targetVal":"<helpers.MPINode object at 0xa15937198>",
					"iteration":1,
					"name":"v",
					"v":"<helpers.MPINode object at 0xa15937198>",
					"v.get_label()":"0: MPI_Init"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0598578453063965,
						"id": 92,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15937198>",
						"iteration":1,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0598828792572021,
						"id": 93,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0599119663238525,
						"id": 94,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1595b320>",
						"iteration":2,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1595b320>",
						"v.get_label()":"1: MPI_Irecv"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0599288940429688,
						"id": 95,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1595b320>",
						"iteration":2,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.059946060180664,
						"id": 96,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0599570274353027,
						"id": 97,
						"parentBlockID": 96,
						"targetVal1":"<helpers.MPINode object at 0xa15937198>",
						"targetVal2":"{0: {'label': '0.300', 'weight': 0.30008400000042457, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15937198>",
						"u.get_label()":"0: MPI_Init"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.059983730316162,
							"id": 98,
							"parentBlockID": 96,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30008400000042457, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.300', 'weight': 0.30008400000042457, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.060013771057129,
							"id": 99,
							"parentBlockID": 96,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30008400000042457, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0600357055664062,
							"id": 100,
							"parentBlockID": 96,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30008400000042457, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":0.30008400000042457
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0605239868164062,
						"id": 101,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596f0f0>",
						"iteration":3,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1596f0f0>",
						"v.get_label()":"1: MPI_Isend"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0605528354644775,
						"id": 102,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596f0f0>",
						"iteration":3,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.060575008392334,
						"id": 103,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0605881214141846,
						"id": 104,
						"parentBlockID": 103,
						"targetVal1":"<helpers.MPINode object at 0xa1595b320>",
						"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001429999985703, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa1595b320>",
						"u.get_label()":"1: MPI_Irecv"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0606739521026611,
							"id": 105,
							"parentBlockID": 103,
							"targetVal1":"<helpers.MPINode object at 0xa1595b320>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001429999985703, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.300', 'weight': 0.3001429999985703, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0607008934020996,
							"id": 106,
							"parentBlockID": 103,
							"targetVal1":"<helpers.MPINode object at 0xa1595b320>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001429999985703, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0607218742370605,
							"id": 107,
							"parentBlockID": 103,
							"targetVal1":"<helpers.MPINode object at 0xa1595b320>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001429999985703, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":0.6002269999989949
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0607779026031494,
						"id": 108,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15937748>",
						"iteration":4,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15937748>",
						"v.get_label()":"0: MPI_Irecv"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.060795783996582,
						"id": 109,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15937748>",
						"iteration":4,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0608139038085938,
						"id": 110,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0608258247375488,
						"id": 111,
						"parentBlockID": 110,
						"targetVal1":"<helpers.MPINode object at 0xa15937198>",
						"targetVal2":"{0: {'label': '0.000', 'weight': 2.300000051036477e-05, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15937198>",
						"u.get_label()":"0: MPI_Init"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0608489513397217,
							"id": 112,
							"parentBlockID": 110,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 2.300000051036477e-05, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.000', 'weight': 2.300000051036477e-05, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.060870885848999,
							"id": 113,
							"parentBlockID": 110,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 2.300000051036477e-05, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.060889720916748,
							"id": 114,
							"parentBlockID": 110,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 2.300000051036477e-05, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":2.300000051036477e-05
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0609359741210938,
						"id": 115,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15962128>",
						"iteration":5,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15962128>",
						"v.get_label()":"0: MPI_Isend"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.06095290184021,
						"id": 116,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15962128>",
						"iteration":5,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0609710216522217,
						"id": 117,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0634827613830566,
						"id": 118,
						"parentBlockID": 117,
						"targetVal1":"<helpers.MPINode object at 0xa15937748>",
						"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000720000000001, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15937748>",
						"u.get_label()":"0: MPI_Irecv"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0635488033294678,
							"id": 119,
							"parentBlockID": 117,
							"targetVal1":"<helpers.MPINode object at 0xa15937748>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000720000000001, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.300', 'weight': 0.3000720000000001, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0635759830474854,
							"id": 120,
							"parentBlockID": 117,
							"targetVal1":"<helpers.MPINode object at 0xa15937748>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000720000000001, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.063598871231079,
							"id": 121,
							"parentBlockID": 117,
							"targetVal1":"<helpers.MPINode object at 0xa15937748>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000720000000001, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":0.3000950000005105
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0636920928955078,
						"id": 122,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596fba8>",
						"iteration":6,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1596fba8>",
						"v.get_label()":"1: MPI_Wait"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0637147426605225,
						"id": 123,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596fba8>",
						"iteration":6,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0637378692626953,
						"id": 124,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0637519359588623,
						"id": 125,
						"parentBlockID": 124,
						"targetVal1":"<helpers.MPINode object at 0xa15962128>",
						"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15962128>",
						"u.get_label()":"0: MPI_Isend"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0637750625610352,
							"id": 126,
							"parentBlockID": 124,
							"targetVal1":"<helpers.MPINode object at 0xa15962128>",
							"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0638718605041504,
							"id": 127,
							"parentBlockID": 124,
							"targetVal1":"<helpers.MPINode object at 0xa15962128>",
							"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0638949871063232,
							"id": 128,
							"parentBlockID": 124,
							"targetVal1":"<helpers.MPINode object at 0xa15962128>",
							"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":0.6000950000005105
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0639269351959229,
							"id": 129,
							"parentBlockID": 124,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30014200000005076, 'latency_edge': False}}",
							"iteration":2,
							"name":"u",
							"u":"<helpers.MPINode object at 0xa1596f0f0>",
							"u.get_label()":"1: MPI_Isend"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0639491081237793,
							"id": 130,
							"parentBlockID": 124,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30014200000005076, 'latency_edge': False}}",
							"iteration":2,
							"name":"data",
							"data":"{0: {'label': '0.300', 'weight': 0.30014200000005076, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0639688968658447,
							"id": 131,
							"parentBlockID": 124,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30014200000005076, 'latency_edge': False}}",
							"iteration":2,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0639870166778564,
							"id": 132,
							"parentBlockID": 124,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30014200000005076, 'latency_edge': False}}",
							"iteration":2,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":0.9003689999990456
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0641028881072998,
						"id": 133,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15a596d8>",
						"iteration":7,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15a596d8>",
						"v.get_label()":"1: MPI_Wait"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0641858577728271,
						"id": 134,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15a596d8>",
						"iteration":7,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0642318725585938,
						"id": 135,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.064253807067871,
						"id": 136,
						"parentBlockID": 135,
						"targetVal1":"<helpers.MPINode object at 0xa1596fba8>",
						"targetVal2":"{0: {'label': '0.600', 'weight': 0.6001039999991917, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa1596fba8>",
						"u.get_label()":"1: MPI_Wait"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0642917156219482,
							"id": 137,
							"parentBlockID": 135,
							"targetVal1":"<helpers.MPINode object at 0xa1596fba8>",
							"targetVal2":"{0: {'label': '0.600', 'weight': 0.6001039999991917, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.600', 'weight': 0.6001039999991917, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0643270015716553,
							"id": 138,
							"parentBlockID": 135,
							"targetVal1":"<helpers.MPINode object at 0xa1596fba8>",
							"targetVal2":"{0: {'label': '0.600', 'weight': 0.6001039999991917, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0643577575683594,
							"id": 139,
							"parentBlockID": 135,
							"targetVal1":"<helpers.MPINode object at 0xa1596fba8>",
							"targetVal2":"{0: {'label': '0.600', 'weight': 0.6001039999991917, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":1.5004729999982374
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0644469261169434,
						"id": 140,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596fc18>",
						"iteration":8,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1596fc18>",
						"v.get_label()":"0: MPI_Wait"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0644769668579102,
						"id": 141,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596fc18>",
						"iteration":8,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0645089149475098,
						"id": 142,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0645277500152588,
						"id": 143,
						"parentBlockID": 142,
						"targetVal1":"<helpers.MPINode object at 0xa15962128>",
						"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000659999997879, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15962128>",
						"u.get_label()":"0: MPI_Isend"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0645627975463867,
							"id": 144,
							"parentBlockID": 142,
							"targetVal1":"<helpers.MPINode object at 0xa15962128>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000659999997879, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.300', 'weight': 0.3000659999997879, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0645968914031982,
							"id": 145,
							"parentBlockID": 142,
							"targetVal1":"<helpers.MPINode object at 0xa15962128>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000659999997879, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0646741390228271,
							"id": 146,
							"parentBlockID": 142,
							"targetVal1":"<helpers.MPINode object at 0xa15962128>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3000659999997879, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":0.6001610000002984
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.064823865890503,
						"id": 147,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596fda0>",
						"iteration":9,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1596fda0>",
						"v.get_label()":"0: MPI_Wait"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0649449825286865,
						"id": 148,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa1596fda0>",
						"iteration":9,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0649809837341309,
						"id": 149,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0650010108947754,
						"id": 150,
						"parentBlockID": 149,
						"targetVal1":"<helpers.MPINode object at 0xa1596fc18>",
						"targetVal2":"{0: {'label': '0.600', 'weight': 0.6000679999997374, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa1596fc18>",
						"u.get_label()":"0: MPI_Wait"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0650370121002197,
							"id": 151,
							"parentBlockID": 149,
							"targetVal1":"<helpers.MPINode object at 0xa1596fc18>",
							"targetVal2":"{0: {'label': '0.600', 'weight': 0.6000679999997374, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.600', 'weight': 0.6000679999997374, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0650990009307861,
							"id": 152,
							"parentBlockID": 149,
							"targetVal1":"<helpers.MPINode object at 0xa1596fc18>",
							"targetVal2":"{0: {'label': '0.600', 'weight': 0.6000679999997374, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.065133810043335,
							"id": 153,
							"parentBlockID": 149,
							"targetVal1":"<helpers.MPINode object at 0xa1596fc18>",
							"targetVal2":"{0: {'label': '0.600', 'weight': 0.6000679999997374, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":1.2002290000000357
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0652689933776855,
							"id": 154,
							"parentBlockID": 149,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
							"iteration":2,
							"name":"u",
							"u":"<helpers.MPINode object at 0xa1596f0f0>",
							"u.get_label()":"1: MPI_Isend"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0652999877929688,
							"id": 155,
							"parentBlockID": 149,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
							"iteration":2,
							"name":"data",
							"data":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0653209686279297,
							"id": 156,
							"parentBlockID": 149,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
							"iteration":2,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0653409957885742,
							"id": 157,
							"parentBlockID": 149,
							"targetVal1":"<helpers.MPINode object at 0xa1596f0f0>",
							"targetVal2":"{0: {'label': '0.300 (4)', 'weight': 0.3, 'latency_edge': True}}",
							"iteration":2,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":0.9002269999989949
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0654399394989014,
						"id": 158,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15a594e0>",
						"iteration":10,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15a594e0>",
						"v.get_label()":"0: MPI_Barrier"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.0654709339141846,
						"id": 159,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15a594e0>",
						"iteration":10,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0655019283294678,
						"id": 160,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0655229091644287,
						"id": 161,
						"parentBlockID": 160,
						"targetVal1":"<helpers.MPINode object at 0xa1596fda0>",
						"targetVal2":"{0: {'label': '0.300', 'weight': 0.30006800000046496, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa1596fda0>",
						"u.get_label()":"0: MPI_Wait"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0655570030212402,
							"id": 162,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa1596fda0>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30006800000046496, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.300', 'weight': 0.30006800000046496, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0655910968780518,
							"id": 163,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa1596fda0>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30006800000046496, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.065619945526123,
							"id": 164,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa1596fda0>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.30006800000046496, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":1.5002970000005007
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0657837390899658,
							"id": 165,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15a596d8>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001110000004701, 'latency_edge': False}}",
							"iteration":2,
							"name":"u",
							"u":"<helpers.MPINode object at 0xa15a596d8>",
							"u.get_label()":"1: MPI_Wait"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0658140182495117,
							"id": 166,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15a596d8>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001110000004701, 'latency_edge': False}}",
							"iteration":2,
							"name":"data",
							"data":"{0: {'label': '0.300', 'weight': 0.3001110000004701, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0658340454101562,
							"id": 167,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15a596d8>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001110000004701, 'latency_edge': False}}",
							"iteration":2,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0658550262451172,
							"id": 168,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15a596d8>",
							"targetVal2":"{0: {'label': '0.300', 'weight': 0.3001110000004701, 'latency_edge': False}}",
							"iteration":2,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":1.8005839999987074
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.06595778465271,
							"id": 169,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 1.9999999494757503e-05, 'latency_edge': False}, 1: {'label': '5.000', 'weight': 5.0000810000001366, 'latency_edge': False}}",
							"iteration":3,
							"name":"u",
							"u":"<helpers.MPINode object at 0xa15937198>",
							"u.get_label()":"0: MPI_Init"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0659868717193604,
							"id": 170,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 1.9999999494757503e-05, 'latency_edge': False}, 1: {'label': '5.000', 'weight': 5.0000810000001366, 'latency_edge': False}}",
							"iteration":3,
							"name":"data",
							"data":"{0: {'label': '0.000', 'weight': 1.9999999494757503e-05, 'latency_edge': False}, 1: {'label': '5.000', 'weight': 5.0000810000001366, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0660128593444824,
							"id": 171,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 1.9999999494757503e-05, 'latency_edge': False}, 1: {'label': '5.000', 'weight': 5.0000810000001366, 'latency_edge': False}}",
							"iteration":3,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0660350322723389,
							"id": 172,
							"parentBlockID": 160,
							"targetVal1":"<helpers.MPINode object at 0xa15937198>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 1.9999999494757503e-05, 'latency_edge': False}, 1: {'label': '5.000', 'weight': 5.0000810000001366, 'latency_edge': False}}",
							"iteration":3,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":1.9999999494757503e-05
						}
						]
					},
					{
						"type":"assign",
						"lineno": 166,
						"timestamp": 1.0661020278930664,
						"id": 173,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15a59630>",
						"iteration":11,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15a59630>",
						"v.get_label()":"0: MPI_Finalize"
					},
					{
						"type":"call",
						"lineno": 168,
						"timestamp": 1.066122055053711,
						"id": 174,
						"parentBlockID": 90,
						"targetVal":"<helpers.MPINode object at 0xa15a59630>",
						"iteration":11,
						"func_name":"G.pred[v].items",
						"body":[
						]
					},
					{
						"type":"for",
						"lineno": 167,
						"timestamp": 1.0661449432373047,
						"id": 175,
						"parentBlockID": 90,
						"target1":"u",
						"target2":"data",
						"body":[
					{
						"type":"assign",
						"lineno": 168,
						"timestamp": 1.0661578178405762,
						"id": 176,
						"parentBlockID": 175,
						"targetVal1":"<helpers.MPINode object at 0xa15a594e0>",
						"targetVal2":"{0: {'label': '0.000', 'weight': 5.999998393235728e-06, 'latency_edge': False}, 1: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}, 2: {'label': '0.000', 'weight': 7.0000005507608876e-06, 'latency_edge': False}, 3: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}}",
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15a594e0>",
						"u.get_label()":"0: MPI_Barrier"
						},
						{
							"type":"assign",
							"lineno": 168,
							"timestamp": 1.0661990642547607,
							"id": 177,
							"parentBlockID": 175,
							"targetVal1":"<helpers.MPINode object at 0xa15a594e0>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 5.999998393235728e-06, 'latency_edge': False}, 1: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}, 2: {'label': '0.000', 'weight': 7.0000005507608876e-06, 'latency_edge': False}, 3: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}}",
							"iteration":1,
							"name":"data",
							"data":"{0: {'label': '0.000', 'weight': 5.999998393235728e-06, 'latency_edge': False}, 1: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}, 2: {'label': '0.000', 'weight': 7.0000005507608876e-06, 'latency_edge': False}, 3: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}}"
						},
						{
							"type":"call",
							"lineno": 167,
							"timestamp": 1.0662338733673096,
							"id": 178,
							"parentBlockID": 175,
							"targetVal1":"<helpers.MPINode object at 0xa15a594e0>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 5.999998393235728e-06, 'latency_edge': False}, 1: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}, 2: {'label': '0.000', 'weight': 7.0000005507608876e-06, 'latency_edge': False}, 3: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}}",
							"iteration":1,
							"func_name":"data[0].get",
							"body":[
							]
						},
						{
							"type":"expression",
							"lineno": 167,
							"timestamp": 1.0662589073181152,
							"id": 179,
							"parentBlockID": 175,
							"targetVal1":"<helpers.MPINode object at 0xa15a594e0>",
							"targetVal2":"{0: {'label': '0.000', 'weight': 5.999998393235728e-06, 'latency_edge': False}, 1: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}, 2: {'label': '0.000', 'weight': 7.0000005507608876e-06, 'latency_edge': False}, 3: {'label': '0.000', 'weight': 4.999999873689376e-06, 'latency_edge': False}}",
							"iteration":1,
							"name":"dist[u][0] + data[0].get(weight, default_weight)",
							"dist[u][0] + data[0].get(weight, default_weight)":1.8005899999971007
						}
						]
					}
					]
				},
				{
					"type":"assign",
					"lineno": 173,
					"timestamp": 1.0663049221038818,
					"id": 180,
					"parentBlockID": 89,
					"name":"u",
					"u":"None",
					"u.get_label()":"Anteater:Expression_Error"
				},
				{
					"type":"call",
					"lineno": 174,
					"timestamp": 1.0663177967071533,
					"id": 181,
					"parentBlockID": 89,
					"func_name":"max",
					"body":[
					]
				},
				{
					"type":"assign",
					"lineno": 174,
					"timestamp": 1.0663328170776367,
					"id": 182,
					"parentBlockID": 89,
					"name":"v",
					"v":"<helpers.MPINode object at 0xa15a59630>",
					"v.get_label()":"0: MPI_Finalize"
				},
				{
					"type":"while",
					"lineno": 176,
					"timestamp": 1.0663459300994873,
					"id": 183,
					"parentBlockID": 89,
					"body":[
					{
						"type":"assign",
						"lineno": 178,
						"timestamp": 1.0663537979125977,
						"id": 184,
						"parentBlockID": 183,
						"iteration":0,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15a59630>",
						"u.get_label()":"0: MPI_Finalize"
					},
					{
						"type":"assign",
						"lineno": 179,
						"timestamp": 1.0663690567016602,
						"id": 185,
						"parentBlockID": 183,
						"iteration":0,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15a594e0>",
						"v.get_label()":"0: MPI_Barrier"
					},
					{
						"type":"assign",
						"lineno": 178,
						"timestamp": 1.0663838386535645,
						"id": 186,
						"parentBlockID": 183,
						"iteration":1,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15a594e0>",
						"u.get_label()":"0: MPI_Barrier"
					},
					{
						"type":"assign",
						"lineno": 179,
						"timestamp": 1.066396951675415,
						"id": 187,
						"parentBlockID": 183,
						"iteration":1,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15a596d8>",
						"v.get_label()":"1: MPI_Wait"
					},
					{
						"type":"assign",
						"lineno": 178,
						"timestamp": 1.066411018371582,
						"id": 188,
						"parentBlockID": 183,
						"iteration":2,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15a596d8>",
						"u.get_label()":"1: MPI_Wait"
					},
					{
						"type":"assign",
						"lineno": 179,
						"timestamp": 1.0664598941802979,
						"id": 189,
						"parentBlockID": 183,
						"iteration":2,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1596fba8>",
						"v.get_label()":"1: MPI_Wait"
					},
					{
						"type":"assign",
						"lineno": 178,
						"timestamp": 1.0664761066436768,
						"id": 190,
						"parentBlockID": 183,
						"iteration":3,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa1596fba8>",
						"u.get_label()":"1: MPI_Wait"
					},
					{
						"type":"assign",
						"lineno": 179,
						"timestamp": 1.0664899349212646,
						"id": 191,
						"parentBlockID": 183,
						"iteration":3,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1596f0f0>",
						"v.get_label()":"1: MPI_Isend"
					},
					{
						"type":"assign",
						"lineno": 178,
						"timestamp": 1.0665040016174316,
						"id": 192,
						"parentBlockID": 183,
						"iteration":4,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa1596f0f0>",
						"u.get_label()":"1: MPI_Isend"
					},
					{
						"type":"assign",
						"lineno": 179,
						"timestamp": 1.0665168762207031,
						"id": 193,
						"parentBlockID": 183,
						"iteration":4,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa1595b320>",
						"v.get_label()":"1: MPI_Irecv"
					},
					{
						"type":"assign",
						"lineno": 178,
						"timestamp": 1.066530704498291,
						"id": 194,
						"parentBlockID": 183,
						"iteration":5,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa1595b320>",
						"u.get_label()":"1: MPI_Irecv"
					},
					{
						"type":"assign",
						"lineno": 179,
						"timestamp": 1.0665428638458252,
						"id": 195,
						"parentBlockID": 183,
						"iteration":5,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15937198>",
						"v.get_label()":"0: MPI_Init"
					},
					{
						"type":"assign",
						"lineno": 178,
						"timestamp": 1.0665559768676758,
						"id": 196,
						"parentBlockID": 183,
						"iteration":6,
						"name":"u",
						"u":"<helpers.MPINode object at 0xa15937198>",
						"u.get_label()":"0: MPI_Init"
					},
					{
						"type":"assign",
						"lineno": 179,
						"timestamp": 1.0665688514709473,
						"id": 197,
						"parentBlockID": 183,
						"iteration":6,
						"name":"v",
						"v":"<helpers.MPINode object at 0xa15937198>",
						"v.get_label()":"0: MPI_Init"
					}
					]
				},
				{
					"type":"call",
					"lineno": 180,
					"timestamp": 1.0665829181671143,
					"id": 198,
					"parentBlockID": 89,
					"func_name":"path.reverse",
					"body":[
					]
				}
				]
			},
			{
				"type":"call",
				"lineno": 151,
				"timestamp": 1.0668938159942627,
				"id": 199,
				"parentBlockID": 88,
				"func_name":"file.write",
				"body":[
				]
			},
			{
				"type":"for",
				"lineno": 152,
				"timestamp": 1.0671899318695068,
				"id": 200,
				"parentBlockID": 88,
				"target":"i",
				"body":[
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0672178268432617,
					"id": 201,
					"parentBlockID": 200,
					"targetVal":"0",
					"iteration":1,
					"func_name":"Decimal",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0686328411102295,
					"id": 202,
					"parentBlockID": 200,
					"targetVal":"0",
					"iteration":1,
					"func_name":"round",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 157,
					"timestamp": 1.069640874862671,
					"id": 203,
					"parentBlockID": 200,
					"targetVal":"0",
					"iteration":1,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0696771144866943,
					"id": 204,
					"parentBlockID": 200,
					"targetVal":"0",
					"iteration":1,
					"func_name":"critical_path[i + 1].get_crit_path_label",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0696940422058105,
					"id": 205,
					"parentBlockID": 200,
					"targetVal":"0",
					"iteration":1,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0697238445281982,
					"id": 206,
					"parentBlockID": 200,
					"targetVal":"1",
					"iteration":2,
					"func_name":"Decimal",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0697429180145264,
					"id": 207,
					"parentBlockID": 200,
					"targetVal":"1",
					"iteration":2,
					"func_name":"round",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 157,
					"timestamp": 1.0697579383850098,
					"id": 208,
					"parentBlockID": 200,
					"targetVal":"1",
					"iteration":2,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0697689056396484,
					"id": 209,
					"parentBlockID": 200,
					"targetVal":"1",
					"iteration":2,
					"func_name":"critical_path[i + 1].get_crit_path_label",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.069782018661499,
					"id": 210,
					"parentBlockID": 200,
					"targetVal":"1",
					"iteration":2,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0697968006134033,
					"id": 211,
					"parentBlockID": 200,
					"targetVal":"2",
					"iteration":3,
					"func_name":"Decimal",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0698108673095703,
					"id": 212,
					"parentBlockID": 200,
					"targetVal":"2",
					"iteration":3,
					"func_name":"round",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 157,
					"timestamp": 1.069823980331421,
					"id": 213,
					"parentBlockID": 200,
					"targetVal":"2",
					"iteration":3,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0698339939117432,
					"id": 214,
					"parentBlockID": 200,
					"targetVal":"2",
					"iteration":3,
					"func_name":"critical_path[i + 1].get_crit_path_label",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0698459148406982,
					"id": 215,
					"parentBlockID": 200,
					"targetVal":"2",
					"iteration":3,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0698659420013428,
					"id": 216,
					"parentBlockID": 200,
					"targetVal":"3",
					"iteration":4,
					"func_name":"Decimal",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0698790550231934,
					"id": 217,
					"parentBlockID": 200,
					"targetVal":"3",
					"iteration":4,
					"func_name":"round",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 157,
					"timestamp": 1.0698928833007812,
					"id": 218,
					"parentBlockID": 200,
					"targetVal":"3",
					"iteration":4,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.06990385055542,
					"id": 219,
					"parentBlockID": 200,
					"targetVal":"3",
					"iteration":4,
					"func_name":"critical_path[i + 1].get_crit_path_label",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0699148178100586,
					"id": 220,
					"parentBlockID": 200,
					"targetVal":"3",
					"iteration":4,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.069929838180542,
					"id": 221,
					"parentBlockID": 200,
					"targetVal":"4",
					"iteration":5,
					"func_name":"Decimal",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0699429512023926,
					"id": 222,
					"parentBlockID": 200,
					"targetVal":"4",
					"iteration":5,
					"func_name":"round",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 157,
					"timestamp": 1.0700249671936035,
					"id": 223,
					"parentBlockID": 200,
					"targetVal":"4",
					"iteration":5,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0700418949127197,
					"id": 224,
					"parentBlockID": 200,
					"targetVal":"4",
					"iteration":5,
					"func_name":"critical_path[i + 1].get_crit_path_label",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0700528621673584,
					"id": 225,
					"parentBlockID": 200,
					"targetVal":"4",
					"iteration":5,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.0700709819793701,
					"id": 226,
					"parentBlockID": 200,
					"targetVal":"5",
					"iteration":6,
					"func_name":"Decimal",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 158,
					"timestamp": 1.070084810256958,
					"id": 227,
					"parentBlockID": 200,
					"targetVal":"5",
					"iteration":6,
					"func_name":"round",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 157,
					"timestamp": 1.0700969696044922,
					"id": 228,
					"parentBlockID": 200,
					"targetVal":"5",
					"iteration":6,
					"func_name":"file.write",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0701079368591309,
					"id": 229,
					"parentBlockID": 200,
					"targetVal":"5",
					"iteration":6,
					"func_name":"critical_path[i + 1].get_crit_path_label",
					"body":[
					]
				},
				{
					"type":"call",
					"lineno": 159,
					"timestamp": 1.0701179504394531,
					"id": 230,
					"parentBlockID": 200,
					"targetVal":"5",
					"iteration":6,
					"func_name":"file.write",
					"body":[
					]
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 195,
			"timestamp": 1.0704100131988525,
			"id": 231,
			"parentBlockID": 1,
			"func_name":"g.draw_dot",
			"body":[
			{
				"type":"call",
				"lineno": 126,
				"timestamp": 1.0704240798950195,
				"id": 232,
				"parentBlockID": 231,
				"func_name":"os.getcwd",
				"body":[
				]
			},
			{
				"type":"call",
				"lineno": 126,
				"timestamp": 1.0704948902130127,
				"id": 233,
				"parentBlockID": 231,
				"func_name":"nx.drawing.nx_pydot.write_dot",
				"body":[
				]
			},
			{
				"type":"call",
				"lineno": 127,
				"timestamp": 1.0837688446044922,
				"id": 234,
				"parentBlockID": 231,
				"func_name":"os.getcwd",
				"body":[
				]
			},
			{
				"type":"call",
				"lineno": 127,
				"timestamp": 1.0838720798492432,
				"id": 235,
				"parentBlockID": 231,
				"func_name":"pydot.graph_from_dot_file",
				"body":[
				]
			},
			{
				"type":"call",
				"lineno": 128,
				"timestamp": 1.2737889289855957,
				"id": 236,
				"parentBlockID": 231,
				"func_name":"os.getcwd",
				"body":[
				]
			},
			{
				"type":"call",
				"lineno": 128,
				"timestamp": 1.2739300727844238,
				"id": 237,
				"parentBlockID": 231,
				"func_name":"graph.write_png",
				"body":[
				]
			}
			]
		}
		]
	}
	]
,
	"tracked":[
		{"name":"v","instances":[{"lineno":166, "offset":8},{"lineno":174, "offset":4},{"lineno":179, "offset":8}],
		"custom":["v.get_label()"]},
		{"name":"u","instances":[{"lineno":168, "offset":18},{"lineno":173, "offset":4},{"lineno":178, "offset":8}],
		"custom":["u.get_label()"]},
		{"name":"data","instances":[{"lineno":168, "offset":21}],
		"custom":[]},
		{"name":"dist[u][0] + data[0].get(weight, default_weight)","instances":[{"lineno":167, "offset":15}],
		"custom":[]}
	]
}
