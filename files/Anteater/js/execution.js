var margin = {top: 10, right: 90, bottom: 50, left: 10};
var boundingRect = document
    .querySelector('#execution')
    .getBoundingClientRect();
var width = boundingRect.right - boundingRect.left - margin.left - margin.right - 40;
var height = window.innerHeight*.45- margin.top - margin.bottom;
var legendWidth = 200;
var legend = null;
var legendOpen = true;
var svg = null;
var mainHeight = .75*height;
var contextHeight = .2*height;


function init_execution(){
    width-= legendWidth
    width-=20;
    svg = d3.select("#execution").append("g")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate("+ margin.left + "," + margin.top + ")")
        .append("g");
    legend = d3.select("#legendNav")
        .attr("height", height+"px")


    var staticBlocks =[
    {
        name:"function",
        color:d3.hcl(195, 5, 90)
    },
    {
        name: "loop",
        color:"powderblue"
    }]

    staticBlocks.forEach(function(d){
        var g = legend.append("g")
        .attr("id","leg-"+ d.name)
        	.classed("navOpt",true)

        g.append("div")
        .attr("class","navOpt")
        .style("width", "20px")
        .style("height", "20px")
        .style("background-color",d.color)
        .style("position","relative")
        .style("float","left")

        g.append("label")
        .text(d.name)
        .style("padding-left","10px")
        g.append("br")
    })

}


