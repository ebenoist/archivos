require "archivos/models/order"

describe Order do
  it "includes the customer name in the json response" do
    name = "erik"
    customer = Customer.new
    customer.name = name

    order = Order.new
    order.customer = customer

    order_json = JSON.parse(order.to_json)
    expect(order_json["customer_name"]).to eq(name)
  end

  it "presents customer_name in as_json" do
    name = "erik"
    customer = Customer.new
    customer.name = name

    order = Order.new
    order.customer = customer

    order_json = order.as_json
    expect(order_json[:customer_name]).to eq(name)
  end

  it "leaves the key blank if no customer present" do
    order = Order.new

    order_json = order.as_json
    expect(order_json[:customer_name]).to be_nil
  end
end
