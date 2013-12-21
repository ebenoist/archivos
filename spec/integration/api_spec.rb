#encoding: utf-8

require "archivos/api"
require "archivos/models/media"

def app
  API
end

def fixture(name)
  Archivos.root + "/spec/fixtures/#{name}"
end

describe "Archivos API" do
  context "POST" do
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
      Media.stub(:create!).with(hash_including({ order_code: order_code })).and_return(media)

      S3UploadWorker.should_receive(:perform_async).with do |file|
        expect(file[:id]).to eq(media.id.to_s)
        expect(file[:file_name]).to eq("image_two.jpg")
        expect(file[:order_code]).to eq(order_code)

        file_contents = File.open(file[:file], "rb") { |io| io.read }
        expect(file_contents).to eq(fixture_contents)
      end

      post "/v1/media", { order_code: order_code, files: [file] }
    end

    it "redirects to the index if accept is html" do
      header "Accept", "text/html"

      file = Rack::Test::UploadedFile.new(fixture("image_two.jpg"), "image/jpg")
      post "/v1/media", { order_code: "foo", files: [file] }
      follow_redirect!

      expect(last_request.url).to eq("http://example.org/")
    end
  end

  context "GET" do
    it "gets all the media" do
      media_one = Media.new({ file_name: "one.jpg" })
      media_two = Media.new({ file_name: "two.jpg" })

      media_one.save!
      media_two.save!

      get "/v1/media"

      expect(last_response.body).to eq([media_one, media_two].to_json)
    end

    it "only returns the medias that match the order code" do
      id = UUID.generate
      media_one = Media.new({ order_code: id, file_name: "one.jpg" })
      media_two = Media.new({ order_code: UUID.generate, file_name: "two.jpg" })

      media_one.save!
      media_two.save!

      get "/v1/media", { order_code: id }

      expect(last_response.body).to eq([media_one].to_json)
    end

    it "gets an individual record" do
      media_one = Media.new({ file_name: "one.jpg" })

      media_one.save!
      id = media_one.id.to_s

      get "/v1/media/#{id}"

      expect(last_response.body).to eq(media_one.to_json)
    end
  end

end

