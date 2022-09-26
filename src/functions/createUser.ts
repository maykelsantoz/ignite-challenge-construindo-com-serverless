import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid'
// import AWS from "aws-sdk";
import { document } from "../utils/dynamodbClient";

interface ICreateCertificate {
  id: string;
  name: string;
  username: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { name, username } = JSON.parse(event.body) as ICreateCertificate
  const id = String(uuidv4())

  await document.put({
    TableName: "users",
    Item: {
      id,
      name,
      username,
      todos: []
      //created_at: new Date().getTime(),
    },
  }).promise();

  const response = await document
    .query({
      TableName: "users",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};