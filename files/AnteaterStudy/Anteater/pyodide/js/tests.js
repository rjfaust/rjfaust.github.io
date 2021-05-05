var testKey = "PCChangeScale"
var tests = {
    "3PC":{
        name: "Parallel Coordinates",
        source: "DataTypeTest.py",
        trace:  "3PC.trace",
        shownVars: ["result","result2","result3"],
        shownVars_exprs :[null,null],
        groupOn : null
    },
    "PCChangeScale":{
        name: "Parallel Coordinates Change Scale",
        source: "GradientDescent.py",
        trace:  "GD_binary_groups.trace",
        shownVars: ["x","x1","x"],
        shownVars_exprs :[null,null,null],
        groupOn : null
    },
    "BinaryGroupHist":{
        name: "Binary Grouping Histograms",
        source: "DataTypeTest.py",
        trace: "BinaryGroupHist.trace",
        shownVars: ["result2","result2"],
        shownVars_exprs:[null,"result2 < 500"],
        groupOn : null
    },
    "SingleHist":{
        name: "Single Histograms",
        source: "DataTypeTest.py",
        trace: "BinaryGroupHist.trace",
        shownVars: ["result2"],
        shownVars_exprs:[null],
        groupOn:  []
    },
    "nanInfHist":{
        name: "Histograms with NaN and Inf",
        source: "GradientDescent.py",
        trace: "GD_binary_groups.trace",
        shownVars: ["x"],
        shownVars_exprs:[null],
        groupOn:  []
    },
    "GD_Binary":{
        name: "Gradient Descent Binary Grouping",
        source: "GradientDescent.py",
        trace: "GD_binary_groups.trace",
        shownVars: ["x","x"],
        shownVars_exprs:[null,"x > 0"],
        groupOn: null

    },
    "BinaryHist":{
        name: "Binary Histograms",
        source: "DataTypeTest.py",
        trace: "BinaryGroupHist.trace",
        shownVars: ["result2"],
        shownVars_exprs:["result2 < 500"],
        groupOn : null
    },
    "BarPlot":{
        name: "Bar plot",
        source: "DataTypeTest.py",
        trace: "String.trace",
        shownVars: ["s_new"],
        shownVars_exprs:[null],
        groupOn : null
    },
    "TsneBroken":{
        name: "t-SNE Broken",
        source: "tsne.py",
        trace: "t-sne_broken.trace",
        shownVars: [],
        shownVars_exprs:[],
        groupOn : null
    }


}

//if (test){
//    test_post();
//}

function init_tests(){
    keys = Object.keys(tests)

    var form = d3.select("#tests")
//    .selectAll("input")
//    .data(keys)
//    .enter()
//    .append("input")
//    .property("type","button")
//    .property("value",function(k){return tests[k].name;})

    keys.forEach(function(k){
        form.append("input")
        .property("type","button")
        .property("value",tests[k].name)
        .on("click",function(){
            testKey = k;
            test_post();
        })
        form.append("br")
    })

    form.append("input")
    .property("type","text")
    .attr("name","test")
    .attr("id","test")
    .style("visibility","hidden")

    form.append("input")
    .property("type","text")
    .attr("name","testKey")
    .attr("id","testKey")
    .style("visibility","hidden")

    form.append("input")
    .property("type","text")
    .attr("name","filename")
    .attr("id","filename")
    .style("visibility","hidden")

    form.append("input")
    .property("type","text")
    .attr("name","trace")
    .attr("id","trace")
    .style("visibility","hidden")
}

function test_post(){

    d3.select("#testKey")
    .property("value",testKey)
    d3.select("#filename")
    .property("value",tests[testKey].source)
    d3.select("#trace")
    .property("value",tests[testKey].trace)

    document.getElementById("test").value = "true";
    document.getElementById("tests").submit()
}


function load_test_files(){
    var trace_text = read_file("../../static/Tests/"+tests[testKey].trace)
    var source_text = read_file("../../static/Tests/"+tests[testKey].source)
}

function set_ui(source_text,trace_text){
    init_source(source_text);
    init_trace(trace_text);
    shownVars = tests[testKey].shownVars
    shownVars_expr = tests[testKey].shownVars_expr
    init_execution();
    init_plot();
    plot();
}




function read_file(name){
    var rawFile = new XMLHttpRequest();

    var text = null
    rawFile.open("GET", name, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                text = rawFile.responseText;


            }
        }
    }
    return text
}