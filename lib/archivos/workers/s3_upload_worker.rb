require "archivos/models/archivo"
require "archivos/s3_client"

class S3UploadWorker
  include Sidekiq::Worker

  def perform(job)
    object = S3Client.upload_file!(job["file"], calculate_file_name(job))

    archivo = Archivo.find(job["id"])
    archivo.update_attributes({ public_uri: object.public_url.to_s })
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

