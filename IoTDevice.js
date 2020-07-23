const mqtt = require('mqtt')
// const toBuffer = require('typedarray-to-buffer')
// const { exit } = require('process')
const client = mqtt.connect('tcp://52.237.77.5:1883',{'username':'admin','password':'public'})
const sampleData=
  [
    {   "device_id": "id2",
      "values": ["3"]
    }
  ]
client.on('connect', () => {
  client.subscribe('Topicsensor')
  publishData(sampleData)
})

client.on('message', (topic, message) => {
  const info=JSON.parse(message.toString())[0]
  console.log(info)
  if(info.values == "1"){
    console.log("device "+info.device_id+": on")
  }
  else{
    console.log("device "+info.device_id+": off")
  }
})


function publishData(data){
  console.log(sampleData)
  client.publish('Sensor',JSON.stringify(data))
}
