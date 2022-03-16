import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const env = config.require("env");

const referrerProjectName = config.require("core-project-name");
const referrerOrganizationName = config.require("core-org");
const referrerStageName = config.require("core-stack");

const coreInfrastructureReference = new pulumi.StackReference(`${referrerOrganizationName}/${referrerProjectName}/${referrerStageName}`);
export const noteTable = coreInfrastructureReference.requireOutput("notesTableName"); // notesTableName is the value exported from core-infrastructure

