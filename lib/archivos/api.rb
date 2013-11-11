require "sinatra/base"
require "sinatra/namespace"
require "archivos/api/models/media"
require "archivos/workers/s3_upload_worker"

module Archivos
  class API < Sinatra::Base
    register Sinatra::Namespace

    namespace "/v1" do
      post "/media" do

        params["files"].map do |file|
          order_code = params["order_code"]
          file_name = file[:filename]
          file_type = file[:type]

          media = Media.create({ order_code: order_code, file_name: file_name, mime: file_type })
          S3UploadWorker.perform_async({
            id: media.id,
            file_name: file_name,
            order_code: order_code,
            file: file[:tempfile].path
          })

          media
        end.to_json
      end
    end
  end
end

