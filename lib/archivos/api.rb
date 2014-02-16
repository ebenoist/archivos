require "sinatra/base"
require "sinatra/namespace"
require "archivos/models/media"
require "archivos/models/order"
require "archivos/models/admin"
require "archivos/workers/s3_upload_worker"

class API < Sinatra::Base
  register Sinatra::Namespace

  helpers do
    def protect!
      return if authorized?

      headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
      halt 401, "Not authorized\n"
    end

    def authorized?
      authentication = Rack::Auth::Basic::Request.new(request.env)
      proper_auth_request?(authentication) && is_admin?(authentication.credentials)
    end

    def is_admin?(credentials)
      Admin.authorized?(credentials[0], credentials[1])
    end

    def proper_auth_request?(authentication)
      authentication.provided? && authentication.basic? && authentication.credentials
    end
  end

  get "/admin" do
    protect!
    send_file("lib/archivos/views/admin.html")
  end

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
        redirect "/?order_code=#{params["order_code"]}"
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

    get "/orders/:id" do
      begin
        order = Order.find(params["id"])
        order.to_json
      rescue Mongoid::Errors::DocumentNotFound => e
        halt 404 if order.nil?
      end
    end

    get "/orders" do
      Order.all.to_json
    end

    post "/orders" do
      body = JSON.parse(request.body.read)

      package = body["package"]
      delivery_date = body["delivery_date"]
      order_code = body["order_code"]
      customer_id = body["customer_id"]

      customer = Customer.find(customer_id)

      order = Order.new({
        package: package,
        delivery_date: delivery_date,
        order_code: order_code,
        customer_id: customer_id
      })

      customer.orders << order
      customer.save!

      order.to_json
    end

    get "/customer" do
      customers = Customer.all

      customers.to_json
    end

    post "/customer" do
      body = JSON.parse(request.body.read)
      name = body["name"]
      email = body["email"]
      phone_number = body["phone_number"]

      customer = Customer.create!({ name: name, email: email, phone_number: phone_number })

      customer.to_json
    end

  end
end

