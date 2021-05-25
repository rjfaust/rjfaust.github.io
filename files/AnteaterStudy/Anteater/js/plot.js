var plotMargin = {top: 10, right: 100, bottom: 100, left: 80};
// var boundingRect = document
//     .querySelector('#execution')
//     .getBoundingClientRect();
var plotWidth = window.innerWidth*(2.0/5)- plotMargin.left - plotMargin.right - 20;
// var editorWidth = window.innerWidth*(2.0/5)- plotMargin.left - plotMargin.right - 20;

var plotHeight = window.innerHeight*.4-plotMargin.top-plotMargin.bottom;
var plotSVG = null;
//var x = null
//var y = null

var axes = []

var plotInfo = {
    type: "histogram",
    multiple: false,
    axes : [],
    group_on: []
}

var filterHideBlocks = false;
var filtered = false;
var filteredIds = {};
var stringOps =["Frequency","Length"]
var current_plot = null
var plot_types = {"h":"histogram","b":"bar","box":"boxplot","s":"scatter","c":"curve","pc":"parallel coordinates"}
var multiPlotSize = {h:400, w: 400 }
var groupings = []
var grouping_types = {b:"boolean", s:"string", st:"structure", c:"custom"}
var nonNumColors = {nan:"green", inf:"blue", "-inf":"orange","Anteater:Expression_Error":"red"}
var scales = ["linear","symmetric Log"]
var scaleInds = [0,0]

var maxPlots = 10;
var vegaView = null;
var points = []
var context = []
var groupedPoints = {}
var groupedContext = {}

function init_plot(){
    if(plotHeight < multiPlotSize.h){
        multiPlotSize.h = plotHeight;
    }

    if(plotWidth/2 < multiPlotSize.w){
        multiPlotSize.w = plotWidth;
    }

    d3.select("#plotOptNav")
	   .style("height",plotHeight+"px")

    d3.select("#varOpts")
        .on("change",function(){
            ind = this.selectedIndex;
            curVars[0] = variables[ind].name;
            logEvent(eventTypes.change,evtObj.curVar,curVar[0]);
            clearPlot();
            updateSecondVarOpts();
            loadTree(fullTrace);
        });

    var plotOpts = d3.select("#plotOptArea");

    plotSVG = d3.select("#plotView")
    .style("width", plotWidth + plotMargin.right + plotMargin.left + "px")
    .style("height", plotHeight + plotMargin.top + plotMargin.bottom + "px")

    d3.select("#plotIcons")
        .selectAll("img")
        .data(["boxplot","histogram", "scatter", "curve"])
        .on("click", function(d) {
            d3.select("#plotIcons")
                .selectAll("img")
                .style("opacity", 0.25)
                .classed('plotType',false);
            d3.select(this).style("opacity", 1)
            .classed("plotType",true);

            if(shownVars.length>0){
              var colorScale = generate_color_scale(shownVars[0],shownVars_exprs[0])
              d3.selectAll("rect.execNode")
                        .classed("highlighted",false)
                        .style("fill",function(d){return get_fill_color(d,colorScale,shownVars_exprs[0]);})
                        .style("stroke",function(d){return get_stroke_color(d,colorScale);});
                    d3.selectAll("rect.contextNode")
                        .classed("highlighted",false)
                        .style("fill","gray")
                        .style("stroke","black")
            }

            if((plotInfo.type == plot_types.h || plotInfo.type == plot_types.b) && d==plot_types.s){
              var oldX = scaleInds[0]
              scaleInds[0] = scaleInds[1];
              scaleInds[1] = oldX;
            }
            else if(plotInfo.type == plot_types.s &&(d == plot_types.h || d== plot_types.b)){
              var oldX = scaleInds[0]
              scaleInds[0] = scaleInds[1];
              scaleInds[1] = oldX;
            }

            plotInfo.type = d;
            var plotInd = 0;

            if(shownVars.length > 1){
                var group_inds = []
                plotInfo.group_on.forEach(function(ind){
                    if(groupings[ind].type==grouping_types.b || groupings[ind].type == grouping_types.s){
                        group_inds.push(groupings[ind].attr)
                    }
                })

                shownVars.forEach(function(v,i){
                    if(!group_inds.includes(i)){
                        plotInds = i;
                    }
                })
            }
            if(d==plot_types.h && get_var_type(plotInd) == "string"){
                plotInfo.type = plot_types.b;
            }
            plot(true,false);
        });

    multiInfo = {nPlots:1,nCols:1,nRows:1};

    d3.select("#axisMenu")
    .on('mouseleave',function(){
        d3.select(this)
        .style("visibility","hidden")
    })

    d3.select("#plotCMenu")
    .on('mouseleave',function(){
        d3.select(this)
        .style("visibility","hidden")
    })

    d3.select("#plotView")
    .on("contextmenu",function(e){
        d3.event.preventDefault();
        cm = d3.select("#plotCMenu")

        xCoord = d3.event.pageX
        yCoord = d3.event.pageY
        cm.style("visibility","visible")
        cm.style("left",(xCoord-10)+"px")
        cm.style("top",(yCoord-10)+"px")
    })
}

