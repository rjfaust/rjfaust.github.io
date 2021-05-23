editor = null
source = ""
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var plotMargin = {top: 10, right: 100, bottom: 100, left: 80};

// var boundingRect = document
//     .querySelector('#execution')
//     .getBoundingClientRect();
// var boundingRect = {right:}
var editorWidth = boundingRect.right - boundingRect.left - plotMargin.left - plotMargin.right - 20;
// var editorWidth = window.innerWidth*(2.0/5)- plotMargin.left - plotMargin.right - 20;
var editorWidth = window.innerWidth - (window.innerWidth*(3.0/5)- margin.left - margin.right - 40);
var loopInfo = null
var funcInfo = null
var dependencies = null
//var additions = []


function show_source(source, readonly =false){
    source = source.replace(/&#34;/g,"\"");
    sourceLines = source.split("\n");

    alteredSource = source.split("\n");

    reset_source(source,readonly)


}

function getText(){
    var text = editor.getValue("\n");
    var lines = text.split("\n");
    var newStr = "";
    for(line in lines) {
        newStr+=lines[line]+"\n";
    }
    return newStr;
}

function highlightLine(div,br,n){
    div.style.backgroundColor = n==10 ? "red" : "";
}

function loadFunctions(fInfo){
    funcInfo = fInfo;

    var linenos = []
    tracked.forEach(function(v){
        v.instances.forEach(function(i){
            linenos.push(i.lineno)
        })
    })
//    CodeMirror.commands.foldAll(editor)


    var keys = Object.keys(funcInfo)
    keys.forEach(function(k){
        var f = funcInfo[k];
        var temp = linenos.filter(function(d){return d>=f.start && d <= f.end});
        if(temp.length == 0){
            editor.foldCode(CodeMirror.Pos(f.start-1, 0));
        }
    })
}


function fold(openFunctions=[]){
    var linenos = []
    tracked.forEach(function(v){
        v.instances.forEach(function(i){
            linenos.push(i.lineno)
        })
    })

    var keys = Object.keys(funcInfo)
    keys.forEach(function(k){
        if(!(k in openFunctions)){
            var f = funcInfo[k];
            var temp = linenos.filter(function(d){return d>=f.start && d <= f.end});
            if(temp.length == 0){
                editor.foldCode(CodeMirror.Pos(f.start-1, 0));
            }
        }

    })


}



function loadLoops(lInfo){
    loopInfo = lInfo;
}


function loadDependencies(deps){
    dependencies = deps;
}




function highlight_tracked(tracked){
    tracked.forEach(function(t){
        t.instances.forEach(function(inst){
            var h = editor.markText({line:inst.lineno-1,ch:inst.offset},{line:inst.lineno-1,ch:t.name.length+inst.offset},{css:"background-color:lightblue; opacity:50%"})
        })
    })
}

function reset_source(text,readonly, scroll=false){

    var scrollInfo = null
    if(scroll){
         scrollInfo= editor.getScrollInfo();
    }



    d3.select("#code").selectAll("div").remove();
     d3.select("#source").html(text);
//    editor = CodeMirror.fromTextArea(document.getElementById("source"), {
//        lineNumbers: true,
//        matchBrackets: true,
//        mode: "text/x-python",
//        readOnly: readonly,
//        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
//        foldGutter: true,
//        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//        styleNumbers:highlightLine
//
//        });
      editor = CodeMirror.fromTextArea(document.getElementById("source"), {
        mode: "python",
        lineNumbers: true,
        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });

    editor.setSize(editorWidth,(window.innerHeight-155));
//    editor.addLineClass(10,"gutter","highlightGutter");

    editor.on("contextmenu",function(cm,e){
          // d3.event.preventDefault();
          e.preventDefault();

        var selectedCode = editor.getSelection();
        var offset = document.getElementById("code").getBoundingClientRect();

        if(traceVis){
          var found = tracked.find(function(d){return d.name == selectedCode})
          if (found != null){
              cm = d3.select("#codeCMenu")

              xCoord = e.pageX
              yCoord = e.pageY
              cm.style("visibility","visible")
              cm.style("left",(xCoord-10)+"px")
              cm.style("top",(yCoord-10)+"px")
              cm.style("height", "50px")

          }
        }
        else{
          cm = d3.select("#codeSpecMenu")
          x = e.pageX;
          y = e.pageY;
          cm.style("visibility","visible")
          cm.style("left",(x-5)+"px")
          cm.style("top",(y-5)+"px")
          cm.style("height", "100px")
        }

    })

    d3.select("#code")
    .append("div")
    .attr("id","codeCMenu")
    .style("position","fixed")
    .style("visibility","hidden")
    .on('mouseleave',function(){
        d3.select(this)
        .style("visibility","hidden")
    })
    // .attr("class","contextMenu")
    .append("ul")
    .style("list-style-type","none")
    .style("margin",0)
    .style("padding-left","20px")
    .style("padding-top","5px")
    .append("li")
    .on("mouseenter",function(d){cmHighlight(this)})
    .on("mouseleave",function(d){cmUnhighlight(this)})
    .on("click",function(d){
      var selectedCode = editor.getSelection();
      var cursor = editor.getCursor();
      show_var_ops(selectedCode, cursor.line+1, 0)

    })
    .html("Add Variable to Plot")

    ul = d3.select("#code")
    .append("div")
    .attr("id","codeSpecMenu")
    .style("position","fixed")
    .style("visibility","hidden")
    .on('mouseleave',function(){
        d3.select(this)
        .style("visibility","hidden")
    })
    .append("ul")
    .style("list-style-type","none")
    .style("margin",0)
    .style("padding-left","20px")
    .style("padding-top","5px")

    opts = [{"val":"Add Variable","click":cmAddVar}, {"val":"Add Expression","click":cmAddExpr}, {"val":"Exclude Function","click":cmAddFuncExcl}, {"val":"Exclude Library","click":cmAddLibExcl}]
    ul.selectAll("li")
    .data(opts)
    .enter()
    .append("li")
    .on("mouseenter",function(d){highlight(this)})
    .on("mouseleave",function(d){unhighlight(this)})
    .on("click",function(d){d["click"]()})
    .html(function(d){return d.val})
    // editor.on("dragstart",function(d,e){
    //     d3.select("#xRect0")
    //     .style("fill","whitesmoke")
    //     .style("stroke","gray")
    //
    //
    //     d3.select("#yRect0")
    //     .style("fill","whitesmoke")
    //     .style("stroke","gray")
    //
    //
    //     d3.select("#plotRect0")
    //     .style("fill","whitesmoke")
    //     .style("stroke","gray")
    //
    //     var selectedCode = editor.getSelection();
    //
    //     var offset = document.getElementById("code").getBoundingClientRect();
    //     var found = tracked.find(function(d){return d.name == selectedCode})
    //     if (found != null){
    //         e.preventDefault();
    //         d3.select("#varDrag")
    //         .style("top",(e.y-offset.top-6)+"px")
    //         .style("left",e.x+ "px")
    //         .html(selectedCode)
    //         .style("display","block")
    //         pos3 = e.clientX;
    //         pos4 = e.clientY;
    //         document.onmouseup = closeDragElement;
    //         document.onmousemove = elementDrag;
    //         dragging = true;
    //     }
    // })

    //
    // if(!readonly){
    //     var xbounds = document.getElementById("xRect0").getBoundingClientRect();
    //     var ybounds = document.getElementById("yRect0").getBoundingClientRect();
    //     var svgBounds = document.getElementById("plotRect0").getBoundingClientRect();
    //     var curArea = -1;
    // }

    function elementDrag(e) {
        elmnt = document.getElementById("varDrag")
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        //CHECK IF IN BOUNDS OF AXIS



        var x = e.clientX;
        var y = e.clientY;

        var inArea = false

        if(x > xbounds.left && x < xbounds.right && y > xbounds.top && y < xbounds.bottom){
            d3.select("#xRect0")
            .style("fill","lightblue")
            inArea = true;
            curArea = 0;
        }
        else{
            d3.select("#xRect0")
            .style("fill","whitesmoke")
        }

        if(x > ybounds.left && x < ybounds.right && y > ybounds.top && y < ybounds.bottom && !inArea){
            d3.select("#yRect0")
            .style("fill","lightblue")
            curArea = 1;
            inArea = true;
        }
        else{
            d3.select("#yRect0")
            .style("fill","whitesmoke")
        }

        if(!inArea && x > svgBounds.left && x < svgBounds.right && y > svgBounds.top && y < svgBounds.bottom){
            d3.select("#plotRect0")
            .style("fill","lightblue")
            curArea = 2;
            inArea = true;
        }
        else{
            d3.select("#plotRect0")
            .style("fill","whitesmoke")
        }
        if(!inArea){
            curArea = -1;
        }
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    d3.select("#varDrag")
    .style("display","none")


    dragging = false;
    //TODO: DETERMINE WHICH Axis it is dropped on, if any or if it is dropped in plot area
    if(curArea >-1){
        var selectedCode = editor.getSelection();
        var cursor = editor.getCursor();

        show_var_ops(selectedCode, cursor.line+1, curArea);
    }

//        d3.select("#xRect")
//        .style("fill","none")
//        .style("stroke","none")
//
//
//        d3.select("#yRect")
//        .style("fill","none")
//        .style("stroke","none")
//
//
//        d3.select("#plotRect")
//        .style("fill","none")
//        .style("stroke","none")

        d3.selectAll(".plotRect")
        .style("fill", "none")
        .style("stroke","none")
   }


    if(scroll){
        editor.scrollTo(scrollInfo.left,scrollInfo.top);
    }
}

function highlight_block(d){

        if(d.data.type=="for"){
            var info = loopInfo["for-"+d.data.lineno]
            for(i=info.start-1; i< info.end; i++){
                var h = editor.markText({line:i,ch:0},{line:i,ch:sourceLines[i].length},{css: "background-color:yellow; opacity:50%"});
            }
        }

        if(d.data.type=="while"){
            var info = loopInfo["while-"+d.data.lineno]
            for(i=info.start-1; i< info.end; i++){
                var h = editor.markText({line:i,ch:0},{line:i,ch:sourceLines[i].length},{css: "background-color:yellow; opacity:50%"});
            }
        }

        if(d.data.type=="custom"){
            curParent = d.parent
            while(curParent.data.type=="custom"){
                curParent = curParent.parent
            }
            if(curParent.data.type=="while"){
                var info = loopInfo["while-"+d.data.lineno]
                for(i=info.start-1; i< info.end; i++){
                    var h = editor.markText({line:i,ch:0},{line:i,ch:sourceLines[i].length},{css: "background-color:yellow; opacity:50%"});
                }
            }

            if(curParent.data.type=="for"){
                var info = loopInfo["for-"+d.data.lineno]
                for(i=info.start-1; i< info.end; i++){
                    var h = editor.markText({line:i,ch:0},{line:i,ch:sourceLines[i].length},{css: "background-color:yellow; opacity:50%"});
                }
            }
        }

        if(d.data.type=="call"){
            if(d.data.func_name in funcInfo){
            var info = funcInfo[d.data.func_name]
            for(i=info.start-1; i< info.end; i++){
                var h = editor.markText({line:i,ch:0},{line:i,ch:sourceLines[i].length},{css: "background-color:lemonchiffon; opacity:50%"});
            }
            }
        }
        if(d.data.lineno>0)
        {
            highlightMarker = editor.markText({line:d.data.lineno-1,ch:0},{line:d.data.lineno-1,ch:sourceLines[d.data.lineno-1].length},{css: "background-color:yellow; opacity:10%"});
        }
}

function add_vals(d){
    var alteredSource = editor.getValue().split("\n")
    alteredSource = remove_additions(alteredSource);
    additions =[]
//    var additions = []
    tracked.forEach(function(v){
        var pts = get_points(d,[v.name]);
        var vals={};
        v.instances.forEach(function(inst){
            vals[inst.lineno] = []
        })

        var attr = "val1"
        var i = shownVars.indexOf(v.name)
        var c = null
        var n = v.name
        if(i >= 0 && shownVars_exprs[i] != null){
            attr = "cval1"
            c = shownVars_exprs[i]
            n = c
        }

        pts.forEach(function(p){

            vals[p.lineno1].push(getValue(p,v,attr,custom = null));
        })

        Object.keys(vals).forEach(function(k){
            var valStr =vals[k].join(",");

            alteredSource[k-1] +=" {"+ n + ": " + valStr + "}";
            additions.push({"lineno":k, "value":"{"+ n + ": " + valStr + "}"});
        })


    })

    var text = alteredSource.join("\n");
    reset_source(text,false,true);
    additions.forEach(function(addition,i){
         editor.markText({line:addition.lineno-1,ch:sourceLines[addition.lineno-1].length},{line:addition.lineno-1,ch:alteredSource[addition.lineno-1].length},{css: "color:salmon;"});
    });

}

function remove_additions(source){
    if(additions){

    additions.forEach(function(s){
        source[s.lineno-1] = source[s.lineno-1].replace(s.value,"")
    })
    }
    return source
}
