#encoding: utf-8

require "archivos/api"

def app
  API
end

def fixture(name)
  Archivos.root + "/spec/fixtures/#{name}"
end

describe "Archivos API" do
  context "POST" do
    it "should create a new media object" do
      order_code = UUID.generate
      mime_type = "image/jpg"
      file_one = Rack::Test::UploadedFile.new(fixture("image_one.jpg"), mime_type)
      file_two = Rack::Test::UploadedFile.new(fixture("image_two.jpg"), mime_type)

      post "/v1/archivos", { order_code: order_code, files: [file_one, file_two] }

      archivo_one = Archivo.where({ file_name: "image_one.jpg", order_code: order_code, mime: mime_type }).first
      archivo_two = Archivo.where({ file_name: "image_two.jpg", order_code: order_code, mime: mime_type }).first

      expect(archivo_one).to_not be_nil
      expect(archivo_two).to_not be_nil
    end

    it "kicks off a background process to upload to s3" do
      order_code = UUID.generate
      file = Rack::Test::UploadedFile.new(fixture("image_two.jpg"), "image/jpg")

      post "/v1/archivos", { order_code: order_code, files: [file] }

      fixture_contents = File.open(fixture("image_two.jpg"), "rb") { |io| io.read }

      archivo = Archivo.create!
      Archivo.stub(:create!).with(hash_including({ order_code: order_code })).and_return(archivo)

      S3UploadWorker.should_receive(:perform_async).with do |file|
        expect(file[:id]).to eq(archivo.id.to_s)
        expect(file[:file_name]).to eq("image_two.jpg")
        expect(file[:order_code]).to eq(order_code)

        file_contents = File.open(file[:file], "rb") { |io| io.read }
        expect(file_contents).to eq(fixture_contents)
      end

      post "/v1/archivos", { order_code: order_code, files: [file] }
    end

    it "redirects to the index if accept is html and order_code is set" do
      header "Accept", "text/html"

      file = Rack::Test::UploadedFile.new(fixture("image_two.jpg"), "image/jpg")
      order_code = "foo"
      post "/v1/archivos", { order_code: order_code, files: [file] }
      follow_redirect!

      expect(last_request.url).to eq("http://example.org/?order_code=#{order_code}")
    end
  end

  context "GET" do
    it "gets all the archivo" do
      archivo_one = Archivo.new({ file_name: "one.jpg" })
      archivo_two = Archivo.new({ file_name: "two.jpg" })

      archivo_one.save!
      archivo_two.save!

      get "/v1/archivos"

      expect(last_response.body).to eq([archivo_one, archivo_two].to_json)
    end

    it "only returns the archivos that match the order code" do
      id = UUID.generate
      archivo_one = Archivo.new({ order_code: id, file_name: "one.jpg" })
      archivo_two = Archivo.new({ order_code: UUID.generate, file_name: "two.jpg" })

      archivo_one.save!
      archivo_two.save!

      get "/v1/archivos", { order_code: id }

      expect(last_response.body).to eq([archivo_one].to_json)
    end

    it "gets an individual record" do
      archivo_one = Archivo.new({ file_name: "one.jpg" })

      archivo_one.save!
      id = archivo_one.id.to_s

      get "/v1/archivos/#{id}"

      expect(last_response.body).to eq(archivo_one.to_json)
    end
  end

  context "v1/customer" do
    it "GET returns all the customers" do
      customer = Customer.create({ name: "foo" })

      get "/v1/customer"

      expect(last_response).to be_ok
      expect(last_response.body).to eq([customer].to_json)
    end

    it "POST creates a new customer" do
      email = "l@l.com"
      name = "leila"
      phone_number = "555"
      customer = { "email" => email, "name" => name, "phone_number" => phone_number }

      header "Content-Type", "application/json"
      post "/v1/customer", customer.to_json
      expect(JSON.parse(last_response.body)).to include(customer)

      customers = Customer.where(customer)
      expect(customers).to have(1).items

      created_customer = customers.first
      expect(created_customer.email).to eq(email)
      expect(created_customer.name).to eq(name)
      expect(created_customer.phone_number).to eq(phone_number)
    end
  end

  context "/order" do
    it "can be retrieved via id" do
      order = Order.create!

      get "/v1/orders/#{order._id}"

      expect(last_response.body).to eq(order.to_json)
    end

    it "responds with a 404 if not found" do
      get "/v1/orders/snagglepoo"

      expect(last_response.status).to eq(404)
    end

    it "GETs all the orders" do
      orders = [Order.create!, Order.create!]
      get "/v1/orders"

      expect(last_response.body).to eq(orders.to_json)
    end

    it "POST creates a new order" do
      customer = Customer.create

      package = "silver"
      delivery_date = DateTime.now
      order_code = "abc"
      customer_id = customer._id

      order = {
        "package" => package,
        "delivery_date" => delivery_date,
        "order_code" => order_code,
        "customer_id" => customer_id
      }

      header "Content-Type", "application/json"
      post "/v1/orders", order.to_json

      orders = Customer.find(customer._id).orders
      expect(orders).to have(1).items

      created_order = orders.first
      expect(created_order.package).to eq(package)
      expect(created_order.delivery_date.to_s).to eq(delivery_date.to_s)
      expect(created_order.order_code).to eq(order_code)
    end
  end

  context "GET /admin" do
    it "responds with a 401 if no credentials are provided" do
      get "/admin"
      expect(last_response.status).to eq(401)
    end

    it "responds with a 401 credentials not belonging to an admin are entered" do
      authorize "foo", "no-way"

      get "/admin"

      expect(last_response.status).to eq(401)
    end

    it "renders the admin page if matching credentials are entered" do
      user_name = "foo"
      password = "correct!"

      admin = Admin.stub(:authorized?).with(user_name, password).and_return(true)
      authorize user_name, password

      get "/admin"

      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/admin/i)
    end
  end
end

