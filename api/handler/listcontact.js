
'use strict'

var AWS = require('aws-sdk');
let awsConfig = {
    "region": "ap-south-1",
    "endpoint": "https://dynamodb.ap-south-1.amazonaws.com",
    "accessKeyId": "AKIA6AP3LOSFWBS7ZOLA", "secretAccessKey": "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"
};
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.listcontact = (event, context, callback) => {

    const params = {
        TableName: 'cloven_contact'
    };

    dynamoDb.scan(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };

        callback(null, response);
    });
}