function draw_flame(trace){

    prune_empty_loops(trace);
    var out = count_leaves(trace);
    var leaves = out[2];
    var leafCount = leaves.length;

    var cellWidth = width/trace.value;
//    if(!legendOpen){
//        width+=legendWidth
//    }
//    else{
//        width -=legendWidth;
//    }
    var newWidth= width;


    d3.select("#execution").select("svg").attr("width",newWidth);

    var partition = d3.partition()
        .size([newWidth,.75*height])
        .padding(0)
        .round(true);

    svg.selectAll("*").remove();


    partition(trace);


    var colorScale = generate_color_scale(shownVars[0],shownVars_exprs[0]);
    draw_legend(trace,colorScale);

    var rect = svg.selectAll("rect");

    rect = rect
    .data(trace.descendants())
    .enter().append("rect")
    .attr("x", function(d) { return d.x0; })
    .attr("y", function(d) { return d.y0; })
    .attr("id",function(d){ var id="id"+d.data.id.toString().replace(".","-"); return id;})
    .classed("execNode",true)
    .attr("width", function(d) { d.x1 = d.x0 +cellWidth*d.value; return d.x1 - d.x0; })
    .attr("height", function(d) { return d.y1 - d.y0; })
    .style("stroke",function(d){
        return get_stroke_color(d,colorScale);
     })
    .style("stroke-width", function(d){if(d3.select(this).attr("width")<5){return 0} else{return 1}}) //function(d){ if(d.x1 -d.x0<5){return 0} else{return 1}})
    .style("fill",function(d){

            var color = get_fill_color(d,colorScale,shownVars_exprs[0]);
            return color;
        })
   .on('click', function(d){

        if(d.data.hidden){
            click(d,this);
        }
        else{
            click(d,this);
        }
    })
    .on('contextmenu',function(d){
        d3.event.preventDefault();
        rightClick(d);

      });

    var contextHighlighter = draw_context(trace)

    function click(d,rect){
        rootNode = d;



        var colorScale = generate_color_scale(shownVars[0],shownVars_exprs[0]);



        d3.selectAll(".execNode")
        .style("stroke-width", function(d){if(d3.select(this).attr("width")<5){return 0} else{return 1}}) //function(d){ if(d.x1 -d.x0<5){return 0} else{return 1}})
        .classed("selected",false)


        d3.select(rect)
        .style("stroke-width","5px")
        .classed("selected",true)

        d3.selectAll(".execNode")
        .classed("highlighted",false)
        .classed("dependency",false)
        .style("fill",function(d){return get_fill_color(d,colorScale,shownVars_exprs[0]);})
        .style("stroke",function(d){return get_stroke_color(d,colorScale);})


         d3.selectAll(".contextNode")
                 .classed("highlighted",false)
                .style("fill","gray")
                .style("stroke","black")

        if(shownVars.length > 0){
            plot(true);
        }




        reset_source(source,false,true);
        add_vals(d);
        highlight_block(d);
        highlight_tracked(tracked,);
        fold([]);


        d3.selectAll(".contextNode")
        .style("stroke","black")
        .style("stroke-width","1px")
        d3.select("#context"+ d.data.id)
        .style("stroke","yellow")
        .style("stroke-width","5px")


        highlight_dependencies(d)

    }


    /*-------------------ADD TEXT---------------------*/
    var nLines = sourceLines.length
    //    var nLines = 25; // obvs wrong
    var nDigits = Math.ceil(Math.log10(nLines));
    var padding = " ".repeat(nDigits);

    function rectHintText(d) {
        var desiredLength = this.getAttribute("width") - 50; // margin
        var locPrompt = (padding+d.data.lineno+": ").substr(-(nDigits + 2), nDigits+2);
        if(d.data.lineno==0){
            var blockStr = ""
        }
        else{
            var blockStr = locPrompt+(sourceLines[d.data.lineno-1].trim().replace("&gt;",">").replace("&lt;","<"));
        }
        // textTest.html(blockStr);
        var length = blockStr.length * charSize; // textTest.node().getComputedTextLength();

        if (length < desiredLength) {
            return blockStr;
        }
        else {
            var approxCharLen = length/blockStr.length;
            var maxChars = Math.floor(desiredLength/approxCharLen);

            if (maxChars <= 5)
                return "";

            if (maxChars >= d.data.lineno.toString().length) {
                return blockStr.substring(0,maxChars - 1) + "…";
            } else {
                return "";
            }
        }
    }


    var fontSize = Math.min(16,trace.y1-trace.y0-5);
    var textTest = svg.append("text")
            .attr("id","testText")
            .classed("loc-hint", true)
            .style("visibility","hidden")
            .text("1234567890");

    var charSize = textTest.node().getComputedTextLength() / textTest.text().length;


    var blockText = svg.selectAll("text")
    .data(trace.descendants())
    .enter()
    .append("text")
    .classed("loc-hint",true)
    .attr("dx",".35em")
    .attr("dy",".35em")
    .attr("id",function(d){return "textid"+ d.data.id;})
    .attr("x",function(d){return d.x0;})
    .attr("y",function(d){return (d.y1-d.y0)/2+d.y0})
    .attr("width",function(d){return d.x1-d.x0;})
    .text(rectHintText)
    .attr("font-size",fontSize)
    .on('click', function(d){

        if(d.data.hidden){
            click(d,this);
        }
        else{
            click(d,this);
        }
    })
    .on('contextmenu',function(d){
        d3.event.preventDefault();
        rightClick(d);

      });


    function rightClick(d){
        var id="id"+d.data.id;
        var x = d3.scaleLinear()
        .range([0, newWidth]);

        var y = d3.scaleLinear()
        .range([0, .8*height]);

//        logEvent(eventTypes.zoom,evtObj.execBlock,id)
        var newCellWidth = width/d.value;
        var contextCellWidth = (width)/(trace.value);
        x.domain([d.preceding, d.preceding+d.value]);
        y.domain([d.y0, height]).range([d.depth ? 20 : 0, height]);
        contextHighlighter.transition()
            .duration(750)
            .attr("x",d.preceding*contextCellWidth)
            .attr("width",d.value*contextCellWidth);
        rect.transition()
            .duration(750)
            .attr("x", function(d) { return x(d.preceding); })
            .attr("width", function(d) { return d.value*newCellWidth; });
        d3.selectAll("rect.execNode")
            .style("stroke-width", function(d) {
                if (d.value * newCellWidth < 5) { return 0; } else { return 1; }
            });
        blockText.transition()
            .duration(750)
            .attr("x", function(d) { return x(d.preceding); })
            .attr("width", function(d) { return d.value*newCellWidth; })
            .tween("text.trim", function() {
                var that = this;
                return function(t) {
                    return d3.select(that).text(rectHintText);
                };
            });
        d3.selectAll(".execNode.selected")
        .style("stroke-width","5px")
    }



}

