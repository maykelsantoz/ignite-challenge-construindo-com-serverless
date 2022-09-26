import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'ignite-construindo-com-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: {
    createUser: {
      handler: "src/functions/createUser.handler",
      events: [
        {
          http: {
            path: "createUser",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    createTodos: {
      handler: "src/functions/createTodos.handler",
      events: [
        {
          http: {
            path: "createTodos",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    getUserID: {
      handler: "src/functions/getUserID.handler",
      events: [
        {
          http: {
            path: "getUserID/{id}",
            method: "get",
            cors: true,
          },
        },
      ],
    },
    getTodosID: {
      handler: "src/functions/getTodosID.handler",
      events: [
        {
          http: {
            path: "getTodosID/{id}",
            method: "get",
            cors: true,
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      dbServerlessConceitos: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "users",
          AttributeDefinitions: [
            {
              "AttributeName": "id",
              "AttributeType": "S",
            }
          ],
          KeySchema: [
            {
              "AttributeName": "id",
              "KeyType": "HASH",
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
    }
  }
};

module.exports = serverlessConfiguration;
