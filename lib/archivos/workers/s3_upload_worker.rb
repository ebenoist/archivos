require "archivos/api/models/media"
require "archivos/s3_client"

module Archivos
  class S3UploadWorker
    include Sidekiq::Worker

    def perform(job)
      object = S3Client.upload_file!(job["file"], calculate_file_name(job))

      media = Media.find(job["id"])
      media.update_attributes({ public_uri: object.public_uri.to_s })
    end

    def calculate_file_name(job)
      "#{job["order_code"]}_#{job["file_name"]}"
    end

    def connection
      @connection ||= AWS::S3.new(aws_credentials)
    end

    def aws_credentials
      @aws_credentials ||= YAML.load_file(Archivos.root + "/config/aws.yml")
    end
  end
end

