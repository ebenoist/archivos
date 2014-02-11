require "archivos/models/customer"

class Order
  include Mongoid::Document
  include Mongoid::Timestamps

  field :created_at, type: DateTime
  field :updated_at, type: DateTime
  field :package, type: String
  field :delivery_date, type: DateTime
  field :order_code, type: String

  belongs_to :customer
end
