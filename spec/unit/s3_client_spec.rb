require "archivos/s3_client"

describe S3Client do
  before(:each) do
    @fake_connection = double(:s3_connection, { buckets: {} })
    AWS::S3.stub(:new).and_return(@fake_connection)

    s3_object = double(:s3_object, write: nil)
    AWS::S3::S3Object.stub(:new).and_return(s3_object)

    @file_fixture = Archivos.root + "/spec/fixtures/image_one.jpg"
  end

  it "uses the configured connection" do
    s3_config = { aws_access_key_id: "lsdkjf", aws_secret_access_key: "sldkfj" }
    YAML.stub(:load_file).and_return(s3_config)

    AWS::S3.should_receive(:new).with(hash_including(s3_config))

    S3Client.upload_file!(@file_fixture, "foo")
  end

  it "uploads a file to the configured bucket" do
    bucket_name = "bucketname"
    s3_config = { bucket: bucket_name }
    YAML.stub(:load_file).and_return(s3_config)

    bucket = double(:bucket)
    buckets = double(:buckets)
    buckets.should_receive(:[]).with(bucket_name).and_return(bucket)
    @fake_connection.stub(:buckets).and_return(buckets)

    AWS::S3::S3Object.should_receive(:new).with(bucket, anything)

    S3Client.upload_file!(@file_fixture, "foo")
  end

  it "uploads the file to s3 with the correct name" do
    file_name = "orderabc_image.jpg"
    s3_object = double(:s3_object)
    file = Archivos.root + "/spec/fixtures/image_two.jpg"

    AWS::S3::S3Object.should_receive(:new).with(anything, file_name).and_return(s3_object)
    s3_object.should_receive(:write).with(Pathname.new(file)).and_return(s3_object)

    expect(S3Client.upload_file!(file, file_name)).to be(s3_object)
  end
end
