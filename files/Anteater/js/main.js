var source = "",
trace = {},
tracked = {};
var sourceLines = ""
var variables = [];
var expressions = [];
var excludedFuncs = [{name:"print",line:0},{name:"append",line:0},{name:"list",line:0},{name:"len",line:0},{name:"range",line:0},{name:"sum",line:0},{name:"pow",line:0},{name:"format",line:0}];
var excludedLibs = [{name:"numpy",line:0},{name:"math",line:0}];
var dragging = false;
var db = new alasql.Database("traceBase")
var shownVars =[]
var shownVars_exprs = []
var rootNode = null;
var actualRoot = null;
var trackedTypes = {}
var trackedTypes_expr = {}
var trackedInstances = {}
var instancesShown = {}
var test = false;
var additions = []
var traceVis = true;
var dbEmpty = true;

function init_source(text){
    source = text;
    sourceLines = source.split("\n")
    show_source(source);
}

function clear_bookkeeping(){

  reset_plot_bookkeeping();
  source = "",
  trace = {},
  tracked = {};
  sourceLines = ""
  variables = [];
  expressions = [];
  dragging = false;
  shownVars = []
  shownVars_exprs = []
  rootNode = null;
  actualRoot = null;
  trackedTypes = {}
  trackedTypes_expr = {}
  trackedInstances = {}
  instancesShown = {}
  test = false;
  additions = []
}

function init_trace(t){

    t = JSON.parse(t)
    trace = {"type":"module",
        "lineno":0,
        "id":0,
        "timestamp":0,
        "body":t.trace
    }
    if("error" in t){
        alert(t.error)
    }

    tracked = t.tracked;

     for(var v in tracked){
        trackedTypes[tracked[v].name]=null;
        trackedInstances[tracked[v].name] = []
        instancesShown[tracked[v].name] = []
        trackedTypes_expr[tracked[v].name]={}

        tracked[v].custom.forEach(function(e){
            trackedTypes_expr[tracked[v].name][e] = null
        })
    }

    highlight_tracked(tracked);
    create_DB();
    dbEmpty = false
    rootNode = d3.hierarchy(trace,function(d){return d.body;});
    actualRoot = d3.hierarchy(trace,function(d){return d.body;});
    draw_flame(rootNode);

    if(test){
        var update = false
        shownVars = tests[testKey].shownVars;
        shownVars_exprs = tests[testKey].shownVars_exprs;
        if(tests[testKey].groupOn != null){
            var v_types = [];

            shownVars.forEach(function(d,i){
                var t = get_var_type(i)
                if (t==typeof(5)){
                    v_types.push(["q",i])
                }
                else if (t==typeof("s")){
                    v_types.push(["s",i])
                }
                else if (t==typeof(true)){
                    v_types.push(["b",i])
                }
            })
            plotInfo.group_on = tests[testKey].groupOn;


            determine_plot(v_types,plotInfo.group_on);
            update = true;
        }

        plot(update)

    }
}

function getValue(data,varName,attrName,custom = null){
//    if(varTypes[varName]==typeof("s")){
//        return measureString(data[varName])
//    }
//    else{
        var num = trackedTypes[varName]==typeof(4)
        if(custom != null){
            num = trackedTypes_expr[varName][custom]==typeof(4)
        }
        if(attrName){
            if(data[attrName] != "nan" &&  data[attrName] != "inf" &&  data[attrName] != "-inf" && data[attrName]!="Anteater:Expression_Error" && num){
                return JSON.parse(data[attrName])
            }
            else{
                return data[attrName]
            }

        }
        else{
            if(data.val != "nan" &&  data.val != "inf"&&  data.val != "-inf"){
                return JSON.parse(data.val)
            }
            else{
                return data.val
            }
        }
//    }

}


function create_DB(){
//parentID INT FOREIGN KEY REFERENCES block(id)
    db.exec("CREATE TABLE block (id INT PRIMARY KEY NOT NULL, type STRING NOT NULL, lineno INT NOT NULL, timestamp FLOAT NOT NULL, parentID INT)")
//    db.exec("ALTER TABLE block ADD COLUMN parentID INT FOREIGN KEY REFERENCES block(id)")
//    db.exec("CREATE TABLE tracked (id INT PRIMARY KEY, name STRING)")//, lineno INT, timestamp FLOAT, val STRING, parentID INT)")

    db.exec("CREATE TABLE tracked (id INT PRIMARY KEY, variable BOOL, name STRING, lineno INT, timestamp FLOAT, val STRING, parentID INT, iteration INT)")

    db.exec("CREATE TABLE function_name (id INT, name STRING)")

    db.exec("CREATE TABLE loop_block_connector(loopID INT, blockID INT, iteration INT)")

    db.exec("CREATE TABLE for_loop(loopID INT, iteration INT, targetVal STRING)")

    db.exec("CREATE TABLE custom (name STRING, baseID INT, val STRING)")

    db.exec("CREATE INDEX idx_blockID ON block (id)")

    db.exec("CREATE INDEX idx_trackedID ON tracked (id)")



    traverse_trace(trace)

}

function clear_DB(){
    db.exec("DROP TABLE block")

    db.exec("DROP TABLE tracked")

    db.exec("DROP TABLE function_name")

    db.exec("DROP TABLE loop_block_connector")

    db.exec("DROP TABLE for_loop")

    db.exec("DROP TABLE custom")

    dbEmpty = true;

}

