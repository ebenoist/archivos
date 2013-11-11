require "archivos/api/models/media"

module Archivos
  class S3UploadWorker
    include Sidekiq::Worker

    BUCKET_NAME = "primeproductions".freeze

    def perform(job)
      id = job["id"]
      order_code = job["order_code"]
      file = job["file"]
      file_name = job["file_name"]

      bucket = connection.buckets.create(BUCKET_NAME)

      file = Pathname.new(file)
      object = bucket.create("#{order_code}_#{file_name}", file)

      debugger
      media = Media.find(id)
      media.update_attributes({ public_uri: object.public_uri.to_s })
    end

    def connection
      @connection ||= AWS::S3.new(aws_credentials)
    end

    def aws_credentials
      @aws_credentials ||= YAML.load_file(Archivos.root + "/config/aws.yml")
    end
  end
end

