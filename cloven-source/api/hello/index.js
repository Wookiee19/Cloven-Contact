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
  const params = {
    TableName: table,
    Item: {
        id: uuid(),
        Email: "usessr1123@g.c",
        name:"abcs12",
        message:"hello",
        createdAt: new Date().toDateString,
        updatedAt:  new Date().toDateString
    }
  };
  const result = await docClient.put(params).promise();
  console.log(result);
}

exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  await run(event);
  return context.logStreamName
}