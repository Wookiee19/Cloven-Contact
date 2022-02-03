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
  let createdDate = new Date(new Date()-3600*1000*3).toISOString();
  const params = {
    TableName: table,
    Item: {
        id: uuid(),
        Email: requestJSON.email,
        name:requestJSON.name,
        message:requestJSON.message,
        createdAt: createdDate
    }
  };
  const result = await docClient.put(params).promise();
  console.log(result);
}

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
}

exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
 
  await run(event);

  const response = {
    headers,
    "statusCode": 200,
    "body": JSON.stringify(event),
    "isBase64Encoded": false
  };
  return response;
}