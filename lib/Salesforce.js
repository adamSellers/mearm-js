// This is to authenticate to Salesforce and listen to the platform event
// that sends the orders
var Salesforce = function() {
var nforce=require('nforce');
var meArm = require('./MeArmPi.js').MeArmPi;

var org = nforce.createConnection({
  clientId:'3MVG9d8..z.hDcPKQaDHE__kZa4XHASxeJQbJNGrHkdyPc8Wjx2n4H9s7Iab75qtmdBcjBhKDtV7ms0hI1VkN',
  clientSecret: '173895718220819331',
  redirectUri: 'http:/\/localhost:3000/oauth/_callback',
  mode: 'single'
});

org.authenticate({ username: 'asellers@gotoiot.demo', password:'Demo1234'}, function(err, oauth){
  //the oauth object is stored in the connection
  if(!err) console.log('Cached token: ' + org.oauth.access_token)

  //connect to the platform event
  console.log('connecting to platform event');
  var str = org.stream({ topic: 'Grabby__e', oauth: oauth, isEvent: true });

  str.on('connect', function() {
    console.log('connected to event source');
  });

  str.on('error', function(error) {
    console.log('error: ' + error);
  });

  str.on('data', function(data) {
    console.log('receiving data: ' + JSON.stringify(data));

    console.log('moving base to: ' + data.payload.Base_Position__c);
    //push data to MeArmPi moveBase function
    var armInstance = new meArm;   
    armInstance.moveBaseTo(data.Base_Position__c);

  });
});
}



exports.Salesforce = Salesforce;
