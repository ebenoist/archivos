require "archivos/models/customer"

describe Customer do
  it "has many orders" do
    order_one = Order.new
    order_two = Order.new

    customer = Customer.new
    customer.orders = [order_one, order_two]
    customer.save!

    expect(customer.orders).to include(order_one, order_two)
  end
end
