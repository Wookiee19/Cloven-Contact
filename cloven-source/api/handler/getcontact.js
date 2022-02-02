
'use strict'

var AWS = require('aws-sdk');
let awsConfig = {
    "region": "ap-south-1",
    "endpoint": "https://dynamodb.ap-south-1.amazonaws.com",
    "accessKeyId": "AKIA6AP3LOSFWBS7ZOLA", "secretAccessKey": "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"
};
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getcontact = (event, context, callback) => {

    const params = {
        TableName: 'cloven_contact',
        Key: {
            id: event.pathParameters.id
        }
    };

    dynamoDb.get(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = data.Item ? {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        }: {
            statusCode: 404,
            body: JSON.stringify({ "message" : 'Task not found' })
        };

        callback(null, response);
    });
}