require "archivos/models/order"

class Customer
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :email, type: String
  field :phone_number, type: String
  field :created_at, type: DateTime
  field :updated_at, type: DateTime

  has_many :orders
end