function update_plot_opts(){
  var txt = '<div title="Plot Options">Plot Options: <br/>'
  if(plotInfo.type==plot_types.s && shownVars.length == 1){
        txt+="<label>x Axis - </label>"
        txt+="<label style=\"padding-left:10px\"> Value: </label>"
        txt += "<select disabled=true class=\"axisOpts\" >"
        txt+= "<option value = \"timestamp\">timestamp </option>"
        txt+="</select><br/>"

        var name = shownVars[0]
        if (shownVars_exprs[0] != null){
          name = shownVars_exprs[0]
        }

        txt+="<label>y Axis - </label>"
        txt+="<label style=\"padding-left:10px\"> Value: </label>"
        txt += "<select id=\"v0\" class=\"axisOpts\" >"
        txt+= "<option id=\"opt_0\" value = 0 >"+name+" </option>"
        txt+= "<option id=\"opt_delete\" value = \"delete\" > Delete </option>"
        txt+="</select>"
        txt+="<label style=\"padding-left:10px\"> Scale: </label>"
        txt += "<select id=\"scale_0\" class=\"scaleOpts\" >"
        scales.forEach(function(s,j){
          txt+="<option id=\"opt_"+j+"\" value = "+j
          if(scaleInds[1]==j){
            txt+=" selected "
          }
          txt+= ">"+scales[j]+" </option>"
        })

        txt+="</select>"
  }
  else if(plotInfo.type==plot_types.b || plotInfo.type == plot_types.h){
        var name = shownVars[0]
        if (shownVars_exprs[0] != null){
          name = shownVars_exprs[0]
        }

        txt+="<label>x Axis - </label>"
        txt+="<label style=\"padding-left:10px\"> Value: </label>"
        txt += "<select id=\"v0\" class=\"axisOpts\" >"
        txt+= "<option id=\"opt_0\" value = 0 >"+name+" </option>"
        txt+= "<option id=\"opt_delete\" value = \"delete\" > Delete </option>"
        txt+="</select>"
        txt+="<label style=\"padding-left:10px\"> Scale: </label>"
        txt += "<select id=\"scale_0\" class=\"scaleOpts\" >"
        scales.forEach(function(s,j){
          txt+="<option id=\"opt_"+j+"\" value = "+j
          if(scaleInds[0]==j){
            txt+=" selected "
          }
          txt+= ">"+scales[j]+" </option>"
        })
        txt+="</select><br/>"

        txt+="<label>y Axis - </label>"
        txt+="<label style=\"padding-left:10px\"> Value: </label>"
        txt += "<select disabled=true class=\"axisOpts\" >"
        txt+= "<option value = \"count\">count </option>"
        txt+="</select>"
        txt+="<label style=\"padding-left:10px\"> Scale: </label>"
        txt += "<select id=\"scale_1\" class=\"scaleOpts\" >"
        scales.forEach(function(s,j){
          txt+="<option id=\"opt_"+j+"\" value = "+j
          if(scaleInds[1]==j){
            txt+=" selected "
          }
          txt+= ">"+scales[j]+" </option>"
        })
        txt+="</select><br/>"
  }
  else{
      shownVars.forEach(function(v,i){
        if(i==0 && shownVars.length ==2){
          txt+="<label>x Axis - </label>"
        }
        else if (i==1 && shownVars.length ==2){
          txt+="<label>y Axis - </label>"
        }
        else{
          txt+="<label>Axis "+i+" - </label>"
        }
        txt+="<label style=\"padding-left:10px\"> Value: </label>"
        txt += "<select id=\"v"+i+"\" class=\"axisOpts\" >"
        shownVars.forEach(function(d,j){
          var name = d;
          if(shownVars_exprs[j]!=null){
            name = shownVars_exprs[j]
          }
            txt+= "<option id=\"opt_"+j+"\" value = "+j+" "
            if(j==i){
              txt+="selected "
            }

            txt+=">"+name+" </option>"
        })

        txt+= "<option id=\"opt_delete\" value = \"delete\" > Delete </option>"
        txt+="</select>"
        if(plotInfo.type!= plot_types.pc){
          txt+="<label style=\"padding-left:10px\"> Scale: </label>"
          txt += "<select id=\"scale_"+i+"\" class=\"scaleOpts\" >"
          scales.forEach(function(s,j){
            txt+="<option id=\"opt_"+j+"\" value = "+j
            if(scaleInds[i]==j){
              txt+=" selected "
            }
            txt+= ">"+scales[j]+" </option>"
          })
          txt+="</select>"
        }
        txt+="<br/>"
      })
  }

  var popUpList = $(txt);

   popUpList.dialog({
       buttons:{
           Submit: function(){
              var newShown = []
              var newShown_expr = []
              var newScaleInds = []
              for(var i =0; i < shownVars.length; i++){
                var selectNode = d3.select("#v"+i).node()
                var ind = selectNode.options[selectNode.selectedIndex].value
                if(ind!="delete"){
                  newShown.push(shownVars[ind])
                  newShown_expr.push(shownVars_exprs[ind])
                  sInd = 0
                  if(plotInfo.type != plot_types.pc){
                    var scaleNode = d3.select("#scale_"+i).node()
                    sInd = scaleNode.options[scaleNode.selectedIndex].value
                  }
                  newScaleInds.push(sInd);
                }
              }
              if(newShown.length==1 && plotInfo.type==plot_types.s){
                newScaleInds = [0,newScaleInds[0]]
              }
              else if(newScaleInds.length ==1){
                newScaleInds.push(0)
              }

              var update = true;
              if(shownVars.length > 2 && newShown.length <=2){
                update = false;
              }

              var old_type = plotInfo.type;
              if(shownVars.lenth == 1){
                plot()
                plotInfo.type = old_type;
              }

              shownVars = newShown;
              shownVars_exprs = newShown_expr;
              scaleInds = newScaleInds;

              if(shownVars.length > 0){
                plot(update)
              }
              else{
                clear_plot()
              }
            $( this ).dialog('destroy').remove();
           }
       },
       close:function(){
         $( this ).dialog('destroy').remove();
       },
       width:500
   });
}

function change_rad(d){
        if(d.checked){
            d3.selectAll(".val_rad").property("checked",false)
            d3.select(d).property("checked",true)
        }
}

function show_var_ops(variable, lineno){
    var txt = '<div id=\"varOptsDialog\" title="Value Options">Please select which value to add to the plot:<br><input id="radio_0" '
    +'type="radio" class="val_rad" onchange="change_rad(this)" checked=true>' + variable

    tracked_ind=0;
    var lines = tracked[tracked_ind].instances.map(x => x.lineno)
    while(tracked[tracked_ind].name != variable || !lines.includes(lineno)){
        tracked_ind++;
        lines = tracked[tracked_ind].instances.map(x => x.lineno)
    }

    tracked[tracked_ind].custom.forEach(function(e,i){
        txt +='<br><input id="radio_'+(i+1)+'" type="radio" class="val_rad" onchange="change_rad(this)">' + e;
    })

    txt += '<br></div>';

    var popUpList = $(txt);

    popUpList.dialog({
        buttons:{
            Submit: function(){

                var expr = d3.selectAll(".val_rad")
                .filter(function(d,i){
                    return this.checked
                }).attr('id')

                var ind = parseInt(expr.substring(6,expr.length))

                if (ind >0){
                    cExpr = tracked[tracked_ind].custom[ind-1]
                }
                else{
                    cExpr = null
                }

                update_plot_vars(variable,cExpr);

                $( this ).dialog('destroy').remove();
            }
        },
        close:function(){
          $( this ).dialog('destroy').remove();
        },
        width:500
    });
}

function update_plot_vars(variable,cExpr){

    shownVars.push(variable);
    shownVars_exprs.push(cExpr);

    if(shownVars.length == 1){
        d3.select("#plotIcons")
        .selectAll("img")
        .classed('plotType',false);

        d3.select("#icon-histogram")
        .classed("plotType",true)
    }
    else if(shownVars.length ==2 ){
        d3.select("#plotIcons")
        .selectAll("img")
        .style("opacity", .25)
        .classed('plotType',false);

        d3.select("#icon-scatter")
        .style("opacity", 1)
        .classed("plotType",true)

        d3.select("#icon-histogram")
        .style("display","none")
    }
    else{
        if(scaleInds.length < shownVars.length){
            var c = shownVars.length - scaleInds.length;
            for(var i = 0; i < c; i++){
                scaleInds.push(0)
            }
        }
    }

    color = generate_color_scale(shownVars[0],shownVars_exprs[0])

    d3.selectAll(".execNode")
    .style("fill",function(d){return get_fill_color(d,color, shownVars_exprs[0]);})
    draw_legend(rootNode, color)

    plot();

}

function clear_plot(){

    d3.select("#plotDiv")
    .selectAll("*")
    .remove()

    d3.select("#plotView")
    .selectAll("*")
    .remove()

    d3.select("#plotIcons")
    .style("display",null)

    var x = d3.scaleLinear()
    .domain([0,0])
    .range([0,plotWidth]);

    var xAxis = d3.axisBottom()
    .scale(x)

    var y = d3.scaleLinear()
    .domain([0,0])
    .range([plotHeight,0]);

    var yAxis = d3.axisLeft()
    .scale(y)

    d3.select("#plotCMenu")
    .on('mouseleave',function(){
        d3.select(this)
        .style("visibility","hidden")
    })

}

