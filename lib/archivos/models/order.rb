class Order
  include Mongoid::Document
  include Mongoid::Timestamps

  field :order_code, type: String
  field :created_at, type: DateTime
  field :updated_at, type: DateTime
end
