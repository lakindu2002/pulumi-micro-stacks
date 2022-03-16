import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { noteTable } from "../resources";
import { nanoid } from 'nanoid';

const config = new pulumi.Config();
const env = config.require("env");

export const createNote = new aws.lambda.CallbackFunction(`${env}-create-note`, {
    callback: async (event: awsx.apigateway.Request, context): Promise<awsx.apigateway.Response> => {
        const documentClient = new aws.sdk.DynamoDB.DocumentClient();
        const { title, body } = JSON.parse(event.body as string);
        const noteId = nanoid();
        const note = {
            // hashkey as "id" as defined in core-infrastructure table.
            id: noteId,
            title,
            body,
        }

        await documentClient.put({
            TableName: noteTable.get(),
            Item: note,
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(note),
        }
    }
})

export const deleteNote = new aws.lambda.CallbackFunction(`${env}-delete-note`, {
    callback: async (event: awsx.apigateway.Request, context): Promise<awsx.apigateway.Response> => {
        const documentClient = new aws.sdk.DynamoDB.DocumentClient();
        const { id } = JSON.parse(event.body as string);

        await documentClient.delete({
            TableName: noteTable.get(),
            Key: { id },
        }).promise();

        return {
            statusCode: 200,
            body: 'Note deleted',
        }
    }
})

export const getAllNotes = new aws.lambda.CallbackFunction(`${env}-get-all-notes`, {
    callback: async (event: awsx.apigateway.Request, context): Promise<awsx.apigateway.Response> => {
        const documentClient = new aws.sdk.DynamoDB.DocumentClient();
        const { Items = [] } = await documentClient.scan({
            TableName: noteTable.get(),
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(Items),
        }
    }
})