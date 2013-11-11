require "archivos/workers/s3_upload_worker"

module Archivos
  describe S3UploadWorker do
    before(:each) do
      Sidekiq::Testing.inline!

      S3UploadWorker.instance_variable_set(:@connection, nil)
      S3UploadWorker.instance_variable_set(:@aws_credentials, nil)

      @object = double(:object, { public_uri: URI("https://foo.com") })
      @bucket = double(:bucket, { create: @object })
      @buckets = double(:buckets, { create: @bucket })
      @fake_connection = double(:s3_connection, { buckets: @buckets })

      @file_fixture = Archivos.root + "/spec/fixtures/image_one.jpg"

      Media.stub(:find).and_return(Media.new)
      AWS::S3.stub(:new).and_return(@fake_connection)
    end

    it "uses a configured connection" do
      s3_config = { aws_access_key_id: "lsdkjf", aws_secret_access_key: "sldkfj" }
      YAML.stub(:load_file).and_return(s3_config)

      AWS::S3.should_receive(:new).with(s3_config)

      S3UploadWorker.perform_async({ order_code: "goo", file: @file_fixture })
    end

    it "creates a directory named for the order code" do
      @buckets.should_receive(:create).with(S3UploadWorker::BUCKET_NAME)

      S3UploadWorker.perform_async({ order_code: "foo", file: @file_fixture })
    end

    it "uploads the file to s3" do
      file_name = "image.jpg"
      order_code = "foo"

      @bucket.should_receive(:create).with(
        "#{order_code}_#{file_name}",
        Pathname.new(@file_fixture)
      )

      S3UploadWorker.perform_async({ order_code: order_code, file: @file_fixture, file_name: file_name })
    end

    # STUB HELL
    it "records the s3 url on the assosciated model" do
      Media.unstub(:find)

      media = Media.new
      media.save!
      debugger
      id = media.id.to_s

      public_uri = URI("https://primeproductions.aws/file.jpg")
      @bucket = double(:bucket, { create: object })

      S3UploadWorker.perform_async({ id: id, order_code: "foo", file: @file_fixture, file_name: "bar.jpg" })

      expect(media.reload.public_uri).to eq(public_uri.to_s)
    end
  end
end

