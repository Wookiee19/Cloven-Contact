const AWS = require("aws-sdk");
const uuid = require("uuid/v4");

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: "AKIA6AP3LOSFSPF4EMAZ",
  secretAccessKey: "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"
});

const table = "cloven-contact";
const docClient = new AWS.DynamoDB.DocumentClient();

async function run(event) {
  let requestJSON = JSON.parse(event.body);
  const params = {
    TableName: table,
    Item: {
        id: uuid(),
        Email: requestJSON.email,
        name:requestJSON.name,
        message:requestJSON.message,
        createdAt: new Date()
        
    }
  };
  const result = await docClient.put(params).promise();
  console.log(result);
}

exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
 
  await run(event);

  const response = {
    "statusCode": 200,
    "body": JSON.stringify(event),
    "isBase64Encoded": false
  };
  return response;
}