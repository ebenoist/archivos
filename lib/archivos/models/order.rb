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

  def to_json
    as_json.to_json
  end

  def as_json(options = nil)
    name_addition = {}
    if (self.customer.present?)
      name_addition[:customer_name] = self.customer.name
    end

    self.attributes.merge!(name_addition)
  end
end