function reset_plot_bookkeeping(){
  filterHideBlocks = false;
  filtered = false;
  filteredIds = {};
  current_plot = null
  groupings = []
  scaleInds = [0,0]
  vegaView = null;
  selectedPoints = []
}

function get_var_type(vInd){
    if(shownVars_exprs[vInd]==null){
        return trackedTypes[shownVars[vInd]];
    }
    else{
        return trackedTypes_expr[shownVars[vInd]][shownVars_exprs[vInd]];
    }

}

function plot(update = false, requery = true){
    clear_plot();
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

    splitVar = null;

    if(!update){
        scaleInds = []
        shownVars.forEach(function(d){
            scaleInds.push(0)
        })
        groupings = []
        plotInfo.group_on = []
        v_types.sort(function(a,b){return a[0] > b[0]});
        if(shownVars.length > 1){
            determine_groupby_vars(v_types);
        }
        find_structural_groups();

         var drp = d3.select("#group_drpdwn");
            drp.selectAll("input")
            .remove();
            drp.selectAll("label")
            .remove();
            drp.selectAll("br")
            .remove()

            groupings.forEach(function(grp,i){
                drp.append("input")
                .attr("type","checkbox")
                .attr("id","grp_opt_"+ i)
                .on("change",function(){change_grp();})

                var lbl = ""
                if(grp.type == grouping_types.b || grp.type == grouping_types.s){
                    if(shownVars_exprs[grp.attr]!= null){
                        lbl = shownVars_exprs[grp.attr];
                    }
                    else{
                        lbl = shownVars[grp.attr];
                    }
                }
                else if(grp.type == grouping_types.st){
                    lbl = grp.attr.type + " on " + grp.attr.lineno
                }
                else{
                    lbl = "Custom Group"
                }

                drp.append("label")
                .style("margin-left","5px")
                .html(" " + lbl)

                drp.append("br")
        })

        if (groupings.length > 1){
            d3.select("#grp_opt_0")
            .property("checked",true)

            if(groupings[0].count * groupings[1].count <= maxPlots){
                plotInfo.group_on = [0, 1]

                d3.select("#grp_opt_1")
                .property("checked",true)
            }
            else{
                plotInfo.group_on = [0]
            }
        }
        else if (groupings.length ==1){
            d3.select("#grp_opt_0")
            .property("checked",true)

            plotInfo.group_on = [0]
        }
        else{
            plotInfo.group_on = []
        }
        determine_plot(v_types,plotInfo.group_on);
    }

    if(requery){
      points = get_points(rootNode,shownVars,plotInfo.group_on)
      context = [];
      if(rootNode.parent){
          context = get_points(rootNode.parent,shownVars,plotInfo.group_on)
      }
    }

    var multiInfo = {nPlots:1, nCols:1, nRows:1}

    var groupTitle = ""
    if (plotInfo.multiple){

      plotInfo.group_on.forEach(function(ind,j){
          g = groupings[ind]

          if(j > 0){
              groupTitle += " and "
          }

          if(g.type == grouping_types.b || g.type == grouping_types.s){
              groupInds.push(g.attr);

              if(shownVars_exprs[g.attr] != null){
                  groupTitle += shownVars_exprs[g.attr];
              }
              else{
                  groupTitle += shownVars[g.attr];
              }
              groupTitle += "=" + vals[j]

          }
          else if(g.type == grouping_types.st){
              groupTitle += "\""+g.attr.type + "\" at line " + g.attr.lineno
          }
          else{

          }
      })
  }

    if(plotInfo.multiple && requery){

            multiInfo.nPlots =1;
            if(plot_types.box != plotInfo.type){
                plotInfo.group_on.forEach(function(ind){
                    var g = groupings[ind];
                    multiInfo.nPlots *= g.count;
                })
            }

            multiInfo.nCols = Math.floor(plotWidth/multiPlotSize.w)
            multiInfo.nRows = Math.ceil(multiInfo.nPlots/multiInfo.nCols)
            var h = multiPlotSize.h;
            if(multiInfo.nPlots == 1){
                h = plotHeight
            }

            d3.select("#plot")
            .select("svg").attr("viewBox", "0 0 "+ (plotWidth + plotMargin.right + plotMargin.left)+" "+(multiInfo.nRows * (h + plotMargin.top + plotMargin.bottom)))

            groupedPoints = split_points_by_group(points,plotInfo.group_on[0])
            groupedContext = split_points_by_group(context,plotInfo.group_on[0])
            if(plotInfo.group_on.length > 1){
                var final_grouped = {}

                Object.keys(groupedPoints).forEach(function(key){
                    groupedPoints[key] = split_points_by_group(groupedPoints[key], plotInfo.group_on[1])
                    Object.keys(groupedPoints[key]).forEach(function(k2){
                        final_grouped[key+"__"+k2]=groupedPoints[key][k2]
                    })
                })

                Object.keys(groupedContext).forEach(function(key){
                    groupedContext[key] = split_points_by_group(groupedContext[key], plotInfo.group_on[1])
                    Object.keys(groupedPoints[key]).forEach(function(k2){
                        final_grouped[key+"__"+k2]=groupedPoints[key][k2]
                    })
                })
                groupedPoints= final_grouped

                var final_context = {}

                Object.keys(groupedContext).forEach(function(key){
                    groupedPoints[key] = split_points_by_group(groupedContext[key], plotInfo.group_on[1])
                    Object.keys(groupedPoints[key]).forEach(function(k2){
                        final_context[key+"__"+k2]=groupedContext[key][k2]
                    })
                })

                Object.keys(groupedContext).forEach(function(key){
                    groupedContext[key] = split_points_by_group(groupedContext[key], plotInfo.group_on[1])
                    Object.keys(groupedPoints[key]).forEach(function(k2){
                        final_context[key+"__"+k2]=groupedContext[key][k2]
                    })
                })
                groupedContext= final_context

            }

    }

    if(plotInfo.type == plot_types.pc){
        d3.select("#xaxis0").style("visibility","hidden")
        d3.select("#yaxis0").style("visibility","hidden")
        d3.select("#xRect0").style("visibility","hidden")
        d3.select("#yRect0").style("visibility","hidden")
    }

    var plot_dims = {x:0, y:0, width:plotWidth, height:plotHeight, ind:0}

    if(plotInfo.type == plot_types.box ){
            dat_ind = parseInt(plotInfo.axes[1].substring(2))
            box_plot(groupedPoints, groupedContext, shownVars[dat_ind], plot_dims, groupTitle, shownVars_exprs[dat_ind])
        }
    else if(plotInfo.type == plot_types.h){
        if(plotInfo.multiple){
            var keys = Object.keys(groupedPoints);
            var regPoints =[]
            var contPoints = []
            var contKeys = Object.keys(groupedContext)
            keys.forEach(function(k,i){
              var p = groupedPoints[k];
              var c = []
              if(contKeys.includes(k)){
                  c = groupedContext[k];
              }
              p.forEach(function(p2){
                  p2["instance"] = i
                  regPoints.push(JSON.parse(JSON.stringify(p2)))
              })
              c.forEach(function(c2){
                c2["instance"]=i
                contPoints.push(JSON.parse(JSON.stringify(c2)))
              })
            })
             dat_ind =0
        //If data groupings ever happen, dat_ind may need to  change
            plot_hist(regPoints,contPoints,shownVars[dat_ind],plot_dims,shownVars_exprs[dat_ind],groupTitle, grouped = true)

        }
        else{
            plot_hist(points, context, shownVars[0],plot_dims, shownVars_exprs[0])
        }
    }
    else if(plotInfo.type == plot_types.b){
        if(plotInfo.multiple){
          var keys = Object.keys(groupedPoints);
          var regPoints =[]
          var contPoints = []
          var contKeys = Object.keys(groupedContext)
          keys.forEach(function(k,i){
              var p = groupedPoints[k];
              var c = []
              if(contKeys.includes(k)){
                  c = groupedContext[k];
              }
              p.forEach(function(p2){
                  p2["instance"] = i
                  regPoints.push(JSON.parse(JSON.stringify(p2)))
              })
              c.forEach(function(c2){
                c2["instance"]=i
                contPoints.push(JSON.parse(JSON.stringify(c2)))
              })
          })
          dat_ind =0
                //If data groupings ever happen, dat_ind may need to  change
          plot_bar(regPoints,contPoints,shownVars[dat_ind],plot_dims,shownVars_exprs[dat_ind],groupTitle,grouped = true)

        }
        else{
            plot_bar(points, context,shownVars[0],plot_dims, shownVars_exprs[0])
        }
    }
    else if(plotInfo.type == plot_types.s || plotInfo.type == plot_types.c){
        if(plotInfo.multiple){
          var keys = Object.keys(groupedPoints);
              var regPoints =[]
              var contPoints = []
              var contKeys = Object.keys(groupedContext)
              keys.forEach(function(k,i){
                  var p = groupedPoints[k];
                  var c = []
                  if(contKeys.includes(k)){
                      c = groupedContext[k];
                  }
                  p.forEach(function(p2){
                      p2["instance"] = i
                      regPoints.push(JSON.parse(JSON.stringify(p2)))
                  })
                  c.forEach(function(c2){
                    c2["instance"]=i
                    contPoints.push(JSON.parse(JSON.stringify(c2)))
                  })
              })

                if(shownVars.length ==1){
                // if(shownVars.length - groupInds ==1){
                    // var dat_ind = 0;
                    // while(groupInds.includes(dat_ind)){
                    //     dat_ind++;
                    // }
                    dat_ind =0
                          //If data groupings ever happen, dat_ind may need to  change
                    plot_scatter(regPoints,contPoints,"timestamp",shownVars[dat_ind],plot_dims,null,shownVars_exprs[dat_ind],groupTitle,plotInfo.type == plot_types.c, grouped =true)
                }
                else{
                    var plotInds = [0,1];

                    // for(var curInd = 0; curInd < shownVars.length; curInd++){
                    //     if(!groupInds.includes(curInd)){
                    //         plotInds.push(curInd);
                    //     }
                    // }

                    plot_scatter(regPoints, contPoints, shownVars[plotInds[0]], shownVars[plotInds[1]],plot_dims, shownVars_exprs[plotInds[0]], shownVars_exprs[plotInds[1]], groupTitle, plotInfo.type == plot_types.c, grouped=true);
                }
        }
        else if (shownVars.length ==1){
            plotInfo.axes = ["timestamp","v_0"]
            plot_scatter(points,context, "timestamp", shownVars[0], plot_dims, customX = null, customY = shownVars_exprs[0], null, plotInfo.type == plot_types.c)
        }
        else{
            plotInfo.axes = ["v_0", "v_1"]
            plot_scatter(points, context, shownVars[0], shownVars[1], plot_dims, shownVars_exprs[0], shownVars_exprs[1], null, plotInfo.type == plot_types.c);
        }
    }

    else if(plotInfo.type == plot_types.pc){
        if(plotInfo.multiple){

        }
        else{
          shownVars.forEach(function(v){
            plotInfo.axes.push("v_"+i)
          })
            plot_pc(shownVars, points, context,shownVars_exprs);
        }
    }
    determine_shown_icons();

    var rect = d3.select("#id"+rootNode.data.id)
    if(!rect.classed("selected")){
        rect.dispatch("click");
    }
}

