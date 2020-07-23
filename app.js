var express = require('express');
const bodyParser  = require('body-parser');
var connectBD = require('./connection');
const cookieParser = require('cookie-parser');
const mqtt = require('mqtt')
// const client = mqtt.connect('tcp://13.76.250.158:1883',{'username':'BK_vm2','password':'Hcmut_CSE_2020'})
const client = mqtt.connect('tcp://52.237.77.5:1883',{'username':'admin','password':'public'})
const url = "mongodb://PentaT:PentaT@52.237.77.5:27017/PentaT";
const MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.get('/api/hello', (req, res) => {
  res.send({ express: 'met vl' });
});
app.post('/api/world', async (req, res) =>{
  db = await (await connectBD.db()).collection("user");
  dbsend = await db.find({}).toArray();
  res.send(dbsend);
})

app.post('/getmotor', async (req, res) =>{
  db = await connectBD.db();
  dbsend =  await db.collection("area").find({areaID: req.body['areaID']}).toArray();
  res.send(dbsend)
})

app.post('/getsensor', async (req, res) =>{
  db = await connectBD.db();
  area =  await db.collection("area").find({areaID: req.body['areaID']}).toArray(async function(err, result){
    dbsend = await db.collection("sensor").find({sensorID: {$in: result[0]['sensor']["sensorIDs"]}}).toArray();
    res.send(dbsend);
  })
})

app.post('/getarea', async (req, res) =>{
  db = await connectBD.db();
  area =  await db.collection("user").find({userID: req.body['username']}).toArray(async function(err, result){
    dbsend = await db.collection("area").find({areaID: {$in: result[0]["areaIDs"]}}).toArray();
    res.send(dbsend);
  })
})

app.post('/gettheshold', async (req, res) =>{
  db = await connectBD.db();
  area =  await db.collection("area").find({areaID: req.body['areaID']}).toArray(async function(err, result){
    res.send(result);
  })
})

app.post('/api/area', async (req, res) =>{
  db = await (await connectBD.db()).collection("area");
  dbsend = await db.find({}).toArray();
  res.send(dbsend);
})

app.post('/api/sensor', async (req, res) =>{
  db = await (await connectBD.db()).collection("sensor")
  dbsend = await db.find({}).toArray();
  res.send(dbsend)
})

app.post('/login', async (req, res) =>{
  username = req.body['username']
  password = req.body['password']
  // console.log(req.body)
  db = await (await connectBD.db()).collection("user")
  logincheck = await db.find({ userID: username}).toArray()
  // console.log("logincheck: ", logincheck)
  // console.log(logincheck[0]['password'], password)
  if (logincheck[0]['password'] == password)
  {
    res.send({check: true})
  }
  else
  {
    res.send({check: false})
  }
    // res.send({check: true})
})

app.post('/getmoisture', async (req, res) =>{
  sensorID = req.body['sensorID']
  db = await (await connectBD.db()).collection("sensor")
  dbsend = await db.find({sensorID: sensorID}).toArray();
  res.send(dbsend)
})


app.post('/updateTheshold', async (req, res) =>{
  updateThreshold(req.body['areaID'],parseInt(req.body['threshold'],10))
  res.send()
})

app.post('/updatePower', async (req, res) =>{
  db = await (await connectBD.db()).collection("area")
  await db.updateOne({areaID: req.body['areaID']}, {$set:{'device.status': req.body['status'], 'device.power': parseInt(req.body['power'],10)}});
  await db.findOne({'areaID': req.body['areaID']}, (err, result) =>{
    result.device.deviceIDs.forEach((id) =>{
      client.publish("Device", JSON.stringify([{ "device_id": id, "values": req.body['status']?["1", parseInt(req.body['power'],10)]:["0",0]}]))
    })
  })
  res.send()
})

