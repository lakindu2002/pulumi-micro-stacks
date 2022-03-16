import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as notes from './notes/lambdas';

const config = new pulumi.Config();
const env = config.require("env");

const apiGateway = new awsx.apigateway.API(`${env}-api-gateway`, {
    routes: [
        {
            path: '/notes/create',
            method: 'POST',
            eventHandler: notes.createNote,
        },
        {
            path: '/notes/delete',
            method: 'POST',
            eventHandler: notes.deleteNote,
        },
        {
            path: '/notes',
            method: 'GET',
            eventHandler: notes.getAllNotes,
        }
    ],
    restApiArgs: {
        binaryMediaTypes: []
    }
});

export const { url } = apiGateway;