function change_grp(){
    var groups = []

    d3.select("#group_drpdwn")
    .selectAll("input")
    .nodes()
    .forEach(function(n){
        var node = d3.select(n);
        if(node.property("checked")){
            groups.push(parseInt(node.attr("id").substring(8)))
        }
    })
    if(groups.length == 0){
        plotInfo.multiple = false;
    }

    plotInfo.group_on = groups;
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

    v_types.sort(function(a,b){return a[0] > b[0]})

    determine_plot(v_types,plotInfo.group_on);

    plot(true);
}

function create_axes(multiInfo){

    for(var i=0; i< multiInfo.nPlots; i++){
        var row = Math.ceil((i+1)/multiInfo.nCols) - 1
        var col = (i+1)-Math.floor(i/multiInfo.nCols) * multiInfo.nCols - 1
        var xPos = col * (multiPlotSize.w + plotMargin.left);
        var yPos = row * (multiPlotSize.h + plotMargin.top + plotMargin.bottom) ;
        var h = multiPlotSize.h ;
        var w = multiPlotSize.w;

        plotSVG = d3.select("#plot")
        .select("svg")
        .append("g")
        .attr("id","group_"+i)
        .attr("transform","translate(" + plotMargin.left + ","+plotMargin.top+")")

        if(multiInfo.nPlots==1){
            h = plotHeight;
            w = plotWidth;
        }

        plotSVG.append('rect')
        .attr("id","plotRect" + i)
        .attr("class","plotRect")
        .style("fill","white")
        .style("z-index",-100)
        .attr("width", w+ "px")
        .attr("height", h + "px")
        .attr("transform", "translate(" + (xPos ) + "," + (yPos ) + ")");

        plotSVG.append("g")
        .on("contextmenu",function(d){
                d3.event.preventDefault();
                cm = d3.select("#axisMenu")
                x = d3.event.pageX
                y = d3.event.pageY
                cm.style("visibility","visible")
                cm.style("left",(x-10)+"px")
                cm.style("top",(y-10)+"px")

          })
        .append("rect")
        .attr("x", xPos)
        .attr("y", yPos + h-15)
        .attr("id","xRect"+i)
        .attr("class","plotRect")
        .style("z-index",-100)
        .style("width", w + "px")
        .style("height","30px")
        .style("fill","white")

         plotSVG.append("g")
         .on("contextmenu",function(d){
                d3.event.preventDefault();
                cm = d3.select("#axisMenu")
                x = d3.event.pageX
                y = d3.event.pageY
                cm.style("visibility","visible")
                cm.style("left",(x-10)+"px")
                cm.style("top",(y-10)+"px")
         })
        .append("rect")
        .attr("x",xPos - 15)
        .attr("y",yPos)
        .attr("id","yRect"+i)
        .attr("class","plotRect")
        .style("z-index",-100)
        .style("width", "30px")
        .style("height", h + "px")
        .style("fill","white")

        var x = d3.scaleLinear()
        .domain([0,0])
        .range([xPos,w+xPos]);

        var xAxis = d3.axisBottom()
        .scale(x)

        var y = d3.scaleLinear()
        .domain([0,0])
        .range([yPos + h,yPos]);

        var yAxis = d3.axisLeft()
        .scale(y)

        axes.push([x,y])

        var g= plotSVG.append("g")
        .attr("id","xHighlight"+i)
        .on("contextmenu",function(d){
            d3.event.preventDefault();
            cm = d3.select("#axisMenu")

            x = d3.event.pageX
            y = d3.event.pageY
            cm.style("visibility","visible")
            cm.style("left",(x-10)+"px")
            cm.style("top",(y-10)+"px")

        })
        .on("mouseenter",function(d){
            var ind = parseInt(d3.select(this)
            .select("rect")
            .attr("id")
            .substring(9))

            d3.select("#xRect"+ind)
            .style("fill","whitesmoke")
            .style("stroke","black")
        })
        .on("mouseleave",function(d){
            var ind = parseInt(d3.select(this)
            .select("rect")
            .attr("id")
            .substring(9))
            d3.select("#xRect"+ind)
            .style("fill","none")
            .style("stroke","none")
        })
         g.append("rect")
         .attr("id","xaxisRect"+i)
        .attr("x",xPos - 15)
        .attr("y",yPos)
        .style("width", w + "px")
        .style("height","30px")
        .style("fill","transparent")
        .attr("transform", "translate(0," + h + ")")

        g.append("g")
        .attr("id","xaxis"+i)
        .attr("class", "x axis")
        .attr("transform", "translate("+0+"," + (yPos + h) + ")")
        .call(xAxis);


        g=plotSVG.append("g")
        .on("contextmenu",function(d){
            d3.event.preventDefault();
            cm = d3.select("#axisMenu")

            x = d3.event.pageX
            y = d3.event.pageY
            cm.style("visibility","visible")
            cm.style("left",(x-10)+"px")
            cm.style("top",(y-10)+"px")

        })
        .on("mouseenter",function(d){
            if(!dragging && shownVars.length<3){
                var ind = parseInt(d3.select(this)
                .select("rect")
                .attr("id")
                .substring(9))
                d3.select("#yRect"+ind)
                .style("fill","whitesmoke")
                .style("stroke","black")
            }
        })
        .on("mouseleave",function(d){
            if(!dragging && shownVars.length<3){
                var ind = parseInt(d3.select(this)
                .select("rect")
                .attr("id")
                .substring(9))
                d3.select("#yRect"+ind)
                .style("fill","none")
                .style("stroke","none")
            }
        })

         g.append("rect")
         .attr("id","yaxisRect"+i)
        .attr("x",xPos - 15)
        .attr("y",yPos)
        .style("width", "30px")
        .style("height",h + "px")
        .style("fill","transparent")


        g.append("g")
        .attr("id","yaxis"+i)
        .attr("class", "y axis")
        .attr("transform","translate("+xPos + ","+ 0 +")")
        .call(yAxis);
    }



}

