import * as cdk from "aws-cdk-lib";

import * as s3 from "aws-cdk-lib/aws-s3";

import { Construct } from "constructs";

export class Storage extends Construct {
  readonly uiStorageBucket: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const uniqueHash = cdk.Names.uniqueId(this).slice(-8).toLowerCase();

    this.uiStorageBucket = new s3.Bucket(this, "UI Storage", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: `${uniqueHash}-ui-storage`,
      autoDeleteObjects: true,
      enforceSSL: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.HEAD,
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          exposedHeaders: [
            "last-modified",
            "content-type",
            "content-length",
            "etag",
            "x-amz-version-id",
            "x-amz-request-id",
            "x-amz-id-2",
            "x-amz-cf-id",
            "x-amz-storage-class",
            "date",
            "access-control-expose-headers",
          ],
        },
      ],
    });
  }
}
