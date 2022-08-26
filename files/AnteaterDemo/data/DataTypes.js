DT = {"source": "import numpy as np\nimport json\n\ndef doThings(x,y):\n\n    for i in range(10):\n        z = np.random.randint(0,50,10).sum() \n        result2 = 2*x*z \n        result3 = result2 + y \n        result = pow(result3,2) \n    return result\n\ndef doStringThings(s,l):\n\n    offset = 0\n    extraChars = l-len(s)\n    s_new = s \n    for i in range(extraChars):\n        if offset > 3:\n            offset = 0\n        s_new = s_new + s[offset]  \n        offset += 1\n    return s_new\n\n\ndef do_dict_things(d, keyL):\n    a = \"abcdefghijklmnopqrstuvwxyz\"\n    #generate key\n    vals = np.random.randint(0,26,keyL) \n    key = \"\" \n    for v in vals:\n        key = key + a[v]\n    #create val\n    d.update({key:pow(keyL,2)})\n    return d\n\nif __name__==\"__main__\":\n    xVals = np.random.randint(0,50,10)\n    yVals = np.random.randint(0, 50, 10)\n\n    l = np.random.randint(5,10,10)\n    s= \"test\"\n\n    d = {}\n    keys = np.random.randint(1,8,10)\n    for i in range(len(keys)):\n        d = do_dict_things(d,keys[i])\n        j = i * 2\n        z = doThings(xVals[i], yVals[i])\n        s_new = doStringThings(s,l[i])\n\n\n\n\n\n\n",
"functions": {"doThings": {"start": 4, "end": 11}, "doStringThings": {"start": 13, "end": 23}, "do_dict_things": {"start": 26, "end": 35}},
"dependencies": {"np.random.randint7": [], "np.random.randint7.sum7": [], "doThings_z": ["np.random.randint7.sum7"], "doThings_result2": ["doThings_x", "doThings_z"], "doThings_result3": ["doThings_result2", "doThings_y"], "pow10": ["doThings_result3"], "doThings_result": ["pow10"], "doThings_return": ["doThings_result"], "doStringThings_offset": ["doStringThings_offset"], "len16": ["doStringThings_s"], "doStringThings_extraChars": ["doStringThings_l", "len16"], "doStringThings_s_new": ["doStringThings_s", "doStringThings_s_new", "doStringThings_"], "doStringThings_return": ["doStringThings_s_new"], "do_dict_things_a": [], "np.random.randint29": ["do_dict_things_keyL"], "do_dict_things_vals": ["np.random.randint29"], "do_dict_things_key": ["do_dict_things_key", "do_dict_things_"], "do_dict_things_return": ["do_dict_things_d"], "np.random.randint38": [], "_xVals": ["np.random.randint38"], "np.random.randint39": [], "_yVals": ["np.random.randint39"], "np.random.randint41": [], "_l": ["np.random.randint41"], "_s": [], "_d": ["do_dict_things47"], "np.random.randint45": [], "_keys": ["np.random.randint45"], "do_dict_things47": ["_d", "_"], "_j": ["_i"], "doThings49": ["_", "_"], "_z": ["doThings49"], "doStringThings50": ["_s", "_"], "_s_new": ["doStringThings50"]},

"loops": {"for-6": {"start": 6, "end": 10}, "for-18": {"start": 18, "end": 22}, "for-31": {"start": 31, "end": 32}, "for-46": {"start": 46, "end": 50}},
	 "trace":[
	{
		"type":"for",
		"lineno": 46,
		"timestamp": 7.128715515136719e-05,
		"id": 1,
		"parentBlockID": 0,
		"target":"i",
		"body":[
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.00011014938354492188,
			"id": 2,
			"parentBlockID": 1,
			"targetVal":"0",
			"iteration":1,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.0002162456512451172,
				"id": 3,
				"parentBlockID": 2,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":50
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.0002491474151611328,
				"id": 4,
				"parentBlockID": 2,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.00026416778564453125,
				"id": 5,
				"parentBlockID": 2,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.00027632713317871094,
					"id": 6,
					"parentBlockID": 5,
					"targetVal":"4",
					"iteration":1,
					"name":"key",
					"key":"e"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.00029730796813964844,
					"id": 7,
					"parentBlockID": 5,
					"targetVal":"24",
					"iteration":2,
					"name":"key",
					"key":"ey"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.0003173351287841797,
					"id": 8,
					"parentBlockID": 5,
					"targetVal":"3",
					"iteration":3,
					"name":"key",
					"key":"eyd"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.0003371238708496094,
					"id": 9,
					"parentBlockID": 5,
					"targetVal":"8",
					"iteration":4,
					"name":"key",
					"key":"eydi"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.00036025047302246094,
					"id": 10,
					"parentBlockID": 5,
					"targetVal":"11",
					"iteration":5,
					"name":"key",
					"key":"eydil"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.00038623809814453125,
				"id": 11,
				"parentBlockID": 2,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.00044727325439453125,
			"id": 12,
			"parentBlockID": 1,
			"targetVal":"0",
			"iteration":1,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.00046634674072265625,
				"id": 13,
				"parentBlockID": 12,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0005221366882324219,
					"id": 14,
					"parentBlockID": 13,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":181
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0005671977996826172,
					"id": 15,
					"parentBlockID": 13,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":6154
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0005853176116943359,
					"id": 16,
					"parentBlockID": 13,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":6167
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0005991458892822266,
					"id": 17,
					"parentBlockID": 13,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":38031889
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0006272792816162109,
					"id": 18,
					"parentBlockID": 13,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":262
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0006411075592041016,
					"id": 19,
					"parentBlockID": 13,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":8908
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0006542205810546875,
					"id": 20,
					"parentBlockID": 13,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":8921
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0006670951843261719,
					"id": 21,
					"parentBlockID": 13,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":79584241
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0006871223449707031,
					"id": 22,
					"parentBlockID": 13,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":158
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0007002353668212891,
					"id": 23,
					"parentBlockID": 13,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":5372
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0007121562957763672,
					"id": 24,
					"parentBlockID": 13,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":5385
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0007312297821044922,
					"id": 25,
					"parentBlockID": 13,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":28998225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0007531642913818359,
					"id": 26,
					"parentBlockID": 13,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":276
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0007662773132324219,
					"id": 27,
					"parentBlockID": 13,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":9384
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0007772445678710938,
					"id": 28,
					"parentBlockID": 13,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":9397
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0007910728454589844,
					"id": 29,
					"parentBlockID": 13,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":88303609
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0008091926574707031,
					"id": 30,
					"parentBlockID": 13,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":194
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0008220672607421875,
					"id": 31,
					"parentBlockID": 13,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":6596
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0008351802825927734,
					"id": 32,
					"parentBlockID": 13,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":6609
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0008482933044433594,
					"id": 33,
					"parentBlockID": 13,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":43678881
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0008671283721923828,
					"id": 34,
					"parentBlockID": 13,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":178
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0008881092071533203,
					"id": 35,
					"parentBlockID": 13,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":6052
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0009090900421142578,
					"id": 36,
					"parentBlockID": 13,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":6065
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0009322166442871094,
					"id": 37,
					"parentBlockID": 13,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":36784225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0009682178497314453,
					"id": 38,
					"parentBlockID": 13,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":281
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0011200904846191406,
					"id": 39,
					"parentBlockID": 13,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":9554
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0011441707611083984,
					"id": 40,
					"parentBlockID": 13,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":9567
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0011630058288574219,
					"id": 41,
					"parentBlockID": 13,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":91527489
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0012023448944091797,
					"id": 42,
					"parentBlockID": 13,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":181
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0012919902801513672,
					"id": 43,
					"parentBlockID": 13,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":6154
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0013132095336914062,
					"id": 44,
					"parentBlockID": 13,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":6167
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.00133514404296875,
					"id": 45,
					"parentBlockID": 13,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":38031889
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.001377105712890625,
					"id": 46,
					"parentBlockID": 13,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":326
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0014002323150634766,
					"id": 47,
					"parentBlockID": 13,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":11084
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0014221668243408203,
					"id": 48,
					"parentBlockID": 13,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":11097
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0014462471008300781,
					"id": 49,
					"parentBlockID": 13,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":123143409
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0014832019805908203,
					"id": 50,
					"parentBlockID": 13,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":245
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.001516103744506836,
					"id": 51,
					"parentBlockID": 13,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":8330
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0015392303466796875,
					"id": 52,
					"parentBlockID": 13,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":8343
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0015621185302734375,
					"id": 53,
					"parentBlockID": 13,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":69605649
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.0015931129455566406,
			"id": 54,
			"parentBlockID": 1,
			"targetVal":"0",
			"iteration":1,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.0016262531280517578,
				"id": 55,
				"parentBlockID": 54,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.00164031982421875,
				"id": 56,
				"parentBlockID": 54,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0016613006591796875,
					"id": 57,
					"parentBlockID": 56,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.001680135726928711,
					"id": 58,
					"parentBlockID": 56,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0017499923706054688,
					"id": 59,
					"parentBlockID": 56,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.0017693042755126953,
					"id": 60,
					"parentBlockID": 56,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0018491744995117188,
					"id": 61,
					"parentBlockID": 56,
					"targetVal":"2",
					"iteration":3,
					"name":"s[offset]",
					"s[offset]":"s"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.001867055892944336,
					"id": 62,
					"parentBlockID": 56,
					"targetVal":"2",
					"iteration":3,
					"name":"s_new",
					"s_new":"testtes"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0018832683563232422,
					"id": 63,
					"parentBlockID": 56,
					"targetVal":"3",
					"iteration":4,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.001894235610961914,
					"id": 64,
					"parentBlockID": 56,
					"targetVal":"3",
					"iteration":4,
					"name":"s_new",
					"s_new":"testtest"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0019083023071289062,
					"id": 65,
					"parentBlockID": 56,
					"targetVal":"4",
					"iteration":5,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.0019192695617675781,
					"id": 66,
					"parentBlockID": 56,
					"targetVal":"4",
					"iteration":5,
					"name":"s_new",
					"s_new":"testtestt"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.0019409656524658203,
			"id": 67,
			"parentBlockID": 1,
			"targetVal":"1",
			"iteration":2,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.0019762516021728516,
				"id": 68,
				"parentBlockID": 67,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":24
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.0019922256469726562,
				"id": 69,
				"parentBlockID": 67,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.0020012855529785156,
				"id": 70,
				"parentBlockID": 67,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.002009153366088867,
					"id": 71,
					"parentBlockID": 70,
					"targetVal":"24",
					"iteration":1,
					"name":"key",
					"key":"y"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.0020232200622558594,
				"id": 72,
				"parentBlockID": 67,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.002039194107055664,
			"id": 73,
			"parentBlockID": 1,
			"targetVal":"1",
			"iteration":2,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.0020532608032226562,
				"id": 74,
				"parentBlockID": 73,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.002079010009765625,
					"id": 75,
					"parentBlockID": 74,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":181
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0021572113037109375,
					"id": 76,
					"parentBlockID": 74,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":724
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.002173185348510742,
					"id": 77,
					"parentBlockID": 74,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":727
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.002187013626098633,
					"id": 78,
					"parentBlockID": 74,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":528529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0022132396697998047,
					"id": 79,
					"parentBlockID": 74,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":302
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0022263526916503906,
					"id": 80,
					"parentBlockID": 74,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":1208
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0022382736206054688,
					"id": 81,
					"parentBlockID": 74,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":1211
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.002251148223876953,
					"id": 82,
					"parentBlockID": 74,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":1466521
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.002300262451171875,
					"id": 83,
					"parentBlockID": 74,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":147
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0023412704467773438,
					"id": 84,
					"parentBlockID": 74,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":588
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0023641586303710938,
					"id": 85,
					"parentBlockID": 74,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":591
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.002386331558227539,
					"id": 86,
					"parentBlockID": 74,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":349281
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.002428293228149414,
					"id": 87,
					"parentBlockID": 74,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":242
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.002452373504638672,
					"id": 88,
					"parentBlockID": 74,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":968
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0024733543395996094,
					"id": 89,
					"parentBlockID": 74,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":971
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.002496004104614258,
					"id": 90,
					"parentBlockID": 74,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":942841
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0025310516357421875,
					"id": 91,
					"parentBlockID": 74,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":221
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.002554178237915039,
					"id": 92,
					"parentBlockID": 74,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":884
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0025742053985595703,
					"id": 93,
					"parentBlockID": 74,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":887
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.002596139907836914,
					"id": 94,
					"parentBlockID": 74,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":786769
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0026302337646484375,
					"id": 95,
					"parentBlockID": 74,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":280
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0026521682739257812,
					"id": 96,
					"parentBlockID": 74,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":1120
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0026731491088867188,
					"id": 97,
					"parentBlockID": 74,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":1123
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.00269317626953125,
					"id": 98,
					"parentBlockID": 74,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":1261129
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0027980804443359375,
					"id": 99,
					"parentBlockID": 74,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":192
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0028302669525146484,
					"id": 100,
					"parentBlockID": 74,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":768
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0028541088104248047,
					"id": 101,
					"parentBlockID": 74,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":771
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0028772354125976562,
					"id": 102,
					"parentBlockID": 74,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":594441
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.002916097640991211,
					"id": 103,
					"parentBlockID": 74,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":234
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.002943277359008789,
					"id": 104,
					"parentBlockID": 74,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":936
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0029671192169189453,
					"id": 105,
					"parentBlockID": 74,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":939
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.002988100051879883,
					"id": 106,
					"parentBlockID": 74,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":881721
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.003050088882446289,
					"id": 107,
					"parentBlockID": 74,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":219
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.003075122833251953,
					"id": 108,
					"parentBlockID": 74,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":876
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0030951499938964844,
					"id": 109,
					"parentBlockID": 74,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":879
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0031151771545410156,
					"id": 110,
					"parentBlockID": 74,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":772641
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0031533241271972656,
					"id": 111,
					"parentBlockID": 74,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":260
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.003258228302001953,
					"id": 112,
					"parentBlockID": 74,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":1040
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.003283262252807617,
					"id": 113,
					"parentBlockID": 74,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":1043
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0033042430877685547,
					"id": 114,
					"parentBlockID": 74,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":1087849
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.0033342838287353516,
			"id": 115,
			"parentBlockID": 1,
			"targetVal":"1",
			"iteration":2,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.0033631324768066406,
				"id": 116,
				"parentBlockID": 115,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.003379344940185547,
				"id": 117,
				"parentBlockID": 115,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0033931732177734375,
					"id": 118,
					"parentBlockID": 117,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.003412961959838867,
					"id": 119,
					"parentBlockID": 117,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0034351348876953125,
					"id": 120,
					"parentBlockID": 117,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.003450155258178711,
					"id": 121,
					"parentBlockID": 117,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.0034742355346679688,
			"id": 122,
			"parentBlockID": 1,
			"targetVal":"2",
			"iteration":3,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.003511190414428711,
				"id": 123,
				"parentBlockID": 122,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":23
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.0035309791564941406,
				"id": 124,
				"parentBlockID": 122,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.003542184829711914,
				"id": 125,
				"parentBlockID": 122,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.003551959991455078,
					"id": 126,
					"parentBlockID": 125,
					"targetVal":"18",
					"iteration":1,
					"name":"key",
					"key":"s"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.0035703182220458984,
					"id": 127,
					"parentBlockID": 125,
					"targetVal":"5",
					"iteration":2,
					"name":"key",
					"key":"sf"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.003591299057006836,
				"id": 128,
				"parentBlockID": 122,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.0037271976470947266,
			"id": 129,
			"parentBlockID": 1,
			"targetVal":"2",
			"iteration":3,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.003750324249267578,
				"id": 130,
				"parentBlockID": 129,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0037910938262939453,
					"id": 131,
					"parentBlockID": 130,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":269
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0038111209869384766,
					"id": 132,
					"parentBlockID": 130,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0038290023803710938,
					"id": 133,
					"parentBlockID": 130,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0038483142852783203,
					"id": 134,
					"parentBlockID": 130,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0038781166076660156,
					"id": 135,
					"parentBlockID": 130,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":233
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.0038971900939941406,
					"id": 136,
					"parentBlockID": 130,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0039141178131103516,
					"id": 137,
					"parentBlockID": 130,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0039331912994384766,
					"id": 138,
					"parentBlockID": 130,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.004057168960571289,
					"id": 139,
					"parentBlockID": 130,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":209
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.004082202911376953,
					"id": 140,
					"parentBlockID": 130,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0041141510009765625,
					"id": 141,
					"parentBlockID": 130,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0041391849517822266,
					"id": 142,
					"parentBlockID": 130,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0041730403900146484,
					"id": 143,
					"parentBlockID": 130,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":314
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.00455021858215332,
					"id": 144,
					"parentBlockID": 130,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.005232095718383789,
					"id": 145,
					"parentBlockID": 130,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.005259990692138672,
					"id": 146,
					"parentBlockID": 130,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0053331851959228516,
					"id": 147,
					"parentBlockID": 130,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":252
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.005361318588256836,
					"id": 148,
					"parentBlockID": 130,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.005492210388183594,
					"id": 149,
					"parentBlockID": 130,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.005521297454833984,
					"id": 150,
					"parentBlockID": 130,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.005564212799072266,
					"id": 151,
					"parentBlockID": 130,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":316
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.005589008331298828,
					"id": 152,
					"parentBlockID": 130,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.005609989166259766,
					"id": 153,
					"parentBlockID": 130,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.005633115768432617,
					"id": 154,
					"parentBlockID": 130,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.005669116973876953,
					"id": 155,
					"parentBlockID": 130,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":161
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.005692243576049805,
					"id": 156,
					"parentBlockID": 130,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.005713224411010742,
					"id": 157,
					"parentBlockID": 130,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.005736351013183594,
					"id": 158,
					"parentBlockID": 130,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.005769968032836914,
					"id": 159,
					"parentBlockID": 130,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":241
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.005793094635009766,
					"id": 160,
					"parentBlockID": 130,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.005813121795654297,
					"id": 161,
					"parentBlockID": 130,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.005836009979248047,
					"id": 162,
					"parentBlockID": 130,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.00588226318359375,
					"id": 163,
					"parentBlockID": 130,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":246
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.005924224853515625,
					"id": 164,
					"parentBlockID": 130,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.005948305130004883,
					"id": 165,
					"parentBlockID": 130,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.005971193313598633,
					"id": 166,
					"parentBlockID": 130,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":529
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.006015300750732422,
					"id": 167,
					"parentBlockID": 130,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":223
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.006039142608642578,
					"id": 168,
					"parentBlockID": 130,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":0
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.006060123443603516,
					"id": 169,
					"parentBlockID": 130,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":23
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.006082057952880859,
					"id": 170,
					"parentBlockID": 130,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":529
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.0061151981353759766,
			"id": 171,
			"parentBlockID": 1,
			"targetVal":"2",
			"iteration":3,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.006147146224975586,
				"id": 172,
				"parentBlockID": 171,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.0061643123626708984,
				"id": 173,
				"parentBlockID": 171,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.006180286407470703,
					"id": 174,
					"parentBlockID": 173,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.006201267242431641,
					"id": 175,
					"parentBlockID": 173,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.006225109100341797,
					"id": 176,
					"parentBlockID": 173,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.006245136260986328,
					"id": 177,
					"parentBlockID": 173,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.006275177001953125,
			"id": 178,
			"parentBlockID": 1,
			"targetVal":"3",
			"iteration":4,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.006313323974609375,
				"id": 179,
				"parentBlockID": 178,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":108
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.0063321590423583984,
				"id": 180,
				"parentBlockID": 178,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.006345987319946289,
				"id": 181,
				"parentBlockID": 178,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.006356954574584961,
					"id": 182,
					"parentBlockID": 181,
					"targetVal":"17",
					"iteration":1,
					"name":"key",
					"key":"r"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.006377220153808594,
					"id": 183,
					"parentBlockID": 181,
					"targetVal":"20",
					"iteration":2,
					"name":"key",
					"key":"ru"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.006395101547241211,
					"id": 184,
					"parentBlockID": 181,
					"targetVal":"25",
					"iteration":3,
					"name":"key",
					"key":"ruz"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.00641632080078125,
					"id": 185,
					"parentBlockID": 181,
					"targetVal":"17",
					"iteration":4,
					"name":"key",
					"key":"ruzr"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.006509065628051758,
					"id": 186,
					"parentBlockID": 181,
					"targetVal":"20",
					"iteration":5,
					"name":"key",
					"key":"ruzru"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.006530046463012695,
					"id": 187,
					"parentBlockID": 181,
					"targetVal":"9",
					"iteration":6,
					"name":"key",
					"key":"ruzruj"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.006551027297973633,
				"id": 188,
				"parentBlockID": 178,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.006747245788574219,
			"id": 189,
			"parentBlockID": 1,
			"targetVal":"3",
			"iteration":4,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.006776094436645508,
				"id": 190,
				"parentBlockID": 189,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.006819248199462891,
					"id": 191,
					"parentBlockID": 190,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":287
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.006846189498901367,
					"id": 192,
					"parentBlockID": 190,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":574
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0068683624267578125,
					"id": 193,
					"parentBlockID": 190,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":575
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.006891012191772461,
					"id": 194,
					"parentBlockID": 190,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":330625
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.006926059722900391,
					"id": 195,
					"parentBlockID": 190,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":201
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.006946086883544922,
					"id": 196,
					"parentBlockID": 190,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":402
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.006965160369873047,
					"id": 197,
					"parentBlockID": 190,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":403
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.006985187530517578,
					"id": 198,
					"parentBlockID": 190,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":162409
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.00702214241027832,
					"id": 199,
					"parentBlockID": 190,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":364
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007045269012451172,
					"id": 200,
					"parentBlockID": 190,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":728
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.007066249847412109,
					"id": 201,
					"parentBlockID": 190,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":729
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.007088184356689453,
					"id": 202,
					"parentBlockID": 190,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":531441
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.007148027420043945,
					"id": 203,
					"parentBlockID": 190,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":143
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007172107696533203,
					"id": 204,
					"parentBlockID": 190,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":286
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.0071942806243896484,
					"id": 205,
					"parentBlockID": 190,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":287
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0072171688079833984,
					"id": 206,
					"parentBlockID": 190,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":82369
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.007252216339111328,
					"id": 207,
					"parentBlockID": 190,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":229
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007275104522705078,
					"id": 208,
					"parentBlockID": 190,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":458
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.007297039031982422,
					"id": 209,
					"parentBlockID": 190,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":459
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.007319211959838867,
					"id": 210,
					"parentBlockID": 190,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":210681
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.007352113723754883,
					"id": 211,
					"parentBlockID": 190,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":268
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007375240325927734,
					"id": 212,
					"parentBlockID": 190,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":536
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.007397174835205078,
					"id": 213,
					"parentBlockID": 190,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":537
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.007419109344482422,
					"id": 214,
					"parentBlockID": 190,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":288369
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.007453203201293945,
					"id": 215,
					"parentBlockID": 190,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":253
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007529258728027344,
					"id": 216,
					"parentBlockID": 190,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":506
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.007561206817626953,
					"id": 217,
					"parentBlockID": 190,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":507
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.007586240768432617,
					"id": 218,
					"parentBlockID": 190,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":257049
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.007636308670043945,
					"id": 219,
					"parentBlockID": 190,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":306
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007661104202270508,
					"id": 220,
					"parentBlockID": 190,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":612
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.007682085037231445,
					"id": 221,
					"parentBlockID": 190,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":613
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.007786989212036133,
					"id": 222,
					"parentBlockID": 190,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":375769
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.007832050323486328,
					"id": 223,
					"parentBlockID": 190,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":313
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007857322692871094,
					"id": 224,
					"parentBlockID": 190,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":626
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.007878303527832031,
					"id": 225,
					"parentBlockID": 190,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":627
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.007901191711425781,
					"id": 226,
					"parentBlockID": 190,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":393129
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.007937192916870117,
					"id": 227,
					"parentBlockID": 190,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":240
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.007960081100463867,
					"id": 228,
					"parentBlockID": 190,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":480
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.007981061935424805,
					"id": 229,
					"parentBlockID": 190,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":481
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.00800323486328125,
					"id": 230,
					"parentBlockID": 190,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":231361
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.008036136627197266,
			"id": 231,
			"parentBlockID": 1,
			"targetVal":"3",
			"iteration":4,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.008066177368164062,
				"id": 232,
				"parentBlockID": 231,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.008080244064331055,
				"id": 233,
				"parentBlockID": 231,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.008098125457763672,
					"id": 234,
					"parentBlockID": 233,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.008180379867553711,
					"id": 235,
					"parentBlockID": 233,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.008201360702514648,
					"id": 236,
					"parentBlockID": 233,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.008283138275146484,
					"id": 237,
					"parentBlockID": 233,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.008319377899169922,
			"id": 238,
			"parentBlockID": 1,
			"targetVal":"4",
			"iteration":5,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.008368253707885742,
				"id": 239,
				"parentBlockID": 238,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":21
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.008390188217163086,
				"id": 240,
				"parentBlockID": 238,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.00840616226196289,
				"id": 241,
				"parentBlockID": 238,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.008419036865234375,
					"id": 242,
					"parentBlockID": 241,
					"targetVal":"7",
					"iteration":1,
					"name":"key",
					"key":"h"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.008462190628051758,
					"id": 243,
					"parentBlockID": 241,
					"targetVal":"2",
					"iteration":2,
					"name":"key",
					"key":"hc"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.008491992950439453,
					"id": 244,
					"parentBlockID": 241,
					"targetVal":"12",
					"iteration":3,
					"name":"key",
					"key":"hcm"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.008520364761352539,
				"id": 245,
				"parentBlockID": 238,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.008546113967895508,
			"id": 246,
			"parentBlockID": 1,
			"targetVal":"4",
			"iteration":5,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.00856924057006836,
				"id": 247,
				"parentBlockID": 246,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.008608102798461914,
					"id": 248,
					"parentBlockID": 247,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":353
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.008634090423583984,
					"id": 249,
					"parentBlockID": 247,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":28240
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.00865626335144043,
					"id": 250,
					"parentBlockID": 247,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":28255
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.008680343627929688,
					"id": 251,
					"parentBlockID": 247,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":798345025
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.008717060089111328,
					"id": 252,
					"parentBlockID": 247,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":269
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.008741140365600586,
					"id": 253,
					"parentBlockID": 247,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":21520
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.008762121200561523,
					"id": 254,
					"parentBlockID": 247,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":21535
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.008785247802734375,
					"id": 255,
					"parentBlockID": 247,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":463756225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.008820295333862305,
					"id": 256,
					"parentBlockID": 247,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":141
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.008844137191772461,
					"id": 257,
					"parentBlockID": 247,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":11280
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.008865118026733398,
					"id": 258,
					"parentBlockID": 247,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":11295
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.008956193923950195,
					"id": 259,
					"parentBlockID": 247,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":127577025
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.009000301361083984,
					"id": 260,
					"parentBlockID": 247,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":236
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.009023189544677734,
					"id": 261,
					"parentBlockID": 247,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":18880
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.009045124053955078,
					"id": 262,
					"parentBlockID": 247,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":18895
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.009067058563232422,
					"id": 263,
					"parentBlockID": 247,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":357021025
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.009104251861572266,
					"id": 264,
					"parentBlockID": 247,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":265
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.00912618637084961,
					"id": 265,
					"parentBlockID": 247,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":21200
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.009147167205810547,
					"id": 266,
					"parentBlockID": 247,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":21215
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.009170293807983398,
					"id": 267,
					"parentBlockID": 247,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":450076225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.009203195571899414,
					"id": 268,
					"parentBlockID": 247,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":280
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.009226083755493164,
					"id": 269,
					"parentBlockID": 247,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":22400
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.009246349334716797,
					"id": 270,
					"parentBlockID": 247,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":22415
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.00926828384399414,
					"id": 271,
					"parentBlockID": 247,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":502432225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.009302139282226562,
					"id": 272,
					"parentBlockID": 247,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":364
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.009325027465820312,
					"id": 273,
					"parentBlockID": 247,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":29120
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.00934600830078125,
					"id": 274,
					"parentBlockID": 247,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":29135
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.009369134902954102,
					"id": 275,
					"parentBlockID": 247,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":848848225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.009403228759765625,
					"id": 276,
					"parentBlockID": 247,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":205
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.009427309036254883,
					"id": 277,
					"parentBlockID": 247,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":16400
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.00944828987121582,
					"id": 278,
					"parentBlockID": 247,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":16415
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.009470224380493164,
					"id": 279,
					"parentBlockID": 247,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":269452225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.009505033493041992,
					"id": 280,
					"parentBlockID": 247,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":259
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.009527206420898438,
					"id": 281,
					"parentBlockID": 247,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":20720
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.009548187255859375,
					"id": 282,
					"parentBlockID": 247,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":20735
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.009570121765136719,
					"id": 283,
					"parentBlockID": 247,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":429940225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.009604215621948242,
					"id": 284,
					"parentBlockID": 247,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":268
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.009626150131225586,
					"id": 285,
					"parentBlockID": 247,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":21440
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.009647130966186523,
					"id": 286,
					"parentBlockID": 247,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":21455
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.009670257568359375,
					"id": 287,
					"parentBlockID": 247,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":460317025
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.009705305099487305,
			"id": 288,
			"parentBlockID": 1,
			"targetVal":"4",
			"iteration":5,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.009735345840454102,
				"id": 289,
				"parentBlockID": 288,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.009752035140991211,
				"id": 290,
				"parentBlockID": 288,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.009768247604370117,
					"id": 291,
					"parentBlockID": 290,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.009789228439331055,
					"id": 292,
					"parentBlockID": 290,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.009815216064453125,
					"id": 293,
					"parentBlockID": 290,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.009835004806518555,
					"id": 294,
					"parentBlockID": 290,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.009931087493896484,
					"id": 295,
					"parentBlockID": 290,
					"targetVal":"2",
					"iteration":3,
					"name":"s[offset]",
					"s[offset]":"s"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.009954214096069336,
					"id": 296,
					"parentBlockID": 290,
					"targetVal":"2",
					"iteration":3,
					"name":"s_new",
					"s_new":"testtes"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.00997614860534668,
					"id": 297,
					"parentBlockID": 290,
					"targetVal":"3",
					"iteration":4,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.009994983673095703,
					"id": 298,
					"parentBlockID": 290,
					"targetVal":"3",
					"iteration":4,
					"name":"s_new",
					"s_new":"testtest"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.010027170181274414,
			"id": 299,
			"parentBlockID": 1,
			"targetVal":"5",
			"iteration":6,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.01007223129272461,
				"id": 300,
				"parentBlockID": 299,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":12
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.010094165802001953,
				"id": 301,
				"parentBlockID": 299,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.010109186172485352,
				"id": 302,
				"parentBlockID": 299,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.010122060775756836,
					"id": 303,
					"parentBlockID": 302,
					"targetVal":"12",
					"iteration":1,
					"name":"key",
					"key":"m"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.010148286819458008,
				"id": 304,
				"parentBlockID": 299,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.010173320770263672,
			"id": 305,
			"parentBlockID": 1,
			"targetVal":"5",
			"iteration":6,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.010197162628173828,
				"id": 306,
				"parentBlockID": 305,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.010232210159301758,
					"id": 307,
					"parentBlockID": 306,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":224
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.010258197784423828,
					"id": 308,
					"parentBlockID": 306,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":12544
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.010280370712280273,
					"id": 309,
					"parentBlockID": 306,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":12564
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.010299205780029297,
					"id": 310,
					"parentBlockID": 306,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":157854096
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.010352134704589844,
					"id": 311,
					"parentBlockID": 306,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":217
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.010375261306762695,
					"id": 312,
					"parentBlockID": 306,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":12152
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.010396242141723633,
					"id": 313,
					"parentBlockID": 306,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":12172
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.010418176651000977,
					"id": 314,
					"parentBlockID": 306,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":148157584
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.010454177856445312,
					"id": 315,
					"parentBlockID": 306,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":325
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.010495424270629883,
					"id": 316,
					"parentBlockID": 306,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":18200
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01051640510559082,
					"id": 317,
					"parentBlockID": 306,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":18220
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.010538101196289062,
					"id": 318,
					"parentBlockID": 306,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":331968400
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.010573148727416992,
					"id": 319,
					"parentBlockID": 306,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":198
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.010593175888061523,
					"id": 320,
					"parentBlockID": 306,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":11088
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.010612249374389648,
					"id": 321,
					"parentBlockID": 306,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":11108
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.010631322860717773,
					"id": 322,
					"parentBlockID": 306,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":123387664
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.010664224624633789,
					"id": 323,
					"parentBlockID": 306,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":274
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01068735122680664,
					"id": 324,
					"parentBlockID": 306,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":15344
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.010707378387451172,
					"id": 325,
					"parentBlockID": 306,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":15364
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.01072835922241211,
					"id": 326,
					"parentBlockID": 306,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":236052496
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01076507568359375,
					"id": 327,
					"parentBlockID": 306,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":279
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.010786056518554688,
					"id": 328,
					"parentBlockID": 306,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":15624
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.010806083679199219,
					"id": 329,
					"parentBlockID": 306,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":15644
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.010833263397216797,
					"id": 330,
					"parentBlockID": 306,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":244734736
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.010869026184082031,
					"id": 331,
					"parentBlockID": 306,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":194
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.010969161987304688,
					"id": 332,
					"parentBlockID": 306,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":10864
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01099538803100586,
					"id": 333,
					"parentBlockID": 306,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":10884
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.011017322540283203,
					"id": 334,
					"parentBlockID": 306,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":118461456
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.011057138442993164,
					"id": 335,
					"parentBlockID": 306,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":248
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.011080265045166016,
					"id": 336,
					"parentBlockID": 306,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":13888
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.011100292205810547,
					"id": 337,
					"parentBlockID": 306,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":13908
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.011121273040771484,
					"id": 338,
					"parentBlockID": 306,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":193432464
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0111541748046875,
					"id": 339,
					"parentBlockID": 306,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":271
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.011175155639648438,
					"id": 340,
					"parentBlockID": 306,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":15176
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.011194229125976562,
					"id": 341,
					"parentBlockID": 306,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":15196
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.01121830940246582,
					"id": 342,
					"parentBlockID": 306,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":230918416
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.011268138885498047,
					"id": 343,
					"parentBlockID": 306,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":254
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.011289119720458984,
					"id": 344,
					"parentBlockID": 306,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":14224
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.011309146881103516,
					"id": 345,
					"parentBlockID": 306,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":14244
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.011327981948852539,
					"id": 346,
					"parentBlockID": 306,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":202891536
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.011358261108398438,
			"id": 347,
			"parentBlockID": 1,
			"targetVal":"5",
			"iteration":6,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.011382102966308594,
				"id": 348,
				"parentBlockID": 347,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.011396169662475586,
				"id": 349,
				"parentBlockID": 347,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.011413097381591797,
					"id": 350,
					"parentBlockID": 349,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.011432170867919922,
					"id": 351,
					"parentBlockID": 349,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.011454343795776367,
					"id": 352,
					"parentBlockID": 349,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.01147007942199707,
					"id": 353,
					"parentBlockID": 349,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.011500120162963867,
			"id": 354,
			"parentBlockID": 1,
			"targetVal":"6",
			"iteration":7,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.011536121368408203,
				"id": 355,
				"parentBlockID": 354,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":29
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.011555194854736328,
				"id": 356,
				"parentBlockID": 354,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.011568307876586914,
				"id": 357,
				"parentBlockID": 354,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.011579275131225586,
					"id": 358,
					"parentBlockID": 357,
					"targetVal":"14",
					"iteration":1,
					"name":"key",
					"key":"o"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.01160120964050293,
					"id": 359,
					"parentBlockID": 357,
					"targetVal":"15",
					"iteration":2,
					"name":"key",
					"key":"op"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.011622190475463867,
				"id": 360,
				"parentBlockID": 354,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.01166534423828125,
			"id": 361,
			"parentBlockID": 1,
			"targetVal":"6",
			"iteration":7,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.011686325073242188,
				"id": 362,
				"parentBlockID": 361,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.011719226837158203,
					"id": 363,
					"parentBlockID": 362,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":147
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01174306869506836,
					"id": 364,
					"parentBlockID": 362,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":12054
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.011763334274291992,
					"id": 365,
					"parentBlockID": 362,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":12093
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.011782169342041016,
					"id": 366,
					"parentBlockID": 362,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":146240649
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.011825323104858398,
					"id": 367,
					"parentBlockID": 362,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":276
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.011846303939819336,
					"id": 368,
					"parentBlockID": 362,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":22632
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.011934995651245117,
					"id": 369,
					"parentBlockID": 362,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":22671
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.011959075927734375,
					"id": 370,
					"parentBlockID": 362,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":513974241
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.011997222900390625,
					"id": 371,
					"parentBlockID": 362,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":282
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01201629638671875,
					"id": 372,
					"parentBlockID": 362,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":23124
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.012034177780151367,
					"id": 373,
					"parentBlockID": 362,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":23163
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.012052297592163086,
					"id": 374,
					"parentBlockID": 362,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":536524569
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.012084245681762695,
					"id": 375,
					"parentBlockID": 362,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":245
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01210331916809082,
					"id": 376,
					"parentBlockID": 362,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":20090
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.012120246887207031,
					"id": 377,
					"parentBlockID": 362,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":20129
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.012139081954956055,
					"id": 378,
					"parentBlockID": 362,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":405176641
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.012611150741577148,
					"id": 379,
					"parentBlockID": 362,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":238
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.012660980224609375,
					"id": 380,
					"parentBlockID": 362,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":19516
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.012685060501098633,
					"id": 381,
					"parentBlockID": 362,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":19555
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.012708187103271484,
					"id": 382,
					"parentBlockID": 362,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":382398025
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.012782096862792969,
					"id": 383,
					"parentBlockID": 362,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":258
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.012806177139282227,
					"id": 384,
					"parentBlockID": 362,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":21156
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.012826204299926758,
					"id": 385,
					"parentBlockID": 362,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":21195
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.012862205505371094,
					"id": 386,
					"parentBlockID": 362,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":449228025
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.012945175170898438,
					"id": 387,
					"parentBlockID": 362,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":251
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.012979269027709961,
					"id": 388,
					"parentBlockID": 362,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":20582
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.013001203536987305,
					"id": 389,
					"parentBlockID": 362,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":20621
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.013026237487792969,
					"id": 390,
					"parentBlockID": 362,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":425225641
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.013067007064819336,
					"id": 391,
					"parentBlockID": 362,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":192
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.013091087341308594,
					"id": 392,
					"parentBlockID": 362,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":15744
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.013111114501953125,
					"id": 393,
					"parentBlockID": 362,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":15783
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.013135194778442383,
					"id": 394,
					"parentBlockID": 362,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":249103089
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.013172388076782227,
					"id": 395,
					"parentBlockID": 362,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":311
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.013195991516113281,
					"id": 396,
					"parentBlockID": 362,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":25502
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.013218164443969727,
					"id": 397,
					"parentBlockID": 362,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":25541
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.013241052627563477,
					"id": 398,
					"parentBlockID": 362,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":652342681
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.013276338577270508,
					"id": 399,
					"parentBlockID": 362,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":360
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.013300180435180664,
					"id": 400,
					"parentBlockID": 362,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":29520
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.013322114944458008,
					"id": 401,
					"parentBlockID": 362,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":29559
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.013346195220947266,
					"id": 402,
					"parentBlockID": 362,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":873734481
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.013380289077758789,
			"id": 403,
			"parentBlockID": 1,
			"targetVal":"6",
			"iteration":7,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.013604164123535156,
				"id": 404,
				"parentBlockID": 403,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.013631343841552734,
				"id": 405,
				"parentBlockID": 403,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.013649225234985352,
					"id": 406,
					"parentBlockID": 405,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.013674020767211914,
					"id": 407,
					"parentBlockID": 405,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.013705968856811523,
			"id": 408,
			"parentBlockID": 1,
			"targetVal":"7",
			"iteration":8,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.013789176940917969,
				"id": 409,
				"parentBlockID": 408,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":8
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.013831138610839844,
				"id": 410,
				"parentBlockID": 408,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.013872146606445312,
				"id": 411,
				"parentBlockID": 408,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.013888120651245117,
					"id": 412,
					"parentBlockID": 411,
					"targetVal":"8",
					"iteration":1,
					"name":"key",
					"key":"i"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.013927221298217773,
				"id": 413,
				"parentBlockID": 408,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.013956069946289062,
			"id": 414,
			"parentBlockID": 1,
			"targetVal":"7",
			"iteration":8,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.013985157012939453,
				"id": 415,
				"parentBlockID": 414,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.014035224914550781,
					"id": 416,
					"parentBlockID": 415,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":169
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.014063119888305664,
					"id": 417,
					"parentBlockID": 415,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":9126
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.014086246490478516,
					"id": 418,
					"parentBlockID": 415,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":9144
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.014110326766967773,
					"id": 419,
					"parentBlockID": 415,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":83612736
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.014301300048828125,
					"id": 420,
					"parentBlockID": 415,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":275
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.014328241348266602,
					"id": 421,
					"parentBlockID": 415,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":14850
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.014351129531860352,
					"id": 422,
					"parentBlockID": 415,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":14868
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.014377355575561523,
					"id": 423,
					"parentBlockID": 415,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":221057424
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.014414072036743164,
					"id": 424,
					"parentBlockID": 415,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":288
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01443624496459961,
					"id": 425,
					"parentBlockID": 415,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":15552
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.014456033706665039,
					"id": 426,
					"parentBlockID": 415,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":15570
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.014477014541625977,
					"id": 427,
					"parentBlockID": 415,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":242424900
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01450800895690918,
					"id": 428,
					"parentBlockID": 415,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":250
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.014680147171020508,
					"id": 429,
					"parentBlockID": 415,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":13500
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.014715194702148438,
					"id": 430,
					"parentBlockID": 415,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":13518
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.014742136001586914,
					"id": 431,
					"parentBlockID": 415,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":182736324
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.014922142028808594,
					"id": 432,
					"parentBlockID": 415,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":204
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.014974355697631836,
					"id": 433,
					"parentBlockID": 415,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":11016
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.014998197555541992,
					"id": 434,
					"parentBlockID": 415,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":11034
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.015045166015625,
					"id": 435,
					"parentBlockID": 415,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":121749156
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.015100240707397461,
					"id": 436,
					"parentBlockID": 415,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":225
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.015121221542358398,
					"id": 437,
					"parentBlockID": 415,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":12150
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01514124870300293,
					"id": 438,
					"parentBlockID": 415,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":12168
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.01516413688659668,
					"id": 439,
					"parentBlockID": 415,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":148060224
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.015202045440673828,
					"id": 440,
					"parentBlockID": 415,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":303
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.015323162078857422,
					"id": 441,
					"parentBlockID": 415,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":16362
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.015356302261352539,
					"id": 442,
					"parentBlockID": 415,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":16380
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.015379190444946289,
					"id": 443,
					"parentBlockID": 415,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":268304400
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.015434026718139648,
					"id": 444,
					"parentBlockID": 415,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":256
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.015473127365112305,
					"id": 445,
					"parentBlockID": 415,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":13824
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01549530029296875,
					"id": 446,
					"parentBlockID": 415,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":13842
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.015519142150878906,
					"id": 447,
					"parentBlockID": 415,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":191600964
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.015554189682006836,
					"id": 448,
					"parentBlockID": 415,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":280
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.015575170516967773,
					"id": 449,
					"parentBlockID": 415,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":15120
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.015596151351928711,
					"id": 450,
					"parentBlockID": 415,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":15138
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.015622138977050781,
					"id": 451,
					"parentBlockID": 415,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":229159044
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.015856266021728516,
					"id": 452,
					"parentBlockID": 415,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":215
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01588726043701172,
					"id": 453,
					"parentBlockID": 415,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":11610
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01593327522277832,
					"id": 454,
					"parentBlockID": 415,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":11628
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.015955209732055664,
					"id": 455,
					"parentBlockID": 415,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":135210384
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.015986204147338867,
			"id": 456,
			"parentBlockID": 1,
			"targetVal":"7",
			"iteration":8,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.016016244888305664,
				"id": 457,
				"parentBlockID": 456,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.016031980514526367,
				"id": 458,
				"parentBlockID": 456,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.016051292419433594,
					"id": 459,
					"parentBlockID": 458,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.016071319580078125,
					"id": 460,
					"parentBlockID": 458,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.016096115112304688,
					"id": 461,
					"parentBlockID": 458,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.016114234924316406,
					"id": 462,
					"parentBlockID": 458,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.016135215759277344,
					"id": 463,
					"parentBlockID": 458,
					"targetVal":"2",
					"iteration":3,
					"name":"s[offset]",
					"s[offset]":"s"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.01615428924560547,
					"id": 464,
					"parentBlockID": 458,
					"targetVal":"2",
					"iteration":3,
					"name":"s_new",
					"s_new":"testtes"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.0161740779876709,
					"id": 465,
					"parentBlockID": 458,
					"targetVal":"3",
					"iteration":4,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.01619124412536621,
					"id": 466,
					"parentBlockID": 458,
					"targetVal":"3",
					"iteration":4,
					"name":"s_new",
					"s_new":"testtest"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.016219139099121094,
			"id": 467,
			"parentBlockID": 1,
			"targetVal":"8",
			"iteration":9,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.016262292861938477,
				"id": 468,
				"parentBlockID": 467,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":12
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.016282081604003906,
				"id": 469,
				"parentBlockID": 467,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.016297340393066406,
				"id": 470,
				"parentBlockID": 467,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.016307353973388672,
					"id": 471,
					"parentBlockID": 470,
					"targetVal":"12",
					"iteration":1,
					"name":"key",
					"key":"m"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.016369342803955078,
				"id": 472,
				"parentBlockID": 467,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.016392230987548828,
			"id": 473,
			"parentBlockID": 1,
			"targetVal":"8",
			"iteration":9,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.01641225814819336,
				"id": 474,
				"parentBlockID": 473,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0164492130279541,
					"id": 475,
					"parentBlockID": 474,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":311
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01647210121154785,
					"id": 476,
					"parentBlockID": 474,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":8708
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.016497135162353516,
					"id": 477,
					"parentBlockID": 474,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":8753
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.016596317291259766,
					"id": 478,
					"parentBlockID": 474,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":76615009
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01663827896118164,
					"id": 479,
					"parentBlockID": 474,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":215
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.016660213470458984,
					"id": 480,
					"parentBlockID": 474,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":6020
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01667928695678711,
					"id": 481,
					"parentBlockID": 474,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":6065
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.01669931411743164,
					"id": 482,
					"parentBlockID": 474,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":36784225
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01673436164855957,
					"id": 483,
					"parentBlockID": 474,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":314
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.016794204711914062,
					"id": 484,
					"parentBlockID": 474,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":8792
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.016846179962158203,
					"id": 485,
					"parentBlockID": 474,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":8837
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.016872167587280273,
					"id": 486,
					"parentBlockID": 474,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":78092569
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01691436767578125,
					"id": 487,
					"parentBlockID": 474,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":228
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.016935348510742188,
					"id": 488,
					"parentBlockID": 474,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":6384
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01695418357849121,
					"id": 489,
					"parentBlockID": 474,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":6429
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.016973018646240234,
					"id": 490,
					"parentBlockID": 474,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":41332041
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.017004013061523438,
					"id": 491,
					"parentBlockID": 474,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":312
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01702404022216797,
					"id": 492,
					"parentBlockID": 474,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":8736
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.017043352127075195,
					"id": 493,
					"parentBlockID": 474,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":8781
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.017063140869140625,
					"id": 494,
					"parentBlockID": 474,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":77105961
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.017093181610107422,
					"id": 495,
					"parentBlockID": 474,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":201
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01711416244506836,
					"id": 496,
					"parentBlockID": 474,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":5628
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01713109016418457,
					"id": 497,
					"parentBlockID": 474,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":5673
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.01714920997619629,
					"id": 498,
					"parentBlockID": 474,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":32182929
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.017179250717163086,
					"id": 499,
					"parentBlockID": 474,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":247
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.017225265502929688,
					"id": 500,
					"parentBlockID": 474,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":6916
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01726818084716797,
					"id": 501,
					"parentBlockID": 474,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":6961
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.017289400100708008,
					"id": 502,
					"parentBlockID": 474,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":48455521
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.017328262329101562,
					"id": 503,
					"parentBlockID": 474,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":242
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.017350196838378906,
					"id": 504,
					"parentBlockID": 474,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":6776
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.017368078231811523,
					"id": 505,
					"parentBlockID": 474,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":6821
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.017388105392456055,
					"id": 506,
					"parentBlockID": 474,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":46526041
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.017426252365112305,
					"id": 507,
					"parentBlockID": 474,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":261
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01744818687438965,
					"id": 508,
					"parentBlockID": 474,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":7308
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.017470359802246094,
					"id": 509,
					"parentBlockID": 474,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":7353
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.017493009567260742,
					"id": 510,
					"parentBlockID": 474,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":54066609
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01752924919128418,
					"id": 511,
					"parentBlockID": 474,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":281
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.017550230026245117,
					"id": 512,
					"parentBlockID": 474,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":7868
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.017571210861206055,
					"id": 513,
					"parentBlockID": 474,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":7913
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.017693281173706055,
					"id": 514,
					"parentBlockID": 474,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":62615569
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.017730236053466797,
			"id": 515,
			"parentBlockID": 1,
			"targetVal":"8",
			"iteration":9,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.017760038375854492,
				"id": 516,
				"parentBlockID": 515,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.01777815818786621,
				"id": 517,
				"parentBlockID": 515,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.017795085906982422,
					"id": 518,
					"parentBlockID": 517,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.017817258834838867,
					"id": 519,
					"parentBlockID": 517,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 47,
			"timestamp": 0.017849206924438477,
			"id": 520,
			"parentBlockID": 1,
			"targetVal":"9",
			"iteration":10,
			"func_name":"do_dict_things",
			"body":[
			{
				"type":"assign",
				"lineno": 29,
				"timestamp": 0.017892122268676758,
				"id": 521,
				"parentBlockID": 520,
				"name":"vals",
				"vals":"Unsupported",
				"sum(vals)":6
			},
			{
				"type":"assign",
				"lineno": 30,
				"timestamp": 0.017914295196533203,
				"id": 522,
				"parentBlockID": 520,
				"name":"key",
				"key":""
			},
			{
				"type":"for",
				"lineno": 31,
				"timestamp": 0.017930030822753906,
				"id": 523,
				"parentBlockID": 520,
				"target":"v",
				"body":[
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.017943143844604492,
					"id": 524,
					"parentBlockID": 523,
					"targetVal":"2",
					"iteration":1,
					"name":"key",
					"key":"c"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.017965078353881836,
					"id": 525,
					"parentBlockID": 523,
					"targetVal":"1",
					"iteration":2,
					"name":"key",
					"key":"cb"
				},
				{
					"type":"assign",
					"lineno": 32,
					"timestamp": 0.017986059188842773,
					"id": 526,
					"parentBlockID": 523,
					"targetVal":"3",
					"iteration":3,
					"name":"key",
					"key":"cbd"
				}
				]
			},
			{
				"type":"call",
				"lineno": 34,
				"timestamp": 0.018011093139648438,
				"id": 527,
				"parentBlockID": 520,
				"func_name":"d.update",
				"body":[
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 49,
			"timestamp": 0.018036365509033203,
			"id": 528,
			"parentBlockID": 1,
			"targetVal":"9",
			"iteration":10,
			"func_name":"doThings",
			"body":[
			{
				"type":"for",
				"lineno": 6,
				"timestamp": 0.018058061599731445,
				"id": 529,
				"parentBlockID": 528,
				"target":"i",
				"body":[
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.018163204193115234,
					"id": 530,
					"parentBlockID": 529,
					"targetVal":"0",
					"iteration":1,
					"name":"z",
					"z":192
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.018198013305664062,
					"id": 531,
					"parentBlockID": 529,
					"targetVal":"0",
					"iteration":1,
					"name":"result2",
					"result2":13440
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.018223285675048828,
					"id": 532,
					"parentBlockID": 529,
					"targetVal":"0",
					"iteration":1,
					"name":"result3",
					"result3":13479
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.0182492733001709,
					"id": 533,
					"parentBlockID": 529,
					"targetVal":"0",
					"iteration":1,
					"name":"result",
					"result":181683441
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01828932762145996,
					"id": 534,
					"parentBlockID": 529,
					"targetVal":"1",
					"iteration":2,
					"name":"z",
					"z":245
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.018316030502319336,
					"id": 535,
					"parentBlockID": 529,
					"targetVal":"1",
					"iteration":2,
					"name":"result2",
					"result2":17150
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.018339157104492188,
					"id": 536,
					"parentBlockID": 529,
					"targetVal":"1",
					"iteration":2,
					"name":"result3",
					"result3":17189
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.01836228370666504,
					"id": 537,
					"parentBlockID": 529,
					"targetVal":"1",
					"iteration":2,
					"name":"result",
					"result":295461721
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.018398284912109375,
					"id": 538,
					"parentBlockID": 529,
					"targetVal":"2",
					"iteration":3,
					"name":"z",
					"z":257
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01842212677001953,
					"id": 539,
					"parentBlockID": 529,
					"targetVal":"2",
					"iteration":3,
					"name":"result2",
					"result2":17990
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.018439292907714844,
					"id": 540,
					"parentBlockID": 529,
					"targetVal":"2",
					"iteration":3,
					"name":"result3",
					"result3":18029
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.018462181091308594,
					"id": 541,
					"parentBlockID": 529,
					"targetVal":"2",
					"iteration":3,
					"name":"result",
					"result":325044841
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.018496990203857422,
					"id": 542,
					"parentBlockID": 529,
					"targetVal":"3",
					"iteration":4,
					"name":"z",
					"z":257
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.018522262573242188,
					"id": 543,
					"parentBlockID": 529,
					"targetVal":"3",
					"iteration":4,
					"name":"result2",
					"result2":17990
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.018543243408203125,
					"id": 544,
					"parentBlockID": 529,
					"targetVal":"3",
					"iteration":4,
					"name":"result3",
					"result3":18029
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.018566131591796875,
					"id": 545,
					"parentBlockID": 529,
					"targetVal":"3",
					"iteration":4,
					"name":"result",
					"result":325044841
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0186002254486084,
					"id": 546,
					"parentBlockID": 529,
					"targetVal":"4",
					"iteration":5,
					"name":"z",
					"z":313
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.018621206283569336,
					"id": 547,
					"parentBlockID": 529,
					"targetVal":"4",
					"iteration":5,
					"name":"result2",
					"result2":21910
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01864027976989746,
					"id": 548,
					"parentBlockID": 529,
					"targetVal":"4",
					"iteration":5,
					"name":"result3",
					"result3":21949
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.01866006851196289,
					"id": 549,
					"parentBlockID": 529,
					"targetVal":"4",
					"iteration":5,
					"name":"result",
					"result":481758601
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.0186922550201416,
					"id": 550,
					"parentBlockID": 529,
					"targetVal":"5",
					"iteration":6,
					"name":"z",
					"z":289
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.018778085708618164,
					"id": 551,
					"parentBlockID": 529,
					"targetVal":"5",
					"iteration":6,
					"name":"result2",
					"result2":20230
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.01880335807800293,
					"id": 552,
					"parentBlockID": 529,
					"targetVal":"5",
					"iteration":6,
					"name":"result3",
					"result3":20269
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.018826007843017578,
					"id": 553,
					"parentBlockID": 529,
					"targetVal":"5",
					"iteration":6,
					"name":"result",
					"result":410832361
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.018868207931518555,
					"id": 554,
					"parentBlockID": 529,
					"targetVal":"6",
					"iteration":7,
					"name":"z",
					"z":304
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01889204978942871,
					"id": 555,
					"parentBlockID": 529,
					"targetVal":"6",
					"iteration":7,
					"name":"result2",
					"result2":21280
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.018912076950073242,
					"id": 556,
					"parentBlockID": 529,
					"targetVal":"6",
					"iteration":7,
					"name":"result3",
					"result3":21319
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.018941164016723633,
					"id": 557,
					"parentBlockID": 529,
					"targetVal":"6",
					"iteration":7,
					"name":"result",
					"result":454499761
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.018966197967529297,
					"id": 558,
					"parentBlockID": 529,
					"targetVal":"7",
					"iteration":8,
					"name":"z",
					"z":305
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.01898026466369629,
					"id": 559,
					"parentBlockID": 529,
					"targetVal":"7",
					"iteration":8,
					"name":"result2",
					"result2":21350
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.018992185592651367,
					"id": 560,
					"parentBlockID": 529,
					"targetVal":"7",
					"iteration":8,
					"name":"result3",
					"result3":21389
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.019004344940185547,
					"id": 561,
					"parentBlockID": 529,
					"targetVal":"7",
					"iteration":8,
					"name":"result",
					"result":457489321
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.019024133682250977,
					"id": 562,
					"parentBlockID": 529,
					"targetVal":"8",
					"iteration":9,
					"name":"z",
					"z":249
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.019037246704101562,
					"id": 563,
					"parentBlockID": 529,
					"targetVal":"8",
					"iteration":9,
					"name":"result2",
					"result2":17430
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.019050121307373047,
					"id": 564,
					"parentBlockID": 529,
					"targetVal":"8",
					"iteration":9,
					"name":"result3",
					"result3":17469
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.019062042236328125,
					"id": 565,
					"parentBlockID": 529,
					"targetVal":"8",
					"iteration":9,
					"name":"result",
					"result":305165961
				},
				{
					"type":"assign",
					"lineno": 7,
					"timestamp": 0.01908135414123535,
					"id": 566,
					"parentBlockID": 529,
					"targetVal":"9",
					"iteration":10,
					"name":"z",
					"z":213
				},
				{
					"type":"assign",
					"lineno": 8,
					"timestamp": 0.019093990325927734,
					"id": 567,
					"parentBlockID": 529,
					"targetVal":"9",
					"iteration":10,
					"name":"result2",
					"result2":14910
				},
				{
					"type":"assign",
					"lineno": 9,
					"timestamp": 0.019106149673461914,
					"id": 568,
					"parentBlockID": 529,
					"targetVal":"9",
					"iteration":10,
					"name":"result3",
					"result3":14949
				},
				{
					"type":"assign",
					"lineno": 10,
					"timestamp": 0.019118070602416992,
					"id": 569,
					"parentBlockID": 529,
					"targetVal":"9",
					"iteration":10,
					"name":"result",
					"result":223472601
				}
				]
			}
			]
		},
		{
			"type":"call",
			"lineno": 50,
			"timestamp": 0.019137144088745117,
			"id": 570,
			"parentBlockID": 1,
			"targetVal":"9",
			"iteration":10,
			"func_name":"doStringThings",
			"body":[
			{
				"type":"assign",
				"lineno": 17,
				"timestamp": 0.019158124923706055,
				"id": 571,
				"parentBlockID": 570,
				"name":"s_new",
				"s_new":"test"
			},
			{
				"type":"for",
				"lineno": 18,
				"timestamp": 0.019166946411132812,
				"id": 572,
				"parentBlockID": 570,
				"target":"i",
				"body":[
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.01917719841003418,
					"id": 573,
					"parentBlockID": 572,
					"targetVal":"0",
					"iteration":1,
					"name":"s[offset]",
					"s[offset]":"t"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.019189119338989258,
					"id": 574,
					"parentBlockID": 572,
					"targetVal":"0",
					"iteration":1,
					"name":"s_new",
					"s_new":"testt"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.019204139709472656,
					"id": 575,
					"parentBlockID": 572,
					"targetVal":"1",
					"iteration":2,
					"name":"s[offset]",
					"s[offset]":"e"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.019215106964111328,
					"id": 576,
					"parentBlockID": 572,
					"targetVal":"1",
					"iteration":2,
					"name":"s_new",
					"s_new":"testte"
				},
				{
					"type":"expression",
					"lineno": 21,
					"timestamp": 0.019228219985961914,
					"id": 577,
					"parentBlockID": 572,
					"targetVal":"2",
					"iteration":3,
					"name":"s[offset]",
					"s[offset]":"s"
				},
				{
					"type":"assign",
					"lineno": 21,
					"timestamp": 0.01923823356628418,
					"id": 578,
					"parentBlockID": 572,
					"targetVal":"2",
					"iteration":3,
					"name":"s_new",
					"s_new":"testtes"
				}
				]
			}
			]
		}
		]
	}
	]
,
	"tracked":[
		{"name":"result2","instances":[{"lineno":8, "offset":8}],
		"custom":[]},
		{"name":"result3","instances":[{"lineno":9, "offset":8}],
		"custom":[]},
		{"name":"result","instances":[{"lineno":10, "offset":8}],
		"custom":[]},
		{"name":"z","instances":[{"lineno":7, "offset":8}],
		"custom":[]},
		{"name":"s_new","instances":[{"lineno":17, "offset":4},{"lineno":21, "offset":8}],
		"custom":[]},
		{"name":"key","instances":[{"lineno":30, "offset":4},{"lineno":32, "offset":8}],
		"custom":[]},
		{"name":"vals","instances":[{"lineno":29, "offset":4}],
		"custom":["sum(vals)"]},
		{"name":"s[offset]","instances":[{"lineno":21, "offset":24}],
		"custom":[]}
	]

}
