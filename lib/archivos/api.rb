require "sinatra/base"
require "sinatra/namespace"
require "archivos/models/archivo"
require "archivos/models/order"
require "archivos/models/admin"
require "archivos/workers/s3_upload_worker"
require "archivos/controllers/preview_controller"
require "archivos/controllers/archivo_controller"
require "archivos/controllers/customer_controller"
require "archivos/controllers/order_controller"

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
    register PreviewController
    register ArchivoController
    register OrderController
    register CustomerController
  end
end

