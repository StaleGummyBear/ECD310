const express = require('express');
const app = express();
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());


const sqlite3 = require('sqlite3').verbose();
const user_db = new sqlite3.Database('users_db');
const meter_db = new sqlite3.Database('meters_db');

if (process.platform === "win32") { //Handles keyboard interrupted exit
    var rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on("SIGINT", function () {
      process.emit("SIGINT");
    });
  }


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    console.log("Got a request for Hello World from: " + req.ip);
    res.json({yuh: "Hello World"});
});


{//Authenitcation
    app.get('/getUsers', (req, res) => {
        console.log("Got a request for user data")
        var data = new Array();

        user_db.each('SELECT * FROM users', (err, row) => {
            data.push(row);
        }, function(){
            res.json(data);
        })
    });
    app.post('/createAccount', (req, res) => {
        console.log("Create Account");
        console.log(req.url);
        console.log(req.body);

        var data = new Array();
        var usernameExists = false;
        if(req.body.username == ""){
            res.json({error: "Enter a username"});
        }else if(req.body.password == ""){
            res.json({error: "Enter a password"})
        }else{
            user_db.each('SELECT * FROM users', (err, row) => {
                if(row.username == req.body.username && usernameExists == false){
                    usernameExists = true;
                    console.log("USERNAME MATCH");
                }
            }, function(){
                if(usernameExists == true){
                    res.json({error: "Username already exists"});
                }else{
                    data = new Array();
                    user_db.run("INSERT INTO users(username, password, level) VALUES(?,?,?)",req.body.username, req.body.password, req.body.level);
                    user_db.each('SELECT * FROM users', (err, row) => {
                        data.push(row);
                    }, function(){
                        res.json(data);
                    })
                }

            })
        }
    });


    app.post('/login', (req, res)=>{
        console.log("Login");
        var data = new Array();
        var usernameExists = false;
        user_db.each('SELECT * FROM users', (err, row) => {
            if(row.username == req.body.username && usernameExists == false){
                usernameExists = true;
                console.log("USERNAME MATCH, checking password");
                if(row.password == req.body.password){
                    console.log(row);
                    data.push(row);
                }else{
                    res.json({error: "Incorrect Password"})
                }
            }
        }, function(){
            if(usernameExists == false){//Should not announce this since it confirms/denies usernames exist
                res.json({error: "Incorrect Username"})
            }else{
                res.json(data[0]);
            }
        });

    });
    app.get('/clearData', (req,res) => {
        console.log("Clear Data");
        user_db.run('DELETE FROM users');

        var data = new Array();
        user_db.each('SELECT * FROM users', (err, row) => {
            data.push(row);
        }, function(){
            res.json(data);
        });
    })
    app.post('/meterToUser', (req, res) => {
        console.log('Meter/User map update');
        user_db.run("CREATE TABLE IF NOT EXISTS meter_map(userID integer, meterID integer, longitude float, latitude float)");

        var data = new Array();
        console.log(req.body.userID);
        user_db.each("SELECT * FROM meter_map WHERE meterID=?", req.body.meterID, (err, row) => {
            data.push(row);
        }, function(){
            if(data.length === 1){
                user_db.run("UPDATE meter_map SET userID=?, longitude=?, latitude=? WHERE meterID=?", req.body.userID, req.body.longitude, req.body.latitude, req.body.meterID);
            }else{
                //insert new row
                user_db.run("INSERT INTO meter_map(userID, meterID, longitude, latitude) VALUES(?,?,?,?)", req.body.userID, req.body.meterID, req.body.longitude, req.body.latitude);
            }
            res.json({code: "SUCCESS"});
        })
    })
    app.post('/userToMeters', (req, res) => {
        console.log("Get meters from userID");
        var data = new Array();
        user_db.each("SELECT * FROM meter_map WHERE userID=?", req.body.userID, (err, row) => {
            data.push(row);
        }, function(){
            res.json(data);
        })
    })

    app.get('/getMeterMap', (req, res) => {
        console.log("Get Meter Map")
        var data = new Array();
        user_db.each('SELECT * FROM meter_map', (err, row) => {
            data.push(row);
        }, function(){
            res.json(data);
        });
    })

    app.get('/deleteMeterMappings', (req, res) => {
        console.log("Delete Meter Mappings")
        user_db.run("DELETE FROM meter_map");
    })

    app.get('/userCoords', (req, res) => {
        var data = new Array();
        user_db.each("SELECT * FROM meter_map WHERE userID=?", req.body.userID, (err, row) => {
            console.log(row);
            data.push({lat: row.latitude, lon: row.longitude});
        }, function(){
            res.json(data);
        })
    })


}

{//Meter Communication
app.post('/toggleSimMeter', (req, res) => {
    console.log("toggle sim meter");
    var data = new Array();
    meter_db.each("SELECT active FROM meters WHERE id=?", req.body.meter, (err, row) => {
        data.push(row);
    }, function(){
        if(data.length === 1){
            if(data[0].active == 'running'){
                meter_db.run("UPDATE meters SET active='stopped' WHERE id=?", req.body.meter);
            }else{
                meter_db.run("UPDATE meters SET active='running' WHERE id=?", req.body.meter);
            }
            res.send({result: "SUCCESS"});
        }else{
            res.send({result: "FAILED"});
        }
    });

});

// addPhysicalMeter TODO
app.post('/addPhysMeter', (req, res) => {
    meter_db.run("INSERT INTO meters(meterIP, active, phys) VALUES(?,'stopped', ?);", req.body.ip_address, req.body.phys);
    res.send({result: "SUCCESS"});
})

app.get('/getMeterList', (req, res) => {
    console.log("Got a request for meter data")
    var data = new Array();

    meter_db.each('SELECT * FROM meters', (err, row) => {
        data.push(row);
    }, function(){
        res.json(data);
    })
})

app.get('/deleteAllMeters', (req, res) => {
    console.log("Got request to delete meter data")
    meter_db.run("DELETE FROM meters");
    res.send({result: "SUCCESS"});
})

app.post('/getMeterData', (req, res) => {
    console.log("Request for data from Meter " + req.body.meter_id);
    const meterx_db = new sqlite3.Database('meter' + req.body.meter_id + '_db');
    console.log('meter' + req.body.meter_id + '_db');
    var data = new Array();
    meterx_db.each("SELECT * from data", (err, row) => {
        data.push(row);
    }, function(){
        res.json(data);
    })
})
app.post('/deleteMeterData', (req, res) => {
    console.log("Delete data for meter: " + req.body.meter_id);
    const meterx_db = new sqlite3.Database('meter' + req.body.meter_id + '_db');
    meterx_db.run('DELETE FROM data');
    res.send({result: "SUCCESS"});
})

}

//var sim_meter_proc;
process.on('SIGINT', function(){
    console.log("Custom Exit");
    /*
    sim_meter_proc.kill('SIGINT');
    */
    process.exit();
})


app.listen(3001, () => {
    console.log('Listening on port 3001')
});