function plot_old(){
    clear_plot();
    var inferred_plotType = "histogram"
    var clicked_plotType = d3.select(".plotType").data()

    if(shownVars.length ==1){
        //singular plot
        var points = get_points(rootNode,shownVars)
        var context = [];
        if(rootNode.parent){
            context = get_points(rootNode.parent,shownVars)
        }

        var pType = d3.select(".plotType").data()
        if(pType=="histogram"){
            if (shownVars_exprs[0]== null && trackedTypes[shownVars[0]]==typeof(4)){
                plot_hist(points, context, shownVars[0])
            }
            else if (shownVars_exprs[0]== null && trackedTypes[shownVars[0]]==typeof("s")){
                plot_bar(points, context,shownVars[0])
            }
            else if (shownVars_exprs[0]==null && trackedTypes[shownVars[0]]==typeof(true)){
                plot_bar(points, context,shownVars[0])
            }
            else if (trackedTypes_expr[shownVars[0]][shownVars_exprs[0]]==typeof(4)){
                plot_hist(points, context, shownVars[0],shownVars_exprs[0])
            }
            else if (trackedTypes_expr[shownVars[0]][shownVars_exprs[0]]==typeof("s")){
                plot_bar(points, context, shownVars[0], shownVars_exprs[0])
            }
            else if (trackedTypes_expr[shownVars[0]][shownVars_exprs[0]]==typeof(true)){
                plot_bar(points, context, shownVars[0], shownVars_exprs[0])
            }
        }
        else if (pType=="scatter"){
            plot_scatter(points,context,"timestamp",shownVars[0],customX = null, customY = shownVars_exprs[0])
        }
        else if(pType == "curve"){
                plot_scatter(points, context, "timestamp", shownVars[0], null, shownVars_exprs[0], true)
        }
    }
    else if(shownVars.length == 2){
        //scatterplot
        var points = get_points(rootNode,shownVars)
        var context = [];
        var pType = d3.select(".plotType").data()

        if(rootNode.parent){
            context = get_points(rootNode.parent,shownVars)
        }
        if (pType == "scatter"){
            plot_scatter(points, context, shownVars[0], shownVars[1],shownVars_exprs[0], shownVars_exprs[1]);

        }
        else{
            plot_scatter(points, context, shownVars[0], shownVars[1],shownVars_exprs[0], shownVars_exprs[1],true)

        }
    }
    else if(shownVars.length > 2){
        d3.select("#plotIcons")
        .style("display","none")

        //parallel coordinates
         d3.select("#xaxis")
        .style("display","none")

        d3.select("#yaxis")
        .style("display","none")
        var points = get_points(rootNode,shownVars);
        var context = [];
        if(rootNode.parent){
            context = get_points(rootNode.parent,shownVars);
        }

        plot_pc(shownVars, points, context,shownVars_exprs);
    }
}

function clearAxis(e){
    var x = e.pageX-e.offsetX;
    var y = e.pageY-e.offsetY;
    selectedPoints = [];

    if (shownVars.length > 2){
        var dims = d3.selectAll(".dimension")

        var found = dims.filter(function(d){
            var bound = this.getBoundingClientRect()
            return (bound.x <=x && bound.y <= y && bound.x + bound.width >=x && bound.y + bound.height >=y);
        })
       var v = found.data()[0]
       var ind = shownVars.indexOf(v);
       shownVars.splice(ind,1)
       shownVars_exprs.splice(ind,1)
       scaleInds.splice(ind,1)
        if (shownVars.length <=2){
            d3.select("#icon-scatter")
            .style("display",null)
        }

    }
    else{
        var xbounds = document.getElementById("xRect0").getBoundingClientRect();
        var ybounds = document.getElementById("yRect0").getBoundingClientRect();

        //if y axis
        if(ybounds.left <= x && ybounds.right >=x && ybounds.top <=y && ybounds.bottom <=y){
            //if y axis is the data in timeline view
            if(shownVars.length == 1 && d3.select(".plotType").data()=="scatter"){
                shownVars.splice(0,1)
                shownVars_exprs.splice(0,1)
                scaleInds[0] = 0;
            }
            else{
                shownVars.splice(1,1)
                shownVars_exprs.splice(1,1)
                scaleInds[1] = 0;
            }
        }
        else{
            //in the x axis
            shownVars.splice(0,1)
            shownVars_exprs.splice(0,1)
            scaleInds[0] = 0;
        }
        if (shownVars.length <=1){
            d3.select("#icon-histogram")
            .style("display",null)
        }
    }
    if(shownVars.length>0){
        var colorScale = generate_color_scale(shownVars[0],shownVars_exprs[0])

        d3.selectAll("rect.execNode")
            .classed("highlighted",false)
            .style("fill",function(d){return get_fill_color(d,colorScale,shownVars_exprs[0]);})
            .style("stroke",function(d){return get_stroke_color(d,colorScale);});
        d3.selectAll("rect.contextNode")
            .classed("highlighted",false)
            .style("fill","gray")
            .style("stroke","black")

        plot();
    }
    else{
        var colorScale = null
        d3.selectAll("rect.execNode")
            .classed("highlighted",false)
            .style("fill",function(d){return get_fill_color(d,colorScale,null);})
            .style("stroke",function(d){return get_stroke_color(d,colorScale);});
        d3.selectAll("rect.contextNode")
            .classed("highlighted",false)
            .style("fill","gray")
            .style("stroke","black")

        var info = {nPlots:1, nCols:1, nRows:1}

        clear_plot();
    }

    d3.select("#axisMenu")
    .style("visibility","hidden")
}

