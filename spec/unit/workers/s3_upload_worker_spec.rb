require "archivos/workers/s3_upload_worker"

describe S3UploadWorker do
  before(:each) do
    Sidekiq::Testing.inline!

    @archivo = Archivo.new
    @archivo.save!

    @file_fixture = Archivos.root + "/spec/fixtures/image_one.jpg"
    @job_description = { id: @archivo.id.to_s, order_code: "foo", file: @file_fixture, file_name: "bar.jpg" }

    @s3_object = double(:s3_object, { public_url: "foo.local/image.img" })
    S3Client.stub(:upload_file!).and_return(@s3_object)
  end

  it "uses the s3 client to upload the file in the job description" do
    file = Archivos.root + "/spec/fixtures/image_two.jpg"
    order_code = "order"
    file_name = "actual_file_name.jpg"

    @job_description[:file] = file
    @job_description[:order_code] = order_code
    @job_description[:file_name] = file_name

    expected_file_name = "#{order_code}_#{file_name}"
    S3Client.should_receive(:upload_file!).with(file, expected_file_name).and_return(@s3_object)

    S3UploadWorker.perform_async(@job_description)
  end

  it "adds the public uri to the archivo object after uploading" do
    uri = URI("http://amazonsupr.internet.com/my-pixs.jpg")
    s3_object = double(:s3_object, { public_url: uri })
    S3Client.stub(:upload_file!).and_return(s3_object)

    S3UploadWorker.perform_async(@job_description)

    @archivo.reload
    expect(@archivo.public_uri).to eq(uri.to_s)
  end
end