function traverse_trace(t){
    //80461
    if(t.type=="for" || t.type=="while" || t.type=="call"){

        db.exec("INSERT INTO block VALUES("+ t.id+",\"" +t.type+"\"," + t.lineno + ","+t.timestamp + "," + t.parentBlockID+")")

        if("iteration" in t){
            db.exec("INSERT INTO loop_block_connector VALUES ("+t.parentBlockID + "," + t.id + "," + t.iteration + ")")
        }
    }
    else if(t.type=="module"){
        db.exec("INSERT INTO block (id, type, lineno, timestamp) VALUES (0, \"module\", 0, 0)")
    }

    if(t.type=="for"){
        var iteration = -1;
        if("body" in t){
            t.body.forEach(function(d){
                if(iteration < d.iteration){
                    db.exec("INSERT INTO for_loop VALUES ("+ t.id+"," + d.iteration + ",\"" + d.targetVal+"\")")
                    iteration = d.iteration
                }
                traverse_trace(d);
            })
        }
    }
    else if(t.type =="call"){
        db.exec("INSERT INTO function_name VALUES (" + t.id + ",\"" + t["func_name"]+"\")")
        if("body" in t){
            t.body.forEach(function(d){
                traverse_trace(d);
            })
        }
    }
    else if(t.type == "while"){
        if("body" in t){
            t.body.forEach(function(d){
                traverse_trace(d);
            })
        }
    }
    else if(t.type !="module"){
        var type = t.type=="assign";
        var valType = trackedTypes[t.name];
        var dataT= typeof(t[t.name])
        if(t.type=="expression"){
            console.log(dataT)
            console.log(t.name)
        }
        if(t[t.name]=="True"||t[t.name]=="False"){
            dataT    = typeof(true)
        }
        if(valType != null && dataT != valType){
            if(valType==typeof(5) && dataT==typeof("s") && t[t.name]!= "nan" && t[t.name]!= "inf" && t[t.name]!= "-inf" ){
                trackedTypes[t.name] = dataT
            }
            else if(valType != typeof(true) && dataT == typeof(true)){
                trackedTypes[t.name] = typeof("s")
            }
            else{
                console.log("UNHANDLED TYPES: " + valType + " and " + dataT);
            }

        }
        else if(valType==null){
            trackedTypes[t.name] = dataT
        }
        if(t.type=="assign"|| t.type=="param"){
            if(!trackedInstances[t.name].includes(t.lineno)){
                trackedInstances[t.name].push(t.lineno)
                instancesShown[t.name].push(t.lineno)

            }
        }

        tObj = tracked[0]
        i = 0
        while(tObj.name != t.name){
          i++;
          tObj = tracked[i]
        }


        if("iteration" in t){
            if (typeof(t[t.name]) == "string"){
                val = JSON.stringify(t[t.name].toString())
            }
            else{
                val = "\""+JSON.stringify(t[t.name])+"\""
            }
//            console.log(JSON.stringify(t[t.name]))
            db.exec("INSERT INTO tracked VALUES (" + t.id + "," + type + ",\"" + t.name + "\"," + t.lineno + "," + t.timestamp + ","
            + val + "," + t.parentBlockID+"," + t.iteration+")")


            //db.exec("INSERT INTO loop_tracked_connector VALUES ("+t.parentBlockID + "," + t.id + "," + t.iteration + ")")
        }
//        db.exec("INSERT INTO tracked VALUES (" + t.id + ",\""  + t.name + "\")")//+ "," + t.lineno + "," + t.timestamp + "," + t[t.name] + "," + t.parentBlockID+")")
        else{
            if (typeof(t[t.name]) == "string"){
                val = JSON.stringify(t[t.name].toString())
            }
            else{
                val = "\""+JSON.stringify(t[t.name])+"\""
            }

            db.exec("INSERT INTO tracked VALUES (" + t.id + "," + type + ",\"" + t.name + "\"," + t.lineno + "," + t.timestamp + "," +
            val + "," + t.parentBlockID+"," + -1 +")")

        }

         tObj.custom.forEach(function(e){
                if (typeof(t[e]) == "string"){
                    val = JSON.stringify(t[e].toString())
                }
                else{
                    val = "\""+JSON.stringify(t[e])+"\""
                }
                db.exec("INSERT INTO custom VALUES (" + JSON.stringify(e) + "," + t.id + "," + val+")")


                var vType = trackedTypes_expr[t.name][e]
                var dType = typeof(t[e])
                if(t[e]=="True"||t[e]=="False"){
                    dType = typeof(true)
                }

                if(vType!=null && dType != vType){
                    if(vType==typeof(5) && dType==typeof("s") && t[e]!= "nan" && t[e]!= "inf" && t[e]!= "-inf" && t[e]!= "Anteater:Expression_Error"){
                        trackedTypes_expr[t.name][e] = dType
                    }
                    else if(vType != typeof(true) && dType == typeof(true)){
                        trackedTypes_expr[t.name][e] = typeof("s")
                    }
                    else{
                        console.log("UNHANDLED TYPES: " + vType + " and " + dType);
                    }
                }
                else if(vType==null){
                    trackedTypes_expr[t.name][e]  = dType
                }

        })
    }
    else{
        if("body" in t){
            t.body.forEach(function(d){
                traverse_trace(d);
            })
        }
    }
}

function cmHighlight(element){
    d3.select(element)
    .style("background-color","DodgerBlue")
}

function cmUnhighlight(element){
        d3.select(element)
        .style("background-color","#f2f2f2")
}