function changeScale(e){
     var txt = '<div title="Scale Options">Please select which scale to use:"'

     scales.forEach(function(s,i){
        txt += '<br><input id="scale_'+i+'" '+'type="radio" class="scale_rad" onchange="change_scale_rad(this)"'
        if(i ==0){
            txt +=  'checked=true >' + s
        }
        else{
            txt +=  ' >' + s
        }
     })

    txt += '<br></div>';

    var popUpList = $(txt);

    popUpList.dialog({
        buttons:{
            Submit: function(){

                var s = d3.selectAll(".scale_rad")
                .filter(function(d,i){
                    return this.checked
                }).attr('id')

                var scaleInd = parseInt(s[6])

                var x = e.pageX-e.offsetX;
                var y = e.pageY-e.offsetY;

                if (shownVars.length > 2){
                    var dims = d3.selectAll(".dimension")

                    var found = dims.filter(function(d){
                        var bound = this.getBoundingClientRect()
                        return (bound.x <=x && bound.y <= y && bound.x + bound.width >=x && bound.y + bound.height >=y);
                    })
                   var ind = found.data()[0]

                   scaleInds[ind] = scaleInd;
                }
                else{
                    var xbounds = document.getElementById("xRect0").getBoundingClientRect();
                    var ybounds = document.getElementById("yRect0").getBoundingClientRect();

                    //in the y axis
                    if(ybounds.left <= x && ybounds.right >=x && ybounds.top <=y && ybounds.bottom <=y){
                        if(shownVars.length == 1 && d3.select(".plotTYpe").data()=="scatter"){
                            scaleInds[0] = scaleInd;

                        }
                        else{
                            scaleInds[1]= scaleInd

                        }
                    }
                    else{
                        scaleInds[0] = scaleInd;
                    }
                }

                plot(true)

                $( this ).dialog('destroy').remove();
            }
        },
        width:500
    });
}

function change_scale_rad(d){
    if(d.checked){
        d3.selectAll(".scale_rad").property("checked",false)
        d3.select(d).property("checked",true)
    }
}

function get_points(rootN, variables, group = null){
    var l = rootN.leaves()
    var range = [rootN.data.id, l[l.length-1].data.id];
    var statement = "";
    var select_clause = "";
    var where_clause = "";
    var join_clause = "";

    variables.forEach(function(v,i){
        var j =i+1
        if(i>0){
            select_clause +=", "
            where_clause += " AND "
            join_clause += " INNER JOIN tracked t"+j + " ON t"+j + ".parentID = t"+(j-1) + ".parentID AND t"+j+".iteration = t"+(j-1)+".iteration "
        }
        select_clause += "t"+j+".name as name"+j+ ", t"+j+".id as id"+j+",t"+j+".timestamp as timestamp"+j+", t"+j+".val as val"+j +", t"+j+".lineno as lineno"+j
        where_clause += "t"+j+".name=\""+v+"\" AND t" + j + ".id <= " + range[1] + " AND t"+j+".id >= "+range[0];

        if(filtered && filteredIds[v] && filteredIds[v].length > 0){


            where_clause += " AND t"+j+".id IN ("

            filteredIds[v].forEach(function(id,k){
                if(k>0){
                    where_clause+=", ";
                }
                where_clause += id;
            })
            where_clause+= ")"
        }
        var k = shownVars.indexOf(v)
        if(k>=0 && shownVars_exprs[k] != null){
           select_clause += ", c"+j+".name as cname" + j + ", c"+j+".val as cval"+j;
           join_clause+= " INNER JOIN custom c"+j + " ON t"+j+".id = c"+j+".baseID "
           where_clause += " AND c" + j + ".name="+JSON.stringify(shownVars_exprs[k    ])
        }
    })
    var statement = "SELECT " + select_clause + " FROM tracked t1 " + join_clause + " WHERE " + where_clause

    if(group != null){
        var ordered = false;
        group.forEach(function(ind){
            var g = groupings[ind];
            if(g.type == grouping_types.b || g.type == grouping_types.s){
                if(!ordered){
                    statement += "ORDER BY "
                    ordered = true;
                }
                else{
                    statement += ", "
                }

                if(shownVars_exprs[g.attr]!= null){
                    statement += "cval"+(group+1)
                }
                else{
                    statement += "val"+(group+1)
                }
            }
        })
    }

    var p = db.exec(statement)
    return p;
}

function filter(){
    filteredIds = {}

    filtered = false;

    allNodes = d3.selectAll(".execNode").data()
    allNodes.forEach(function(d){
        d.data.filtered = true;
    })

    selectedPoints.forEach(function(d){
        var no = d3.select("#id" + d.id1).data()[0]
        no.data.filtered = false
        while(no.parent && no.parent!=null){
            no = no.parent
            no.data.filtered = false
        }
        if(d.name1 in filteredIds){
            filteredIds[d.name1].push(d.id1)
        }
        else{
            filteredIds[d.name1]=[d.id1]
        }
        ind = 2
        while("id"+ind in d){
            no = d3.select("#id"+d["id"+ind]).data()[0]
            no.filtered = false
            while(no.parent && no.parent!=null){
                no = no.parent
                no.data.filtered = false
            }
            if(d["name"+ind] in filteredIds){
                filteredIds[d["name"+ind]].push(d["id"+ind])
            }
            else{
                filteredIds[d["name"+ind]]=[d["id"+ind]]
            }
            ind++;
        }
    })
    testFilter =d3.hierarchy(rootNode.data,function(d){return d.body})
    filteredTree = d3.hierarchy(trace,function(d){
        if (d.body){
            return d.body.filter(function(d2){return !d2.filtered});
        }
        else{
            return d.body
        }
    });
    filtered = true;
    rootNode = actualRoot;

    if(filterHideBlocks){
        draw_flame(filteredTree)
        rootNode = filteredTree
        plot(true)
    }
    else{
        draw_flame(rootNode)
        plot(true)
    }

    d3.select("#plotCMenu")
    .style("visibility","hidden")
}

