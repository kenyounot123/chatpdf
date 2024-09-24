import { S3Client } from "@aws-sdk/client-s3";

// When no region or credentials are provided, the SDK will use the
// region and credentials from the local AWS config.
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// export const addFileToBucket = async (
//   file: File,
//   buffer: Buffer,
//   bucket: string | undefined
// ) => {
//   if (!bucket) {
//     return
//   }
//   const command = new PutObjectCommand({
//     Bucket: bucket,
//     Key: file.name,
//     Body: buffer,
//     ContentType: file.type,
//   });

//   await s3Client.send(command);
// };