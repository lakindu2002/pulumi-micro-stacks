import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config(); // retrive the config information stored in the pulumi.STACK-NAME.yaml file
const env = config.require('env'); // retrieve the env variable from the config file

export const NotesTable = new aws.d