function draw_context(root){

    var contextG = svg.append("g");
    var contextRect = contextG.selectAll("rect");
    var maxDepth = d3.max(root.leaves(),function(d){return d.depth});
    var contextCellHeight = .15*height/(maxDepth+1);
    var contextCellWidth = (width)/(root.value);

    contextRect = contextRect.data(root.descendants())
        .enter().append("rect")
        .attr("x", function(d) {  return d.x0; })
        .attr("y", function(d) { return d.depth*contextCellHeight + .8*height; })
        .attr("id",function(d){
            var id="context"+d.data.id;
            return id;
        })
        .classed("contextNode",true)
        .attr("width", function(d) { return contextCellWidth*d.value; }) //d.x1 = d.x0 +cellWidth*d.value;  return d.x1 - d.x0; })
        .attr("height", function(d) { return contextCellHeight; })
        .style("stroke",function(d){
            return "black";
        })
        .style("fill",function(d){
            return "gray";
        })
        .style("stroke-width",function(d){
            if (contextCellWidth * d.value < 5) { return 0; } else { return 1; }
        });

    var contextHighlighter = contextG.append("rect")
        .classed("highlighter",true)
        .style("stroke","#325d81")
        .style("stroke-width",5)
        .style("fill","steelblue")
        .style("opacity",.5)
        .attr("width",width+10)
        .attr("height",(contextCellHeight*(maxDepth+1))+10)
        .attr("x",0)
        .attr("y",.8*height-5);


    return contextHighlighter
}



function draw_legend(trace,colorScale){
    d3.select("#legendNav").select("#gradLeg").remove();

    if(shownVars.length > 0){
        var gradientGrp = d3.select("#legendNav")
        .append("g")
        .attr("id","gradLeg")
        .classed("navOpt",true)

        //gradientGrp.append("br")
        gradientGrp.append("label")
        .text(shownVars[0])
        .style("display","block")
        .style("text-align","center")
        .style("margin-top","-20px")



        var gradSVG = gradientGrp.append("svg")
        .attr("id","gradSVG")
        .attr("width",legendWidth)
        .attr("height",40)
        .style("padding-left","15px")


        var pts = trace.leaves().filter(function(d){return(shownVars[0] in d.data);})

        var nonNums = pts.filter(function(d){return (d.data[shownVars[0]]=="nan" || d.data[shownVars[0]]=="inf" || d.data[shownVars[0]]=="-inf" || d.data[shownVars[0]]== "Anteater:Expression_Error")})

        var domain = d3.extent(trace.leaves().filter(function(d){return(shownVars[0] in d.data);}),function(d){
            if(shownVars[0] in d.data){
                if (shownVars_exprs[0]!=null){
                    return getValue(d.data, shownVars[0], shownVars_exprs[0],shownVars_exprs[0])
                }
                return getValue(d.data,shownVars[0],shownVars[0])}
                else{
                    return 0
                }
        })


        gradientGrp.append("label")
        .text(function(){
            if(domain[0]>1000){
                return d3.format(".2e")(domain[0])
            }
            else if(domain[0] < -1000){
                return d3.format(".2e")(domain[0])
            }
            return d3.format(".3")(domain[0])
        })
        .style("float","left")
        .style("margin-top","-20px")
        .style("margin-left","15px")
        .style("font-size","12px")

        gradientGrp.append("label")
        .text(function(){
            if(domain[1]>1000){
                return d3.format(".2e")(domain[1])
            }
            else if(domain[1] < -1000){
                return d3.format(".2e")(domain[1])
            }
            return d3.format(".3")(domain[1])
        })
        .style("float","right")
        .style("margin-top","-20px")
        .style("margin-right","15px")
         .style("font-size","12px")


        //Append a defs (for definition) element to your SVG
        var defs = gradSVG.append("defs");

        //Append a linearGradient element to the defs and give it a unique id
        var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

        var lStop = colorScale.range()[0]
        var mStop = colorScale.range()[1]
        var rStop = colorScale.range()[2]

        var cDom = colorScale.domain()
        var twoColor = false
        if(domain[0]==cDom[1]){
            twoColor = true;
            var lStop = mStop;
        }
        if(cDom[1]==domain[1]){
            twoColor = true;
            var rStop = mStop
        }

        //Set the color for the start (0%)
        linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", lStop);

        if(!twoColor){
            //Set the color for the end (50%)
            linearGradient.append("stop")
            .attr("offset","50%")
            .attr("stop-color", mStop);
        }

        //Set the color for the end (100%)
        linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", rStop);

        gradSVG.append("rect")
        .attr("width",150)
        .attr("height",20)
        .style("fill","url(#linear-gradient)")

        if(nonNums.length >0){

          gradSVG.append("rect")
          .attr("width",15)
          .attr("height",15)
          .attr("y",40)
          .style("fill","#519E3E")

          gradSVG.append("text")
          .attr("x",20)
          .attr("y",52.5)
          .text("nan")

          gradSVG.append("rect")
          .attr("width",15)
          .attr("height",15)
          .attr("y",40)
          .attr("x",55)
          .style("fill","#EF8636")

          gradSVG.append("text")
          .attr("x",20)
          .attr("y",52.5)
          .attr("x",75)
          .text("inf")

          gradSVG.append("rect")
          .attr("width",15)
          .attr("height",15)
          .attr("y",40)
          .attr("x",110)
          .style("fill","#C53932")

          gradSVG.append("text")
          .attr("x",20)
          .attr("y",52.5)
          .attr("x",130)
          .text("-inf")
        }

    }
}

