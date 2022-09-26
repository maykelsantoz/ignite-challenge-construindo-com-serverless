import { APIGatewayProxyHandler } from "aws-lambda";
// import AWS from "aws-sdk";
import { document } from "../utils/dynamodbClient";

interface IUserCertificate {
  id: string;
  name: string;
  username: string;
  todos: string[];
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }).promise();

  const userCertificate = response.Items[0] as IUserCertificate;

  if (userCertificate) {
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: userCertificate.id,
        name: userCertificate.name,
        username: userCertificate.username,
        todos: userCertificate.todos,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Dados invalidos",
    }),
  };
};