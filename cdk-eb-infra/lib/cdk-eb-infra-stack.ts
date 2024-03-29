import s3assets = require("@aws-cdk/aws-s3-assets");
import elasticbeanstalk = require("@aws-cdk/aws-elasticbeanstalk");
import iam = require("@aws-cdk/aws-iam");
import * as cdk from "@aws-cdk/core";
// import * as sqs from '@aws-cdk/aws-sqs';

export class CdkEbInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const webAppZipArchive = new s3assets.Asset(this, "WebAppZip", {
      path: `${__dirname}/../app.zip`,
    });
    // Create a ElasticBeanstalk app
    const appName = "MyWebApp";
    const app = new elasticbeanstalk.CfnApplication(this, "Application", {
      applicationName: appName,
    });
    // Create an app version from the s3 asset defined earlier
    const appVersionProps = new elasticbeanstalk.CfnApplicationVersion(
      this,
      "AppVersion",
      {
        applicationName: appName,
        sourceBundle: {
          s3Bucket: webAppZipArchive.s3BucketName,
          s3Key: webAppZipArchive.s3ObjectKey,
        },
      }
    );
    // Make sure that Elastic Beanstalk app exists before creating the app version
    appVersionProps.addDependsOn(app);
    const myRole = iam.Role.fromRoleArn(
      this,
      "LabRole",
      "arn:aws:iam::!!putrecenthere!!:role/LabRole",
      {
        // Set the mutable property to false to prevent the CDK from modifying the role
        mutable: false,
      }
    );

    const myProfileName = `${appName}-InstanceProfile`;

    const myInstanceProfile = new iam.CfnInstanceProfile(this, myProfileName, {
      instanceProfileName: myProfileName,
      roles: [myRole.roleName],
    });

    // Example of some options which can be configured
    const optionSettingProperties: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] =
      [
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "IamInstanceProfile",
          value: myProfileName,
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MinSize",
          value: "1",
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MaxSize",
          value: "1",
        },
        {
          namespace: "aws:ec2:instances",
          optionName: "InstanceTypes",
          value: "t2.micro",
        },
      ];

    // Create an ElasticBeanstalk environment
    const elbEnv = new elasticbeanstalk.CfnEnvironment(this, "Environment", {
      environmentName: "MyWebAppEnvironment",
      applicationName: app.applicationName || appName,
      solutionStackName: "64bit Amazon Linux 2 v5.8.0 running Node.js 18",
      optionSettings: optionSettingProperties,
      versionLabel: appVersionProps.ref,
    });
  }
}
