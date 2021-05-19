function load_python(){
  pythonCode = `
    def do_work2(*args):
        import astor
        print("done")

    import micropip
    micropip.install('astor').then(do_work2)
    `
  languagePluginLoader.then(() => {
    return pyodide.loadPackage(['micropip','numpy'])
  }).then(()=> {return pyodide.runPython(pythonCode)}).then(() => {
    pyodide.runPython(rewriteHelpers)
    pyodide.runPython("rewrite_helpers()")

    pythonCode3 = "f=open(\"testProg.py\", \"w\")\nf.write(\"def test(){\\n    iters = 5\\n    val = 6\\n    output = 1\\n    for iter in range(iters){\\n        output /= val\\n\\nif __name__==\\\"__main__\\\":\\n    test()\\n\")\nf.close()"
    pyodide.runPython(pythonCode3);

  })
}

function check_source(source,fname){
  var retVal = true
  pyodide.runPythonAsync(source)
  .then(output => write_source_file(source,fname))
  .catch((err) => { c = confirm("Warning: Your program has encountered the Python error shown below. If you continue with the trace, you may encounter a subsequent error with Anteater. Do you wish to continue?\n"+err)
    if(c == true){
      write_source_file(source,fname)
    }
    else{
      retVal = false
    }
  });
  return retVal

}

function write_source_file(source, fname){
  lines = source.split("\n")
  var textStr = ""
  lines.forEach(function(line,i){
    textStr+=line
    if (i<lines.length-1){
      textStr+="\\n"
    }
  })

  pythonCode3 = "f=open(\""+fname+"\", \"w\")\nf.write("+JSON.stringify(source)+")\nf.close()"
  pyodide.runPython(pythonCode3);
}

function run_trace(fname,varStr, exprStr, funcExclStr, libExclStr){
  if (varStr.length > 0){
    variables = JSON.parse(varStr)
  }
  else{
    variables = []
  }

  if (exprStr.length > 0){
    expressions = JSON.parse(exprStr)
  }
  else{
    expressions = []
  }

  if (funcExclStr.length > 0){
    funcExclusions = JSON.parse(funcExclStr)
  }
  else{
    funcExclusions = []
  }

  if (libExclStr.length > 0){
    libExclusions = JSON.parse(libExclStr)
  }
  else{
    libExclusions = []
  }
  error = ""
  if (variables.length == 0 && expressions.length == 0){
    error = "Please select at least one value to track."
  }

  source = sessionStorage.getItem("curSource")

  verion = get_max_vers()+1;
  if(currentVersion == undefined){
    version = 0;
  }
  fname = fname.substring(0,fname.lastIndexOf(".py"))+"_"+version+".py"
  tname = fname.substring(0,fname.lastIndexOf(".py"))
  // var cont = check_source(source, fname)

  var cont = true
  pyodide.runPythonAsync(source)
  .then((output) => {write_source_file(source,fname);
    tracer(error, cont, fname, variables, expressions, funcExclusions, libExclusions, tname,version,varStr, exprStr, funcExclStr, libExclStr);
  })
  .catch((err) => { c = confirm("Warning: Your program has encountered the Python error shown below. If you continue with the trace, you may encounter a subsequent error with Anteater. Do you wish to continue?\n"+err)
    console.log(err)
    if(c == true){
      // write_source_file(source,fname);
      // trace(error, cont, fname, variables, expressions, funcExclusions, libExclusions, tname,version,varStr, exprStr, funcExclStr, libExclStr);
    }
    else{
      retVal = false
    }
  });




}
function tracer(error, cont, fname, variables, expressions, funcExclusions, libExclusions, tname,version,varStr, exprStr, funcExclStr, libExclStr){
  if (error == "" && cont){

    tracerCode+='\ntrace, funcInfo, dependencies, output, loopInfo = runTrace(\"'+fname+'\", '+JSON.stringify(variables)+', '+JSON.stringify(expressions)+','+JSON.stringify(funcExclusions)+','+JSON.stringify(libExclusions)+', None, "'+tname+'")'//'\nf=open(\"'+tname+'.trace\", \"r\")\ntext = f.read()\nf.close()\nprint(text)'
    pyodide.runPython(tracerCode)
    var traceFile = pyodide.pyimport("trace")
    // var version = get_max_vers()+1
    add_trace(fname, traceFile, varStr, exprStr, funcExclStr, libExclStr, version)
    var funcInfo = pyodide.pyimport("funcInfo")
    var depends = pyodide.pyimport("dependencies")
    var loopInfo = pyodide.pyimport("loopInfo")
    sessionStorage.setItem("funcInfo", JSON.stringify(funcInfo))
    sessionStorage.setItem("dependencies", JSON.stringify(depends))
    sessionStorage.setItem("loopInfo", JSON.stringify(loopInfo))
    currentVersion = version;
    sessionStorage.setItem("currentVersion", currentVersion)
    switch_to_trace_vis()

  }
}

function load_trace(fname){
  pyodide.runPython("f = open('"+fname+"','r')\ntext = f.read()\nf.close()\n")
  trace = pyodide.pyimport("text")
  return trace;
}

function load_and_write_file(file){
  text = sessionStorage.getItem(file)
  write_source_file(text,file)
  return text
}
