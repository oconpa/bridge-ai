import * as cdk from "aws-cdk-lib";

import { Authentication } from "./Authentication/Authentication";
import { Storage } from "./Storage/Storage";

import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /********************************************************************/
    /***************************** Storage ******************************/
    /********************************************************************/

    const storageStack = new Storage(this, "Storage");

    /********************************************************************/
    /************************* Authentication ***************************/
    /********************************************************************/

    const authStack = new Authentication(this, "Authentication", {
      uiStorageBucket: storageStack.uiStorageBucket,
    });

    /********************************************************************/
    /***************************** Outputs ******************************/
    /********************************************************************/

    new cdk.CfnOutput(this, "VITE_USERPOOLID", {
      value: authStack.userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "VITE_USERPOOLCLIENTID", {
      value: authStack.userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "VITE_IDENTITYPOOLID", {
      value: authStack.identityPool.identityPoolId,
    });
    new cdk.CfnOutput(this, "VITE_REGION", {
      value: this.region,
    });
    new cdk.CfnOutput(this, "VITE_UISTORAGEBUCKET", {
      value: storageStack.uiStorageBucket.bucketName,
    });
  }
}
