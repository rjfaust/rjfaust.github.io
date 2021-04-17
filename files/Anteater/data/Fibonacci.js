FIB = {"source": "def fib(x):\n    if x<=2:\n        return 1\n    else:\n        val = fib(x-1) + fib(x-2)\n        return val\n        \n        \nif __name__==\"__main__\":\n    val = fib(10)\n    print(val)\n\n\n",
"functions": {"fib": {"start": 1, "end": 6}},
"dependencies": {"fib_return": ["fib_val"], "fib5": ["fib_x", "fib_x"], "fib_val": ["fib5", "fib5"], "fib10": [], "_val": ["fib10"]},
"loops": {},
	 "trace":[
	{
		"type":"call",
		"lineno": 10,
		"timestamp": 6.890296936035156e-05,
		"id": 1,
		"parentBlockID": 0,
		"func_name":"fib",
		"body":[
		{
			"type":"call",
			"lineno": 5,
			"timestamp": 0.00014495849609375,
			"id": 2,
			"parentBlockID": 1,
			"func_name":"fib",
			"body":[
			{
				"type":"call",
				"lineno": 5,
				"timestamp": 0.00016498565673828125,
				"id": 3,
				"parentBlockID": 2,
				"func_name":"fib",
				"body":[
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.0002009868621826172,
					"id": 4,
					"parentBlockID": 3,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.00022792816162109375,
						"id": 5,
						"parentBlockID": 4,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0002460479736328125,
							"id": 6,
							"parentBlockID": 5,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0002589225769042969,
								"id": 7,
								"parentBlockID": 6,
								"func_name":"fib",
								"body":[
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.00027179718017578125,
									"id": 8,
									"parentBlockID": 7,
									"func_name":"fib",
									"body":[
									{
										"type":"call",
										"lineno": 5,
										"timestamp": 0.0002830028533935547,
										"id": 9,
										"parentBlockID": 8,
										"func_name":"fib",
										"body":[
										]
									},
									{
										"type":"call",
										"lineno": 5,
										"timestamp": 0.0002980232238769531,
										"id": 10,
										"parentBlockID": 8,
										"func_name":"fib",
										"body":[
										]
									},
									{
										"type":"assign",
										"lineno": 5,
										"timestamp": 0.00031113624572753906,
										"id": 11,
										"parentBlockID": 8,
										"name":"val",
										"val":2
									}
									]
								},
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.00032591819763183594,
									"id": 12,
									"parentBlockID": 7,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"assign",
									"lineno": 5,
									"timestamp": 0.00033783912658691406,
									"id": 13,
									"parentBlockID": 7,
									"name":"val",
									"val":3
								}
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0003509521484375,
								"id": 14,
								"parentBlockID": 6,
								"func_name":"fib",
								"body":[
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0003609657287597656,
									"id": 15,
									"parentBlockID": 14,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0003731250762939453,
									"id": 16,
									"parentBlockID": 14,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"assign",
									"lineno": 5,
									"timestamp": 0.0003859996795654297,
									"id": 17,
									"parentBlockID": 14,
									"name":"val",
									"val":2
								}
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.00039887428283691406,
								"id": 18,
								"parentBlockID": 6,
								"name":"val",
								"val":5
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0004119873046875,
							"id": 19,
							"parentBlockID": 5,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0004208087921142578,
								"id": 20,
								"parentBlockID": 19,
								"func_name":"fib",
								"body":[
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.00043082237243652344,
									"id": 21,
									"parentBlockID": 20,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0004439353942871094,
									"id": 22,
									"parentBlockID": 20,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"assign",
									"lineno": 5,
									"timestamp": 0.00045490264892578125,
									"id": 23,
									"parentBlockID": 20,
									"name":"val",
									"val":2
								}
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0004680156707763672,
								"id": 24,
								"parentBlockID": 19,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.00047898292541503906,
								"id": 25,
								"parentBlockID": 19,
								"name":"val",
								"val":3
							}
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.000492095947265625,
							"id": 26,
							"parentBlockID": 5,
							"name":"val",
							"val":8
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0005049705505371094,
						"id": 27,
						"parentBlockID": 4,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0005140304565429688,
							"id": 28,
							"parentBlockID": 27,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0005230903625488281,
								"id": 29,
								"parentBlockID": 28,
								"func_name":"fib",
								"body":[
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0005319118499755859,
									"id": 30,
									"parentBlockID": 29,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0005431175231933594,
									"id": 31,
									"parentBlockID": 29,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"assign",
									"lineno": 5,
									"timestamp": 0.0005540847778320312,
									"id": 32,
									"parentBlockID": 29,
									"name":"val",
									"val":2
								}
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0005688667297363281,
								"id": 33,
								"parentBlockID": 28,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.000579833984375,
								"id": 34,
								"parentBlockID": 28,
								"name":"val",
								"val":3
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0005919933319091797,
							"id": 35,
							"parentBlockID": 27,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0006008148193359375,
								"id": 36,
								"parentBlockID": 35,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0006117820739746094,
								"id": 37,
								"parentBlockID": 35,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.000621795654296875,
								"id": 38,
								"parentBlockID": 35,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0006349086761474609,
							"id": 39,
							"parentBlockID": 27,
							"name":"val",
							"val":5
						}
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.0006480216979980469,
						"id": 40,
						"parentBlockID": 4,
						"name":"val",
						"val":13
					}
					]
				},
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.0007660388946533203,
					"id": 41,
					"parentBlockID": 3,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0007770061492919922,
						"id": 42,
						"parentBlockID": 41,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0007860660552978516,
							"id": 43,
							"parentBlockID": 42,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0007958412170410156,
								"id": 44,
								"parentBlockID": 43,
								"func_name":"fib",
								"body":[
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0008058547973632812,
									"id": 45,
									"parentBlockID": 44,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0008180141448974609,
									"id": 46,
									"parentBlockID": 44,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"assign",
									"lineno": 5,
									"timestamp": 0.0008289813995361328,
									"id": 47,
									"parentBlockID": 44,
									"name":"val",
									"val":2
								}
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0008420944213867188,
								"id": 48,
								"parentBlockID": 43,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0008530616760253906,
								"id": 49,
								"parentBlockID": 43,
								"name":"val",
								"val":3
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0008661746978759766,
							"id": 50,
							"parentBlockID": 42,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0008749961853027344,
								"id": 51,
								"parentBlockID": 50,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.000885009765625,
								"id": 52,
								"parentBlockID": 50,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0008959770202636719,
								"id": 53,
								"parentBlockID": 50,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0009088516235351562,
							"id": 54,
							"parentBlockID": 42,
							"name":"val",
							"val":5
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0009207725524902344,
						"id": 55,
						"parentBlockID": 41,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0009300708770751953,
							"id": 56,
							"parentBlockID": 55,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0009391307830810547,
								"id": 57,
								"parentBlockID": 56,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0009500980377197266,
								"id": 58,
								"parentBlockID": 56,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0009610652923583984,
								"id": 59,
								"parentBlockID": 56,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.000972747802734375,
							"id": 60,
							"parentBlockID": 55,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0009839534759521484,
							"id": 61,
							"parentBlockID": 55,
							"name":"val",
							"val":3
						}
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.0009958744049072266,
						"id": 62,
						"parentBlockID": 41,
						"name":"val",
						"val":8
					}
					]
				},
				{
					"type":"assign",
					"lineno": 5,
					"timestamp": 0.0010089874267578125,
					"id": 63,
					"parentBlockID": 3,
					"name":"val",
					"val":21
				}
				]
			},
			{
				"type":"call",
				"lineno": 5,
				"timestamp": 0.0010221004486083984,
				"id": 64,
				"parentBlockID": 2,
				"func_name":"fib",
				"body":[
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.00102996826171875,
					"id": 65,
					"parentBlockID": 64,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0010387897491455078,
						"id": 66,
						"parentBlockID": 65,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0010471343994140625,
							"id": 67,
							"parentBlockID": 66,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0010559558868408203,
								"id": 68,
								"parentBlockID": 67,
								"func_name":"fib",
								"body":[
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0010640621185302734,
									"id": 69,
									"parentBlockID": 68,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0010759830474853516,
									"id": 70,
									"parentBlockID": 68,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"assign",
									"lineno": 5,
									"timestamp": 0.0010869503021240234,
									"id": 71,
									"parentBlockID": 68,
									"name":"val",
									"val":2
								}
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0011000633239746094,
								"id": 72,
								"parentBlockID": 67,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0011110305786132812,
								"id": 73,
								"parentBlockID": 67,
								"name":"val",
								"val":3
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0011229515075683594,
							"id": 74,
							"parentBlockID": 66,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0011310577392578125,
								"id": 75,
								"parentBlockID": 74,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0011420249938964844,
								"id": 76,
								"parentBlockID": 74,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0011529922485351562,
								"id": 77,
								"parentBlockID": 74,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0011658668518066406,
							"id": 78,
							"parentBlockID": 66,
							"name":"val",
							"val":5
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0011777877807617188,
						"id": 79,
						"parentBlockID": 65,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0011868476867675781,
							"id": 80,
							"parentBlockID": 79,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0012328624725341797,
								"id": 81,
								"parentBlockID": 80,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0012469291687011719,
								"id": 82,
								"parentBlockID": 80,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0012581348419189453,
								"id": 83,
								"parentBlockID": 80,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0012710094451904297,
							"id": 84,
							"parentBlockID": 79,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0012810230255126953,
							"id": 85,
							"parentBlockID": 79,
							"name":"val",
							"val":3
						}
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.0012938976287841797,
						"id": 86,
						"parentBlockID": 65,
						"name":"val",
						"val":8
					}
					]
				},
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.0013058185577392578,
					"id": 87,
					"parentBlockID": 64,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0013148784637451172,
						"id": 88,
						"parentBlockID": 87,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0013229846954345703,
							"id": 89,
							"parentBlockID": 88,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0013339519500732422,
								"id": 90,
								"parentBlockID": 89,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0013530254364013672,
								"id": 91,
								"parentBlockID": 89,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0013699531555175781,
								"id": 92,
								"parentBlockID": 89,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0013949871063232422,
							"id": 93,
							"parentBlockID": 88,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0014081001281738281,
							"id": 94,
							"parentBlockID": 88,
							"name":"val",
							"val":3
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.001458883285522461,
						"id": 95,
						"parentBlockID": 87,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0014789104461669922,
							"id": 96,
							"parentBlockID": 95,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0014929771423339844,
							"id": 97,
							"parentBlockID": 95,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0015039443969726562,
							"id": 98,
							"parentBlockID": 95,
							"name":"val",
							"val":2
						}
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.0015177726745605469,
						"id": 99,
						"parentBlockID": 87,
						"name":"val",
						"val":5
					}
					]
				},
				{
					"type":"assign",
					"lineno": 5,
					"timestamp": 0.0015308856964111328,
					"id": 100,
					"parentBlockID": 64,
					"name":"val",
					"val":13
				}
				]
			},
			{
				"type":"assign",
				"lineno": 5,
				"timestamp": 0.0015430450439453125,
				"id": 101,
				"parentBlockID": 2,
				"name":"val",
				"val":34
			}
			]
		},
		{
			"type":"call",
			"lineno": 5,
			"timestamp": 0.0015559196472167969,
			"id": 102,
			"parentBlockID": 1,
			"func_name":"fib",
			"body":[
			{
				"type":"call",
				"lineno": 5,
				"timestamp": 0.00156402587890625,
				"id": 103,
				"parentBlockID": 102,
				"func_name":"fib",
				"body":[
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.0015728473663330078,
					"id": 104,
					"parentBlockID": 103,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0015819072723388672,
						"id": 105,
						"parentBlockID": 104,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0015909671783447266,
							"id": 106,
							"parentBlockID": 105,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.001600027084350586,
								"id": 107,
								"parentBlockID": 106,
								"func_name":"fib",
								"body":[
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0016100406646728516,
									"id": 108,
									"parentBlockID": 107,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"call",
									"lineno": 5,
									"timestamp": 0.0016219615936279297,
									"id": 109,
									"parentBlockID": 107,
									"func_name":"fib",
									"body":[
									]
								},
								{
									"type":"assign",
									"lineno": 5,
									"timestamp": 0.0016331672668457031,
									"id": 110,
									"parentBlockID": 107,
									"name":"val",
									"val":2
								}
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0016469955444335938,
								"id": 111,
								"parentBlockID": 106,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0016579627990722656,
								"id": 112,
								"parentBlockID": 106,
								"name":"val",
								"val":3
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.00167083740234375,
							"id": 113,
							"parentBlockID": 105,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0016798973083496094,
								"id": 114,
								"parentBlockID": 113,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.001689910888671875,
								"id": 115,
								"parentBlockID": 113,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0017008781433105469,
								"id": 116,
								"parentBlockID": 113,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.001714944839477539,
							"id": 117,
							"parentBlockID": 105,
							"name":"val",
							"val":5
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.001728057861328125,
						"id": 118,
						"parentBlockID": 104,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0017359256744384766,
							"id": 119,
							"parentBlockID": 118,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.001744985580444336,
								"id": 120,
								"parentBlockID": 119,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0017559528350830078,
								"id": 121,
								"parentBlockID": 119,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0018198490142822266,
								"id": 122,
								"parentBlockID": 119,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0018351078033447266,
							"id": 123,
							"parentBlockID": 118,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0018460750579833984,
							"id": 124,
							"parentBlockID": 118,
							"name":"val",
							"val":3
						}
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.0018579959869384766,
						"id": 125,
						"parentBlockID": 104,
						"name":"val",
						"val":8
					}
					]
				},
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.0018699169158935547,
					"id": 126,
					"parentBlockID": 103,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.001878976821899414,
						"id": 127,
						"parentBlockID": 126,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0018870830535888672,
							"id": 128,
							"parentBlockID": 127,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.001895904541015625,
								"id": 129,
								"parentBlockID": 128,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0019068717956542969,
								"id": 130,
								"parentBlockID": 128,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0019180774688720703,
								"id": 131,
								"parentBlockID": 128,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0019299983978271484,
							"id": 132,
							"parentBlockID": 127,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0019409656524658203,
							"id": 133,
							"parentBlockID": 127,
							"name":"val",
							"val":3
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.001953125,
						"id": 134,
						"parentBlockID": 126,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.001961946487426758,
							"id": 135,
							"parentBlockID": 134,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0019729137420654297,
							"id": 136,
							"parentBlockID": 134,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0019829273223876953,
							"id": 137,
							"parentBlockID": 134,
							"name":"val",
							"val":2
						}
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.001995086669921875,
						"id": 138,
						"parentBlockID": 126,
						"name":"val",
						"val":5
					}
					]
				},
				{
					"type":"assign",
					"lineno": 5,
					"timestamp": 0.002007007598876953,
					"id": 139,
					"parentBlockID": 103,
					"name":"val",
					"val":13
				}
				]
			},
			{
				"type":"call",
				"lineno": 5,
				"timestamp": 0.0020189285278320312,
				"id": 140,
				"parentBlockID": 102,
				"func_name":"fib",
				"body":[
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.0020279884338378906,
					"id": 141,
					"parentBlockID": 140,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0020360946655273438,
						"id": 142,
						"parentBlockID": 141,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0020439624786376953,
							"id": 143,
							"parentBlockID": 142,
							"func_name":"fib",
							"body":[
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.002052783966064453,
								"id": 144,
								"parentBlockID": 143,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"call",
								"lineno": 5,
								"timestamp": 0.0020639896392822266,
								"id": 145,
								"parentBlockID": 143,
								"func_name":"fib",
								"body":[
								]
							},
							{
								"type":"assign",
								"lineno": 5,
								"timestamp": 0.0020749568939208984,
								"id": 146,
								"parentBlockID": 143,
								"name":"val",
								"val":2
							}
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0020868778228759766,
							"id": 147,
							"parentBlockID": 142,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0020978450775146484,
							"id": 148,
							"parentBlockID": 142,
							"name":"val",
							"val":3
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.002110004425048828,
						"id": 149,
						"parentBlockID": 141,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0021178722381591797,
							"id": 150,
							"parentBlockID": 149,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0021288394927978516,
							"id": 151,
							"parentBlockID": 149,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.002138853073120117,
							"id": 152,
							"parentBlockID": 149,
							"name":"val",
							"val":2
						}
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.002151012420654297,
						"id": 153,
						"parentBlockID": 141,
						"name":"val",
						"val":5
					}
					]
				},
				{
					"type":"call",
					"lineno": 5,
					"timestamp": 0.002162933349609375,
					"id": 154,
					"parentBlockID": 140,
					"func_name":"fib",
					"body":[
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0021920204162597656,
						"id": 155,
						"parentBlockID": 154,
						"func_name":"fib",
						"body":[
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.002218961715698242,
							"id": 156,
							"parentBlockID": 155,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"call",
							"lineno": 5,
							"timestamp": 0.0022399425506591797,
							"id": 157,
							"parentBlockID": 155,
							"func_name":"fib",
							"body":[
							]
						},
						{
							"type":"assign",
							"lineno": 5,
							"timestamp": 0.0022537708282470703,
							"id": 158,
							"parentBlockID": 155,
							"name":"val",
							"val":2
						}
						]
					},
					{
						"type":"call",
						"lineno": 5,
						"timestamp": 0.0022690296173095703,
						"id": 159,
						"parentBlockID": 154,
						"func_name":"fib",
						"body":[
						]
					},
					{
						"type":"assign",
						"lineno": 5,
						"timestamp": 0.002279996871948242,
						"id": 160,
						"parentBlockID": 154,
						"name":"val",
						"val":3
					}
					]
				},
				{
					"type":"assign",
					"lineno": 5,
					"timestamp": 0.002293109893798828,
					"id": 161,
					"parentBlockID": 140,
					"name":"val",
					"val":8
				}
				]
			},
			{
				"type":"assign",
				"lineno": 5,
				"timestamp": 0.0023059844970703125,
				"id": 162,
				"parentBlockID": 102,
				"name":"val",
				"val":21
			}
			]
		},
		{
			"type":"assign",
			"lineno": 5,
			"timestamp": 0.0023849010467529297,
			"id": 163,
			"parentBlockID": 1,
			"name":"val",
			"val":55
		}
		]
	}
	],
	"tracked":[
		{"name":"val","instances":[{"lineno":5, "offset":8}],
		"custom":[]}
	]
}