function clear_filters(){
    filteredIds = {}
    allNodes = d3.selectAll(".execNode").data()
    allNodes.forEach(function(d){
        d.data.filtered = true;
    })
    filtered =false;
    rootNode = actualRoot
    draw_flame(actualRoot)

    plot(true)
}

function filter_hide(){
    filterHideBlocks = d3.select("#chk_hide").property("checked");
    if(filtered){
        filteredTree = d3.hierarchy(trace,function(d){
            if (d.body){
                return d.body.filter(function(d2){return !d2.filtered});
            }
            else{
                return d.body
            }
        });

        if(filterHideBlocks){
            draw_flame(filteredTree)
            rootNode = filteredTree
        }
        else{
            draw_flame(actualRoot)
            rootNode = actualRoot
        }
        plot(true)
    }

}

function count_instances(v,c,l){
    var select_clause = "COUNT(t.val) as ct"
    var join_clause = ""
    var where_clause ="t.name=\""+v+"\" AND lineno="+l
    if(c!= null){
            where_clause += " AND c.name=\""+c + "\""
            join_clause=" INNER JOIN custom c ON t.id = c.baseID"
            select_clause = "COUNT(c.val) as ct"
    }

    var statement = "SELECT " + select_clause + " FROM tracked t" + join_clause + " WHERE " + where_clause + " LIMIT 1"

    return db.exec(statement)[0].ct

}

function select_first_instance(v,c,l){
    var select_clause = "*"
    var join_clause = ""
    var where_clause ="t.name=\""+v+"\" AND lineno="+l
    if(c!= null){
            where_clause += " AND c.name=\""+c + "\""
            join_clause=" INNER JOIN custom c ON t.id = c.baseID"
            select_clause = "*"
    }

    var statement = "SELECT " + select_clause + " FROM tracked t" + join_clause + " WHERE " + where_clause + " LIMIT 1"

    return db.exec(statement)[0]
}

function determine_plot(v_types,group){

    var group_inds = []
    group.forEach(function(ind){
        if(groupings[ind].type==grouping_types.b || groupings[ind].type == grouping_types.s){
            group_inds.push(groupings[ind].attr)
        }
    })

    var plotInds = [];
    v_types.forEach(function(v){
        if(!group_inds.includes(v[1])){
            plotInds.push(v)
        }
    })
    if(group.length > 0){
            plotInfo.multiple = true;
    }
    else{
        plotInfo.multiple = false;
    }
    if(plotInfo.multiple && plotInds.length == 1 && plotInds[0][0]=="q"){
        plotInfo.type = plot_types.box
        var dat_ind = 0;
        while(group_inds.includes(dat_ind)){
            dat_ind++;
        }
        plotInfo.axes = ["g_"+0, "v_"+dat_ind]
    }
    else if(plotInds.length>3){
        plotInfo.type = plot_types.pc;
        plotInfo.multiple = false;
    }
    else if(group_inds.length ==0  && plotInds.length >2){
        plotInfo.type = plot_types.pc;
        plotInfo.multiple = false;
    }
    else{
        var pInfo = plot_table[plotInds[0][0]];
        var i = 1;
        while(i < plotInds.length){
            pInfo = pInfo[plotInds[i][0]];
            i++;
        }
        plotInfo.type = pInfo.plot;
        shownVars.forEach(function(v,i){
          plotInfo.axes.push("v_"+i)
        })
        if(plotInfo.axes.length ==1){
          plotInfo.axes.push("count")
        }
    }


}

function determine_groupby_vars(v_types){
    sInd = 0;

    while(sInd < v_types.length && v_types[sInd][0]=="b"){
        groupings.push({
                type:grouping_types.b,
                count: 2,
                attr: v_types[sInd][1]
        })
        sInd++;
    }

    while (sInd < v_types.length && v_types[sInd][0]!="s"){
        sInd++;
    }

    while (sInd < v_types.length){
        var v = shownVars[v_types[sInd][1]];

        var where_clause = "t.name=\""+v+"\""
        var select_clause = "t.val"
        var join_clause = ""

        if(shownVars_exprs[v_types[sInd][1]]!= null){
            where_clause += " AND c.name=\""+shownVars_exprs[v_types[sInd][1]] + "\""
            join_clause="INNER JOIN custom c ON t.id = c.baseID"
            select_clause = "c.val"

        }

        var statement = "SELECT COUNT( DISTINCT "+ select_clause + ") as ct FROM tracked t "+join_clause +" WHERE "+where_clause

        var count = db.exec(statement)[0].ct
        if(count< 10){
            groupings.push({
                type:grouping_types.s,
                count: count,
                attr: v_types[sInd][1]
            })
        }
        sInd++;
    }
}

function determine_shown_icons(){
        d3.select("#plotIcons")
        .selectAll("img")
        .style("opacity", .25)
        .classed('plotType',false)
        .style("display",null);
    if(plotInfo.type!=plot_types.pc){
      d3.select("#icon-pc")
       .style("display","none")
    }

    if(plotInfo.group_on.length == 0 || get_var_type(0) != typeof(4) ){
        d3.select("#icon-box")
        .style("display","none")
    }

    if(plotInfo.type == plot_types.box){
         d3.select("#icon-box")
        .style("opacity", 1)
        .classed("plotType",true)
    }
    else if(plotInfo.type == plot_types.h){
        d3.select("#icon-histogram")
        .style("opacity", 1)
        .classed("plotType",true)
    }
    else if(plotInfo.type == plot_types.b){
        d3.select("#icon-histogram")
        .style("opacity", 1)
        .classed("plotType",true)
        d3.select("#icon-scatter")
         .style("display","none")
         d3.select("#icon-curve")
          .style("display","none")
    }
    else if(plotInfo.type == plot_types.s){
        d3.select("#icon-scatter")
        .style("opacity", 1)
        .classed("plotType",true)

        var gCount = 0;
        groupings.forEach(function(g){
            if(g.type== grouping_types.b || g.type == grouping_types.s){
                gCount++;
            }
        })

        if (shownVars.length - gCount >1){
            d3.select("#icon-histogram")
            .style("display","none")
        }
    }
    else if(plotInfo.type == plot_types.c){
        d3.select("#icon-curve")
        .style("opacity", 1)
        .classed("plotType",true)

        var gCount = 0;
        groupings.forEach(function(g){
            if(g.type== grouping_types.b || g.type == grouping_types.s){
                gCount++;
            }
        })

        if (shownVars.length - gCount > 1){
           d3.select("#icon-histogram")
            .style("display","none")
        }

    }
    else if(plotInfo.type == plot_types.pc){
      d3.select("#icon-box")
       .style("display","none")
       d3.select("#icon-histogram")
        .style("display","none")
        d3.select("#icon-scatter")
         .style("display","none")
         d3.select("#icon-curve")
          .style("display","none")
        d3.select("#icon-pc")
        .style("opacity",1)
        .style("display","true")

        //parallel coordinates
         d3.select("#xaxis")
        .style("display","none")

        d3.select("#yaxis")
        .style("display","none")
    }

}