function openLeg() {
	var nav = d3.select("#legendNav")
	nav.classed("active",!nav.classed("active"))

    if(legendOpen){
		d3.select("#legendNav")
		.style("width",0);

        d3.select("#gradSVG").remove()
        width+=200
         var clickedRect = d3.select("#execution").select("rect.clicked")
        var clicked = null
        if(!clickedRect.empty()){
            clicked = clickedRect.datum()
        }

        legendOpen = false;
        if(clicked != null){
            d3.select("#id" + clicked.data.id).dispatch("click")

        }
        draw_flame(actualRoot)


    }
    else{
		d3.select("#legendNav")
			.style("width","200px")

        width-=200
        var clickedRect = d3.select("#execution").select("rect.selected")
        var clicked = null
        if(!clickedRect.empty()){
            clicked = clickedRect.datum()
        }




        if(clicked != null){
            d3.select("#id" + clicked.data.id).dispatch("click")

        }
        legendOpen = true;
        draw_flame(actualRoot)
    }
}

function get_fill_color(d,colorScale,custom=null){
    if (filtered && d.data.filtered){
        return "lightgray"
    }

    if ( d.data.type == "call" || d.data.type == "script") {
            return d3.hcl(195, 5, 90); // d3.color("Teal").brighter();
        } else if (d.data.type == "custom"){
            return "LightYellow";
        } else if (d.data.type != "assign" && d.data.type != "expression" && d.data.type!="param"){
            return "powderblue";
    }


    var hid = ((d.data.type == "assign"||d.data.type=="expression" || d.data.type=="param") && shownVars.indexOf(d.data.name)!= 0);

    if(hid){
        return "#bac7cd";
    }

    if(d.data[d.data.name]=="nan"){
        return "#519E3E";
    }

    else if(d.data[d.data.name]=="inf"){
        return "#EF8636";
    }
    else if(d.data[d.data.name]=="-inf"){
      return "#C53932"
    }
    if (custom != null){
        return colorScale(getValue(d.data,d.data.name,custom,custom))
    }
    return colorScale(getValue(d.data,d.data.name,d.data.name));
}


function get_stroke_color(){
    return "white";
}

function highlight_dependencies(node){
        var curParent = node.parent
        var possNodes = {}
        var nodeNames = []
        var parents = []
        //ADD CHILDREN OF PRIOR SIBLING ONLY
        while (curParent!=null){
            var parName = buildName(curParent)
            parents.push(curParent)
//            if (nodeNames.indexOf(parName)==-1){
//                possNodes[parName]=[]
//
////                nodeNames.push(parName)
//            }
//            else{
//                possNodes[parName].push(curParent)
//            }
            var child = 0;
            while(curParent.children[child] && curParent.children[child].data.id < node.data.id){
//            for(var child in curParent.children){

                var childName = buildName(curParent.children[child]);
                 if (nodeNames.indexOf(childName)==-1 && parents.indexOf(curParent.children[child])==-1){
                    possNodes[childName]=[curParent.children[child]]
                    nodeNames.push(childName)
                }
                else if(parents.indexOf(curParent.children[child])==-1){
                    possNodes[childName].push(curParent.children[child])
                }
                child++;
            }
            curParent = curParent.parent
        }


        var deps =[]
        var depNodes = []
        var name = buildName(node)
        var done = false;
        var possibleDeps = []
        var curNames = [name]
        var usedNames = []
        var relatedNodes = Object.keys(possNodes)
        while(!done){
            var cur = curNames.shift()
            usedNames.push(cur)

            var curDeps = dependencies[cur]
            for(var i in curDeps){
                if(relatedNodes.indexOf(curDeps[i])>=0){
                    if(curNames.indexOf(curDeps[i])<0 ){
                        if(usedNames.indexOf(curDeps[i])<0){
                            curNames.push(curDeps[i]);
                        }
                        deps.push(curDeps[i])
                        for(var n in possNodes[curDeps[i]]){
                         depNodes.push(possNodes[curDeps[i]][n])
                        }
                    }
                }



            }
            if(curNames.length==0){
                done = true
            }
        }

        depNodes.forEach(function(d){
            id = "id"+d.data.id
            d3.select("#"+id)
//            .select("rect")
            .style("fill","red")
            .style("stroke","darkred")
             .style("stroke-width","5px")
            .classed("dependency",true)

            var contextId = "context"+d.data.id
            d3.select("#"+contextId)
//            .select("rect")
            .style("fill","red")
            .style("stroke","darkred")
             .style("stroke-width","5px")
            .classed("dependency",true)
        })
}

