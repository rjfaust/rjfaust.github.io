function init_exclusions(){
    d3.select("#exclFJson").property("value",JSON.stringify(excludedFuncs))

    d3.select("#exclLJson").property("value",JSON.stringify(excludedLibs))

    excludedFuncs.forEach(function(excl){
        var row = d3.select("#exclusions").select("tbody").append("tr").on("click",function(){selectRow(this);})

       row.append("td")
       .text(excl.name)

       row.append("td")
       .text("function")

       row.append("td")
       .text(excl.line)


    })

    excludedLibs.forEach(function(excl){
        var row = d3.select("#exclusions").select("tbody").append("tr").on("click",function(){selectRow(this);})

       row.append("td")
       .text(excl.name)

       row.append("td")
       .text("library")

       row.append("td")
       .text(excl.line)


    })
    d3.select("#ContextMenu")
    .on('mouseleave',function(){
        d3.select(this)
        .style("visibility","hidden")
    })


    d3.select("#exprMenu")
    .on('mouseleave',function(){
        d3.select(this)
        .style("visibility","hidden")
    })


}



function show_context(e){
    cm = d3.select("#ContextMenu")
    w = cm.style("width")
    h = cm.style("height")

    x = e.clientX;
    y = e.clientY;
    cm.style("visibility","visible")
    cm.style("left",(x-5)+"px")
    cm.style("top",(y-5)+"px")
}

function cmAddVar(){
    var string = editor.getSelection();
    var cursor = editor.getCursor("head");

    if(cursor.sticky=="after"){
        addVariable(string,cursor.line+1,cursor.ch)

    }
    else{
        addVariable(string,cursor.line+1,cursor.ch-string.length)
    }
}


function cmAddExpr(){
   var string = editor.getSelection();
    var cursor = editor.getCursor("head");
    if(cursor.sticky=="after"){
        addExpr(string,cursor.line+1,cursor.ch)
    }
    else{
        addExpr(string,cursor.line+1,cursor.ch-string.length)
    }
}

function cmAddFuncExcl(){
    var string = editor.getSelection();
    var cursor = editor.getCursor("head");

    if(cursor.sticky=="after"){
        addExclusion(string,cursor.line+1,"function")

    }
    else{
        addExclusion(string,cursor.line+1,"function")
    }
}


function cmAddLibExcl(){
   var string = editor.getSelection();
    var cursor = editor.getCursor("head");
    if(cursor.sticky=="after"){
        addExclusion(string,cursor.line+1,"library")
    }
    else{
        addExclusion(string,cursor.line+1,"library")
    }
}

function checkDupVar(v){
    var dup = false

    variables.forEach(function(d){
        if(v.name==d.name && v.line==d.line && v.offset==d.offset){
            dup= true;
            return dup;
            }
    })
    return dup

}

function checkDupExpr(e){
    var dup = false

    expressions.forEach(function(d){
        if(e.expr==d.expr && e.line==d.line && e.offset==d.offset){
            dup= true;
            return dup;
        }
    })
    return dup

}
function checkDupExclFunc(f){
    var dup = false

    excludedFuncs.forEach(function(d){
        if(f.name==d.name && f.line==d.line){
            dup= true;
            return dup;
        }
    })
    return dup

}

function checkDupExcludedLib(f){
    var dup = false

    excludedLibs.forEach(function(d){
        if(f.name==d.name && f.line==d.line){
            dup= true;
            return dup;
        }
    })
    return dup

}
function selectRow(r){
    row = d3.select(r)
    if(row.classed("selected")){
        d3.selectAll("tr").classed("selected",false).style("background-color","white")
        d3.selectAll("tr:nth-child(even)").style("background-color","#f2f2f2")
    }
    else{
        d3.selectAll("tr").classed("selected",false).style("background-color","white")
        d3.selectAll("tr:nth-child(even)").style("background-color","#f2f2f2")
        row.classed("selected",true)
        row.style("background-color", "#ddd")
    }
}


function deleteSelected(){
    var row = d3.select("#tracking").select("tr.selected")

    var type = row.select("td:nth-child(4)").text()


    var name = row.select("td:nth-child(1)").text()

    var line = row.select("td:nth-child(2)").text()

    var offset = row.select("td:nth-child(3)").text()

    if(type=="variable"){
        var ind= -1
        variables.forEach(function(v,i){
            if(name==v.name && line ==v.line && offset==v.offset){
                ind = i
            }
        });

        if(ind >= 0){
            variables.splice(ind,1)
            d3.select("#varJson").property("value",JSON.stringify(variables))

        }

    }
    else if(type=="expression"){
        var ind= -1
        expressions.forEach(function(e,i){
            if(name==e.expr && line ==e.line && offset==e.offset){
                ind = i
            }


        });

        if(ind >= 0){
            expressions.splice(ind,1)
            d3.select("#exprJson").property("value",JSON.stringify(expressions))

        }

    }

    row.remove()
    d3.selectAll("tr").classed("selected",false).style("background-color","white")
    d3.selectAll("tr:nth-child(even)").style("background-color","#f2f2f2")

}

function deleteSelectedExclusion(){
    var row = d3.select("#exclusions").select("tr.selected")

    var type = row.select("td:nth-child(2)").text()


    var name = row.select("td:nth-child(1)").text()

    var line = row.select("td:nth-child(3)").text()


    if(type=="function"){
        var ind= -1
        excludedFuncs.forEach(function(v,i){
            if(name==v.name && line ==v.line){
                ind = i
            }


        });

        if(ind >= 0){
            excludedFuncs.splice(ind,1)


        }

    }
    else if(type=="library"){
        var ind= -1
        excludedLibs.forEach(function(e,i){
            if(name==e.name && line ==e.line){
                ind = i
            }


        });

        if(ind >= 0){
            excludedLibs.splice(ind,1)

        }

    }




    row.remove()
    d3.selectAll("tr").classed("selected",false).style("background-color","white")
    d3.selectAll("tr:nth-child(even)").style("background-color","#f2f2f2")

}

