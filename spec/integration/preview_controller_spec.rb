require "archivos/api"

def app
  API
end

describe PreviewController do
  it "GET /v1/previews returns all previews for the order" do
    order_code = "123"
    order = Order.create({ order_code: order_code })
    preview = order.archivos.create({ preview: true })

    get "/v1/previews", { order_code: order_code }

    expect(last_response).to be_ok
    json_response = JSON.parse(last_response.body)
    expect(json_response).to have(1).item
    expect(json_response.first["order_id"]).to eq(preview.order_id.to_s)
  end
end


