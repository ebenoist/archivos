require "sinatra/base"
require "sinatra/namespace"
require "archivos/models/media"
require "archivos/models/order"
require "archivos/workers/s3_upload_worker"

class API < Sinatra::Base
  register Sinatra::Namespace

  namespace "/v1" do
    post "/media" do
      params["files"].each do |file|
        order_code = params["order_code"]
        file_name = file[:filename]
        file_type = file[:type]

        File.open("tmp/uploads/#{file_name}", "w") do |tmp|
          tmp.write(file[:tempfile].read)
        end

        media = Media.create!({ order_code: order_code, file_name: file_name, mime: file_type })

        S3UploadWorker.perform_async({
          id: media.id.to_s,
          file_name: file_name,
          order_code: order_code,
          file: "tmp/uploads/#{file_name}"
        })
      end

      request.accept.each do |type|
        halt 201 if type == "application/json"
        redirect "/?order_code=#{params["order_code"]}" # TODO: test
      end
    end

    get "/media" do
      if params["order_code"]
        Media.where({ order_code: params["order_code"] }).to_json
      else
        Media.all.to_json
      end
    end

    get "/media/:id" do
      Media.find(params["id"]).to_json
    end

    get "/order/:id" do
      order = Order.where({ order_code: params["id"] }).first
      halt 404 if order.nil?

      order.to_json
    end

  end
end

