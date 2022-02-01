'use strict'

const serverless = require('serverless-http');
var AWS = require('aws-sdk');
var NodeMailler = require('nodemailer');
let awsConfig = {
    "region": "ap-south-1",
    "endpoint": "https://dynamodb.ap-south-1.amazonaws.com",
    "accessKeyId": "AKIA6AP3LOSFWBS7ZOLA", "secretAccessKey": "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"
};

let mailTransporter = NodeMailler.createTransport({
    service: 'gmail',
    auth: {
        user: 'sambuddha@cloven.works',
        pass: 'fwvcyutezrucozpi'
    }
});

const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createcontact = (event, context, callback) => {

    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if( typeof data.task !== 'string' ) {
        console.error('Task is not a string');
        const response = {
            statusCode: 400,
            body: JSON.stringify({ "message":"Task is not a string." })
        }

        return;
    }

    const params = {
        TableName: 'cloven_contact',
        Item: {
            id: uuid.v1(),
            email=data.email,
            message=data.message,
            task: data.task,
            done: false,
            createdAt: datetime,
            updatedAt: datetime
        }
    };

    dynamoDb.put(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 201,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    });

    let mailDetails = {
        from: 'sambuddha@cloven.works',
        to: 'sambuddha.chaudhuri20@gmail.com',
        subject: 'Test mail',
        text: 'Node.js testing mail for GeeksforGeeks'
    };
      
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}