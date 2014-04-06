
module CustomerController
  def self.registered(app)
    app.get "/customer" do
      customers = Customer.all

      customers.to_json
    end

    app.post "/customer" do
      body = JSON.parse(request.body.read)
      name = body["name"]
      email = body["email"]
      phone_number = body["phone_number"]

      customer = Customer.create!({ name: name, email: email, phone_number: phone_number })

      customer.to_json
    end
  end
end

