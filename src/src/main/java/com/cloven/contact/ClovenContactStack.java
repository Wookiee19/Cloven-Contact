package com.cloven.contact;

import java.util.HashMap;

import com.amazonaws.regions.Regions;

import software.amazon.awscdk.core.CfnOutput;
import software.amazon.awscdk.core.Construct;
import software.amazon.awscdk.core.Duration;
import software.amazon.awscdk.core.RemovalPolicy;
import software.amazon.awscdk.core.Stack;
import software.amazon.awscdk.core.StackProps;
import software.amazon.awscdk.services.apigateway.LambdaIntegration;
import software.amazon.awscdk.services.apigateway.Method;
import software.amazon.awscdk.services.apigateway.Resource;
import software.amazon.awscdk.services.apigateway.RestApi;
import software.amazon.awscdk.services.dynamodb.Table;
import software.amazon.awscdk.services.dynamodb.TableProps;
import software.amazon.awscdk.services.lambda.Code;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.Runtime;

public class ClovenContactStack extends Stack {
	public ClovenContactStack(final Construct scope, final String id) {
		this(scope, id, null);
	}

	public ClovenContactStack(final Construct scope, final String id, final StackProps props) {
		super(scope, id, props);
		String tableName = "cloven-contact";

		// Create a DynamoDB Table
		TableProps tableProps = TableProps.builder().readCapacity(1).writeCapacity(1)
				.removalPolicy(RemovalPolicy.RETAIN).tableName(tableName).build();
		Table clovenContactTable = new Table(this, tableName, tableProps);

		// Lambda Environment Variables to pass to the Lambdas
		HashMap<String, String> env = new HashMap<String, String>();
		env.put("REGION", "" + Regions.AP_SOUTH_1);
		env.put("ENVIRONMENT", "cloven");
		env.put("CLOVENCONTACTDYNAMOTABLE", clovenContactTable.getTableName());

		// Lambda setup
		Function simpleLambdaFunction = Function.Builder.create(this, "clovenContactLambda")
				.runtime(Runtime.NODEJS_12_X).functionName("clovenContactLambda").timeout(Duration.seconds(180))
				.memorySize(512).environment(env).code(Code.fromAsset("/api/")).handler("").build();

		// API Gateway Configuration (Allowing Lambdas to be called via the API Gateway
		RestApi api = RestApi.Builder.create(this, "Node JS").restApiName("/contact")
				.description("Cloven Contact API Gateway").build();

		LambdaIntegration simpleGatewayIntegration = LambdaIntegration.Builder.create(simpleLambdaFunction)
				.requestTemplates(new HashMap<String, String>() {
					{
						put("application/json", "{ \"statusCode\": \"200\" }");
					}
				}).build();

		Resource helloResource = api.getRoot().addResource("simple");
		Method simpleMethod = helloResource.addMethod("POST", simpleGatewayIntegration);
		String urlPrefix = api.getUrl().substring(0, api.getUrl().length() - 1);

		CfnOutput.Builder.create(this, "ZD Simple Lambda").description("")
				.value("Simple Lambda:" + urlPrefix + simpleMethod.getResource().getPath()).build();
	}
}