function addVariable(name,line,offset){
   var variable={
    "name":name,
    "line":line,
    "offset": offset,
    "custom_exprs":[]
   }

   var dup = checkDupVar(variable)

   if(dup){
        alert("Duplicate Variable")
        return
   }
   else{

       variables.push(variable)
       var row = d3.select("#tracking").select("tbody").append("tr").on("click",function(){selectRow(this);})

       row
       row.append("td")
       .text(variable.name)

       row.append("td")
       .text(variable.line)

       row.append("td")
       .text(variable.offset)

       row.append("td")
       .text("variable")

       row.append("td")
       .html("<i>none<i>")
       .attr("id","v_"+(variables.length-1))
       .on("contextmenu",function(d){
            d3.event.preventDefault()
            cm = d3.select("#exprMenu")


            x = d3.event.pageX
            y = d3.event.pageY
            cm.style("visibility","visible")
            cm.style("left",(x-10)+"px")
            cm.style("top",(y-10)+"px")

            d3.selectAll("td").classed("custom_select",false)
            d3.select(this).classed("custom_select",true)
       })
    }
    cm = d3.select("#ContextMenu").style("visibility","hidden")

    d3.select("#varJson").property("value",JSON.stringify(variables))
}


function add_custom_expr(){
    var cell = d3.select("td.custom_select")
    var id = cell.attr("id").split("_")
    var name = ""
    if(id[0]=="v"){
        tracked = variables[id[1]]
        name = tracked.name;
    }
    else{
        tracked = expressions[id[1]];
        name = tracked.expr;
    }

    var txt;
//    var cExpr = prompt("Please enter the expression you wish to have evaluated.  When referencing "+
//    tracked.name + ", you may insert {} in its place.", "");

    var popUpList = $('<div title="Add Custom Expression">Please enter the expression you wish to have evaluated.  When referencing \"' +
    name + '\", you may insert {} in its place.<br><input id="cExprText" type="text" class="dialog_text"><br><input type="</div>');

//    $('#showPopUp').click(function () {

        popUpList.dialog({
            buttons:{
                Add: function(){
                    var cExpr = document.getElementById("cExprText").value;

                    if (cExpr != null && cExpr != ""){
                        if(cell.classed("custom")){
                            txt = cell.html();
                            txt += "<br>"+cExpr;
                            cell.html(txt)
                        }
                        else{
                            cell.html(cExpr)
                            cell.classed("custom",true)
                        }
                        tracked.custom_exprs.push(cExpr.replace("{}",name))

                    }

                    if(id[0]=="v"){
                        d3.select("#varJson").property("value",JSON.stringify(variables))
                    }
                    else{
                        d3.select("#exprJson").property("value",JSON.stringify(expressions))
                    }

                    $( this ).dialog( "destroy" ).remove();
                }
            },

            width:500
        });
}
//    });






function addExpr(expr,line,offset){
    var expr={
        "expr":expr,
        "line":line,
        "offset": offset,
        "custom_exprs":[]
       }
    var dup = checkDupExpr(expr)

    if(dup){
        alert("Duplicate Expression")
        return
    }
    else{
        expressions.push(expr)

        var row = d3.select("#tracking").select("tbody").append("tr").on("click",function(){selectRow(this);})


        row.append("td")
       .text(expr.expr)

       row.append("td")
       .text(expr.line)

       row.append("td")
       .text(expr.offset)

       row.append("td")
       .text("expression")

       row.append("td")
       .html("<i>none<i>")
       .attr("id","e_"+(expressions.length-1))
       .on("contextmenu",function(d){
            d3.event.preventDefault()
            cm = d3.select("#exprMenu")

            x = d3.event.pageX
            y = d3.event.pageY
            cm.style("visibility","visible")
            cm.style("left",(x-10)+"px")
            cm.style("top",(y-10)+"px")

            d3.selectAll("td").classed("custom_select",false)
            d3.select(this).classed("custom_select",true)
       })
    }

    cm = d3.select("#ContextMenu").style("visibility","hidden")

     d3.select("#exprJson").property("value",JSON.stringify(expressions))


}


function addExclusion(name,line,type){
   var excl={
    "name":name,
    "line":line
   }
   var dup = false
    if(type=="function"){
         dup = checkDupExclFunc(excl)
    }
    else if(type=="library"){
         dup = checkDupExcludedLib(excl)
    }


   if(dup){
        alert("Duplicate Exclusion")
        return
   }
   else{
        if(type=="function"){
             excludedFuncs.push(excl)
              d3.select("#exclFJson").property("value",JSON.stringify(excludedFuncs))
        }
        else if(type=="library"){
             excludedLibs.push(excl)
              d3.select("#exclLJson").property("value",JSON.stringify(excludedLibs))
        }
       var row = d3.select("#exclusions").select("tbody").append("tr").on("click",function(){selectRow(this);})

       row.append("td")
       .text(excl.name)

       row.append("td")
       .text(type)

       row.append("td")
       .text(excl.line)

    }
    cm = d3.select("#ContextMenu").style("visibility","hidden")


}

function clear_spec(){
  variables = [];
  excludedFuncs = [];
  excludedLibs = [];
  expressions = [];
}

function highlight(element){
    d3.select(element)
    .style("background-color","DodgerBlue")
    .style("color","white")
    }
function unhighlight(element){
        d3.select(element)
        .style("background-color","#f2f2f2")
            .style("color","black")

    }
