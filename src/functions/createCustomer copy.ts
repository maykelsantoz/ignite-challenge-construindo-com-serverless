// import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk"

export const createCustomer: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(Buffer.from(event.body, 'base64').toString());
  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  const putParams = {
    TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
    Item: {
      primary_key: body.name,
      email: body.email,
    },
  };
  await dynamoDB.put(putParams).promise();
  return {
    statusCode: 201,
  };
};