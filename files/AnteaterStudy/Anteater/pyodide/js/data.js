var currentVersion = null
var currentTrace = null
var programDB = new alasql.Database("programs")

function create_prog_db(){
  // programDB.exec("CREATE TABLE versions (vnum INT PRIMARY KEY NOT NULL, fname STRING NOT NULL)")
  programDB.exec("CREATE TABLE traces (version INT PRIMARY KEY NOT NULL, srcfname STRING NOT NULL, tracefname STRING NOT NULL, varstr STRING, exprStr STRING, funcExclStr STRING, libExclStr STRING)")
}

function clear_prog_db(){
  programDB.exec("DROP TABLE traces")
}

function get_max_vers(){
  return programDB.exec("SELECT MAX(vnum) as vers FROM traces").vers
}

function add_trace(fname,tname,varstr,exprstr, funcExclStr, libExclStr,version){
  // var nextVers = 1
  // if(currentVersion != null){
  //   nextVers = maxVers+1
  // }
  // programDB.exec("INSERT INTO versions VALUES ()" + nextVers + ", "+ + fname+ ")")
  programDB.exec("INSERT INTO traces VALUES("+version+",'"+fname + "','"+tname +"','" + varstr + "','"+exprstr + "','" + funcExclStr + "', '" + libExclStr+"')")
}

function get_trace(version){
  return programDB.exec("SELECT * FROM traces WHERE version="+version)
}
