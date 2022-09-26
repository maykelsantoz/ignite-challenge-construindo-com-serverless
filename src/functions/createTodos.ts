import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid'
// import AWS from "aws-sdk";
import { document } from "../utils/dynamodbClient";

interface ICreateCertificate {
  id: string;
  title: string;
  deadline: string;
  done: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title, deadline, done } = JSON.parse(event.body) as ICreateCertificate
  const id = String(uuidv4())

  const date = new Date()

  await document.put({
    TableName: "users",
    Item: {
      id,
      title,
      deadline,
      done,
      created_at: new Intl.DateTimeFormat('pt-BR').format(date),
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