require "archivos/models/archivo"

module ArchivoController
  def self.registered(app)
    app.post "/archivos" do
      params["files"].each do |file|
        order_code = params["order_code"]
        file_name = file[:filename]
        file_type = file[:type]

        File.open("tmp/uploads/#{file_name}", "w") do |tmp|
          tmp.write(file[:tempfile].read)
        end

        archivo = Archivo.create!({ order_code: order_code, file_name: file_name, mime: file_type })

        S3UploadWorker.perform_async({
          id: archivo.id.to_s,
          file_name: file_name,
          order_code: order_code,
          file: "tmp/uploads/#{file_name}"
        })
      end

      request.accept.each do |type|
        halt 201 if type == "application/json"
        redirect "/?order_code=#{params["order_code"]}"
      end
    end

    app.get "/archivos" do
      if params["order_code"]
        Archivo.where({ order_code: params["order_code"] }).to_json
      else
        Archivo.all.to_json
      end
    end

    app.get "/archivos/:id" do
      Archivo.find(params["id"]).to_json
    end
  end
end