//These lines from 12 to 35 ís for auto update db and auto turn on devices when moisture is lower than threshold
client.on('connect', () => {
  client.subscribe("Sensor");
})
client.on('message',(topic, message) => {
  msg=JSON.parse(message.toString())[0]
  MongoClient.connect(url,function(err, mongoclient) {
          const db = mongoclient.db('PentaT')
          db.collection('area').find({'sensor.sensorIDs':msg.device_id}).toArray((err,area)=>{
              db.collection('sensor').find({sensorID:msg.device_id}).toArray((err,sensor)=>{
                  //Calculate average
                  area=area[0]
                  sensor=sensor[0]
                  // const average=area.moisture+(msg.values[0]-sensor.current)/area.sensor.sensorIDs.length
                  const average=parseInt(msg.values[0])
                  //Update db area
                  db.collection('area').updateOne({'sensor.sensorIDs':msg.device_id},{$set:{moisture:average}})
                  //Update db sensor
                  db.collection('sensor').updateOne({sensorID:msg.device_id},{$push:{moisture:{status:"ON",value:parseInt(msg.values[0]),time:new Date()}},$set:{current:parseInt(msg.values[0])}})
                  const threshold=area.sensor.threshold
                  //Turn the devices on if average value collected from sensors is lower than threshold
                  if(average<=threshold && area.device.status==false){
                      db.collection('area').updateOne({areaID:area.areaID},{$set:{"device.status":true}})
                      area.device.deviceIDs.forEach((deviceID,index)=>{
                          client.publish("Device", JSON.stringify([{ "device_id": deviceID, "values": ["1",area.device.power] }]))
                      })
                  }
                  //Turn the devices off if average value collected from sensors is higher than threshold
                  else if(average>threshold && area.device.status==true){
                      db.collection('area').updateOne({areaID:area.areaID},{$set:{"device.status":false}})
                      area.device.deviceIDs.forEach((deviceID,index)=>{
                          client.publish("Device", JSON.stringify([{ "device_id": deviceID, "values": ["0",0] }]))
                      })
                  }
                  mongoclient.close()
              })
          })
    })
})

//These line from 39 to 60 is to update threshold
function updateThreshold(query_area,new_threshold){
  MongoClient.connect(url, function(err, mongoclient) {
      const db = mongoclient.db('PentaT')
      //Update threshold
      db.collection('area').updateOne({areaID:query_area},{$set:{'sensor.threshold':new_threshold}})
      //Check threshold
      db.collection('area').findOne({'areaID':query_area},(err,area)=>{
          const average=area.moisture
          const threshold=area.sensor.threshold
          // console.log(average, threshold, area.device.status)
          //Turn the devices on if average value collected from sensors is lower than threshold
          if(average<=threshold && area.device.status==false){
              db.collection('area').updateOne({areaID:area.areaID},{$set:{"device.status":true}})
              area.device.deviceIDs.forEach((deviceID,index)=>{
                  client.publish("Device", JSON.stringify([{ "device_id": deviceID, "values": ["1",area.device.power] }]))
              })
          }
          //Turn the devices off if average value collected from sensors is higher than threshold
          else if(average>threshold && area.device.status==true){
              db.collection('area').updateOne({areaID:area.areaID},{$set:{"device.status":false}})
              area.device.deviceIDs.forEach((deviceID,index)=>{
                  client.publish("Device", JSON.stringify([{ "device_id": deviceID, "values": ["0","0"] }]))
              })
          }
          mongoclient.close()    
      })
  })
}
// updateThreshold('a03',30)
//These line from 63 to 73 is to update power level of device
// function updatePower(query_area,new_power){
//   MongoClient.connect(url, function(err, mongoclient) {
//       const db = mongoclient.db('PentaT')
//       db.collection('area').updateOne({'areaID':query_area},{$set:{'device.power':new_power}})
//       mongoclient.close()
//     })
// }
// updatePower('a03',1)

app.listen(process.env.PORT || 5000, () =>{
 console.log(`Listen on post`)
});

module.exports = app;
