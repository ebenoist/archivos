#encoding: utf-8

require "archivos/api"
require "archivos/api/models/media"

def app
  Archivos::API
end

def fixture(name)
  Archivos.root + "/spec/fixtures/#{name}"
end

module Archivos
  describe "Archivos API" do
    it "should create a new media object" do
      order_code = UUID.generate
      mime_type = "image/jpg"
      file_one = Rack::Test::UploadedFile.new(fixture("image_one.jpg"), mime_type)
      file_two = Rack::Test::UploadedFile.new(fixture("image_two.jpg"), mime_type)

      post "/v1/media", { order_code: order_code, files: [file_one, file_two] }

      media_one = Media.where({ file_name: "image_one.jpg", order_code: order_code, mime: mime_type }).first
      media_two = Media.where({ file_name: "image_two.jpg", order_code: order_code, mime: mime_type }).first

      expect(media_one).to_not be_nil
      expect(media_two).to_not be_nil
    end

    it "kicks off a background process to upload to s3" do
      order_code = UUID.generate
      file = Rack::Test::UploadedFile.new(fixture("image_two.jpg"), "image/jpg")
      post "/v1/media", { order_code: order_code, files: [file] }

      fixture_contents = File.open(fixture("image_two.jpg"), "rb") { |io| io.read }

      media = Media.create!
      Media.stub(:create).with(hash_including({ order_code: order_code })).and_return(media)

      S3UploadWorker.should_receive(:perform_async).with do |file|
        expect(file[:id]).to eq(media.id.to_s)
        expect(file[:file_name]).to eq("image_two.jpg")
        expect(file[:order_code]).to eq(order_code)

        file_contents = File.open(file[:file], "rb") { |io| io.read }
        expect(file_contents).to eq(fixture_contents)
      end

      post "/v1/media", { order_code: order_code, files: [file] }
    end
  end
end

