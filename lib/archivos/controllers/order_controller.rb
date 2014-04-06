require "archivos/models/order"

module OrderController
  def self.registered(app)
    app.get "/orders/:id" do
      begin
        order = Order.find(params["id"])
        order.to_json
      rescue Mongoid::Errors::DocumentNotFound => e
        halt 404 if order.nil?
      end
    end

    app.get "/orders" do
      Order.all.to_json
    end

    app.post "/orders" do
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
  end
end
