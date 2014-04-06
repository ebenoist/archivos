require "archivos/models/archivo"

module PreviewController
  def self.registered(app)
    app.get "/previews" do
      order = Order.where({ order_code: params["order_code"]}).first
      order.previews.to_json
    end
  end
end