function buildName(node){
    var func = findContainingFunc(node.data.lineno)
    var name = "";
    if(node.data.type =="call"){
        name = node.data.func_name+node.data.lineno;
    }
    else if(node.data.type=="assign"||node.data.type=="expression"){
        name = node.data.name
    }
    else{
        console.log("Unhandled type: "+ node.data.type)
    }

    if(func!=null && node.data.type !="call"){
        name = func+"_"+name
    }
    return name
}

function findContainingFunc(lineno){
    funcs = Object.keys(funcInfo)
    ind = 0
    maxInd = funcs.length
    currChoice = ""
    for(i=0; i < maxInd; i++){
        if (funcInfo[funcs[i]].start <lineno && funcInfo[funcs[i]].end >lineno){
            if (currChoice == ""){
                currChoice = funcs[i]
            }
            else{
                if (funcInfo[funcs[currChoice]].start < funcInfo[funcs[i]].start && funcInfo[funcs[currChoice]].end>=funcInfo[funcs[i]].end){
                    currChoice = currChoice+"_"+funcs[i];
                }
            }

        }

    }

    return currChoice

}



function generate_color_scale(variable,custom = null,scaleType="linear"){
    var leaves = actualRoot.leaves().filter(function(d){return variable in d.data})
    if(filtered){
        leaves = leaves.filter(function(d){return !d.data.filtered})
    }

    var domain = d3.extent(leaves,function(d){
        if (custom != null)
        {
            return getValue(d.data,variable,custom,custom)
        }
        return getValue(d.data,variable,variable,custom)
    })
    console.log(domain)

    var fullDomain = [0,0,0]
   if(domain[0]<0){
        fullDomain[0] = domain[0]
   }
   else{
        fullDomain[1] = domain[0]
   }
   if (domain[1] >0){
        fullDomain[2] = domain[1]
   }
   else{
        fullDomain[1] = domain[1]
   }

   if(scaleInds[0] ==1 || (plotInfo.type == plot_types.s && shownVars.length == 1 && scaleInds[1]==1))
   {
        var colorScale =  d3.scaleSymlog()
        .domain(fullDomain)
        .range(['#7f3b08','lightGray','#2d004b']);
        return colorScale
   }
   else{
       var colorScale =  d3.scaleLinear()
        .domain(fullDomain)
        .range(['#7f3b08','lightGray','#2d004b']);
        return colorScale
   }

}

function count_leaves(root){

    root.value = 0
    root.totalvalue = 0
    var leaves = []
    if(!root.parent){
        root.preceding = 0
        root.totalpreceding = 0
    }

    if(!root.children || root.children.length==0){
        root.totalvalue = 1;
        if(root.hidden){
            root.value= 0;
        }
        else{
            root.value = 1;
            leaves.push(root)
        }
    }
    else{
        for(var child in root.children){
            if(!child.hidden){
                root.children[child].preceding = root.value + root.preceding
                root.children[child].totalpreceding = root.totalvalue + root.totalpreceding
                var childVal = count_leaves(root.children[child])

                root.value+=childVal[0]
                root.totalvalue+=childVal[1]
                leaves = leaves.concat(childVal[2])
            }

        }

    }

    return [root.value,root.totalvalue,leaves];
}



function prune_empty_loops(root){
    var empty = true
    if(!root.children && (root.data.type=="for" || root.data.type=="While")){
        return true
    }
    else{
        if(root.children){
            for(var child=root.children.length-1; child >-1; child--){
                if(root.children[child].data.type=="for" || root.children[child].data.type=="While"){
                    var childEmpty = prune_empty_loops(root.children[child])
                    if(!childEmpty){
                        empty = false;
                    }
                    else{
                        var c = root.children.splice(child,1)
                        if(root._children){
                            root._children.push(c)
                        }
                        else{
                            root._children=[c]
                        }
                    }
                }
                else{
                    prune_empty_loops(root.children[child])
                    empty = false;
                }
            }
        }
    }

    return empty
}
