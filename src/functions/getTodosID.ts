import { APIGatewayProxyHandler } from "aws-lambda";
// import AWS from "aws-sdk";
import { document } from "../utils/dynamodbClient";

interface IUserCertificate {
  id: string;
  title: string;
  deadline: string;
  done: string;
  created_at: string;
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
        title: userCertificate.title,
        deadline: userCertificate.deadline,
        done: userCertificate.done,
        created_at: userCertificate.created_at,
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