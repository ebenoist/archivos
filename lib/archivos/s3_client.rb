class S3Client
  class << self
    def upload_file!(file, file_name)
      bucket_name = aws_config[:bucket]

      bucket = connection.buckets[bucket_name]
      file = Pathname.new(file)

      s3_object = AWS::S3::S3Object.new(bucket, file_name)
      s3_object.write(file)
    end

    def connection
      AWS::S3.new(aws_config)
    end

    def aws_config
      YAML.load_file(Archivos.root + "/config/aws.yml")
    end
  end
end

