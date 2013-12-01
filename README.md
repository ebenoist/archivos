Archivos
========
### Async S3 File Uploader
Archivos provides a simple way to upload files to s3 while managing meta data in a local data store.
Files are uploaded to the primary server which fires off a series of concurrent background tasks that handle the upload to Amazon's S3.

Provided is a simple UI, but an API allows for access via any client over HTTP.

### Requirements
* Ruby >= 1.9.3
* Redis
* Bundler

### Todo
1. Transition to Postgres.
2. Lots of cleaning.
3. Startup scripts / process management.
4. Deployment.
5. Documentation / examples.
6. Port to Elixir?

If this application is deployed to an EC2 instance, the cost to shuffle the data from this instance to S3 is greatly discounted.