function split_points_by_group(points,groupInd){
    var group = groupings[groupInd];

    if(group.type == grouping_types.b || group.type == grouping_types.s){
        var groupedPoints = {}
        points.forEach(function(d,i){
            var key = null
            if(shownVars_exprs[group.attr]!= null){
                key = d["cval"+(group.attr+1)];
            }
            else{
                key = d["val"+(group.attr+1)];
            }

            if(key in groupedPoints){
                groupedPoints[key].push(d);
            }
            else{
                groupedPoints[key]=[d];
            }
        })
        return groupedPoints;
    }
    //split points by structural grouping
    else if(group.type == grouping_types.st){
        var blocks = db.exec("SELECT * FROM block WHERE lineno=" + group.attr.lineno + "AND type=\"" + group.attr.type+"\"")
        var groupedPoints = {};
        blocks.forEach(function(b,i){

            var k =b.id;
            var k_next = -1;
            var siblings = []
            var root = b
            while(siblings.length==0 && root.id!=0){
              siblings = db.exec("SELECT * FROM block WHERE parentID="+root.parentID)
              siblings = siblings.filter(function(s){return s.id>root.id});
              root = db.exec("SELECT * FROM block WHERE id="+root.parentID)[0]
            }
            siblings.sort(function(a,b){return a.id > b.id})
            if(siblings.length>0){
              k_next = siblings[0].id
            }

            groupedPoints[k] = points.filter(function(p){
                return p.id1 > k && (p.id1 < k_next || k_next == -1);
            })
        })
        return groupedPoints;

    }
    else if(group.type == grouping_types.c){
        //because points are joined this should work.
        var groupedPoints = {};

    }
}

//This function will make the assumption that we only do groupings for two variables
function find_structural_groups(){

    //Look within each variable to find instances on different paths
    var pathsToComp = {}

    shownVars.forEach(function(v,i){
        var parents  = {}
        var ind = 0;
        while(ind<tracked.length && tracked[ind].name!=v){
            ind++;
        }
        tracked[ind].instances.forEach(function(inst,j){
            var first = select_first_instance(v,shownVars_exprs[i],inst.lineno);
            var ct = count_instances(v,shownVars_exprs[i],inst.lineno);
            if (ct > 0){
            if(first.parentID in parents){
                parents[first.parentID][0] += ct;
                parents[first.parentID][1].push(inst.lineno);

            }
            else{
                parents[first.parentID] = [ct,[inst.lineno]];
            }
            }
        })
        pathsToComp[v] = parents;
    })

    var joins = []
    if(shownVars.length == 1){

    Object.keys(pathsToComp[shownVars[0]]).forEach(function(p1,i){
        var l = db.exec("SELECT * FROM block WHERE id=" + p1)[0];

        var info = db.exec("SELECT MAX(id) as m, COUNT(id) as ct FROM block WHERE lineno =" + l.lineno)[0]
        var maxID = info.m
        var count = info.ct

        if(maxID > l.id ){
            joins.push(l)
            groupings.push({
                type:grouping_types.st,
                count: count,
                attr: {lineno:l.lineno,type:l.type}
            })
        }

        while(l.parentID!=null && maxID > l.id){
            l = db.exec("SELECT * FROM block WHERE id="+l.parentID)[0];
            info = db.exec("SELECT MAX(id) as m, COUNT(id) as ct FROM block WHERE lineno =" + l.lineno)[0];
            maxID = info.m;
            count = info.ct;

            if(maxID > l.id){
                joins.push(l)
                groupings.push({
                    type:grouping_types.st,
                    count: count,
                    attr: {lineno:l.lineno,type:l.type}
                })
            }
        }


    })
    }
    else{
        //Now check if paths are compatible.
        Object.keys(pathsToComp[shownVars[0]]).forEach(function(p1,i){
            Object.keys(pathsToComp[shownVars[1]]).forEach(function(p2,i){
                //same number of instances at those paths
                if(pathsToComp[shownVars[0]][p1][0] == pathsToComp[shownVars[1]][p2][0]){
                    //paths are compatible
                    var b1 = db.exec("SELECT * FROM block WHERE id=" + p1)[0]
                    var b2 = db.exec("SELECT * FROM block WHERE id=" + p2)[0]

                    while (b1.id != b2.id){
                        if(b1.id < b2.id){
                            b2 = db.exec("SELECT * FROM block WHERE id=" + b2.parentID)[0]
                        }
                        else{
                            b1 = db.exec("SELECT * FROM block WHERE id="+b1.parentID)[0]
                        }
                    }

                    var l = b1;

                    var info = db.exec("SELECT MAX(id) as m, COUNT(id) as ct FROM block WHERE lineno =" + b1.lineno)[0];
                    var maxID = info.m;
                    var count = info.ct;

                    if(maxID > l.id ){
                        joins.push(l)
                        groupings.push({
                            type:grouping_types.st,
                            count: count,
                            attr: {lineno:l.lineno,type:l.type}
                        })
                    }

                    while(l.parentID!=null && maxID > l.id){
                        l = db.exec("SELECT * FROM block WHERE id="+l.parentID)[0];
                        info = db.exec("SELECT MAX(id) as m, COUNT(id) as ct FROM block WHERE lineno =" + l.lineno)[0];
                        maxID = info.m;
                        count = info.ct;

                        if(maxID > l.id){
                            joins.push(l)
                            groupings.push({
                                type:grouping_types.st,
                                count: count,
                                attr: {lineno:l.lineno,type:l.type}
                            })
                        }
                    }

                }
            })
        })
    }

    return joins
}

function filter_non_nums(points,variable,name,custom){
    var infs = points.filter(function(d){return getValue(d,variable,name,custom)=="inf" });
    var nans = points.filter(function(d){return getValue(d,variable,name,custom)=="nan" });
    var nInfs = points.filter(function(d){return getValue(d,variable,name,custom)=="-inf" });
    var badExpr = points.filter(function(d){return getValue(d,variable,name,custom)=="Anteater:Expression_Error"});

    var nonNums = []
    if(infs.length > 0){
        nonNums.push({type:"inf",count:infs.length, data:infs});
    }
    if(nInfs.length > 0){
        nonNums.push({type:"-inf",count:nInfs.length, data:nInfs});
    }
    if(nans.length > 0){
        nonNums.push({type:"nan",count:nans.length, data:nans});
    }
    if(badExpr.length > 0){
        nonNums.push({type:"Anteater:Expression_Error",count:badExpr.length, data:badExpr});
    }
    return nonNums;
}

plot_table = {
    "b":{
        "plot":plot_types.b,
        "b":{
            "plot":plot_types.b,
            "b":{
                "plot":plot_types.pc
            },
            "q":{
                "plot":plot_types.s
            },
            "s":{
                "plot":plot_types.s
            }
        },
        "q":{
            "plot":plot_types.h,
            "q":{
                "plot":plot_types.s
            },
            "s":{
                "plot":plot_types.s
            }
        },
        "s":{
            "plot":plot_types.b,
            "s":{
                "plot":plot_types.s
            }
        }
    },
    "q":{ "plot":plot_types.h,
            "multiple":false,
            "q":{
                "plot":plot_types.s,
                "q":{
                    "plot" : plot_types.pc
                },
                "s":{
                    "plot" : plot_types.pc

                }
            },
           "s":{
                "plot" : plot_types.s,

                "s":{
                    "plot" : plot_types.pc
                }
           },

    },
    "s":{"plot":plot_types.b,
           "s":{
                "plot" : plot_types.s,

                "s":{
                    "plot" : plot_types.pc
                }
           }
    }

}
