import core from "@actions/core";
import { S3Client, AWSError } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import mime from "mime-types";

class EmptyError extends Error {}

const run = async () => {
  const artifact = core.getInput("artifact");
  const awsAccessKeyId = core.getInput("aws-access-key-id");
  const awsSecretAccessKey = core.getInput("aws-secret-access-key");
  const cacheControl = core.getInput("cache-control");
  const isPublic = core.getBooleanInput("public");
  const mandatory = core.getBooleanInput("mandatory");
  const path = core.getInput("path");
  const s3BucketName = core.getInput("s3-bucket-name", { required: true });
  const s3ObjectKey = core.getInput("s3-object-key", { required: true });

  const s3 = new S3Client({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  });

  /**
   * Returns the raw contents of the artifact.
   * @returns {Promise<string>}
   */
  const getArtifact = async () => {
    return artifact || (path && readFile(path));
  };

  await getArtifact()
    .then((contents) =>
      contents
        ? s3
            .putObject({
              ACL: isPublic ? "public-read" : undefined,
              Body: contents,
              Bucket: s3BucketName,
              CacheControl: cacheControl,
              ContentType: mime.lookup(s3ObjectKey),
              Key: s3ObjectKey,
            })
            .promise()
        : Promise.reject(new EmptyError())
    )
    .then(() => {
      core.info(`Artifact created using key ${s3ObjectKey}`);
      core.setOutput("success", "true");
    })
    .catch(
      /**
       * @param {AWSError | EmptyError | NodeJS.ErrnoException} error
       */
      (error) => {
        core.setOutput("success", "false");

        switch (true) {
          case error instanceof EmptyError:
            mandatory
              ? core.error(
                  "Artifact not created. No artifact contents were provided."
                )
              : core.notice(
                  "Skipping artifact creation. No artifact contents were provided."
                );
            break;
          case error.code === "ENOENT":
            mandatory
              ? core.error(`Artifact not created. File ${path} not found.`)
              : core.notice(
                  `Skipping artifact creation. File ${path} not found`
                );
            break;
          default:
            throw error;
        }
      }
    );
};

run();
