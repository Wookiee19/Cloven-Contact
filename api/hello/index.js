const AWS = require("aws-sdk");
const uuid = require("uuid/v4");

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: "AKIA6AP3LOSFSPF4EMAZ",
  secretAccessKey: "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"
});

const table = "cloven-contact";
const docClient = new AWS.DynamoDB.DocumentClient();

async function run() {
  const params = {
    TableName: table,
    Item: {
      Email: "usessr1@g.c",
      name:"abcs",
      id: uuid(),
      data: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        
        message:"hello"
      }
    }
  };
  const result = await docClient.put(params).promise();
  console.log(result);

}

run();