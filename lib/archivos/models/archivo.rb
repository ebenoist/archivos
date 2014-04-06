require "archivos/models/order"

class Archivo
  include Mongoid::Document
  include Mongoid::Timestamps

  field :file_name, type: String
  field :public_uri, type: String
  field :order_code, type: String
  field :created_at, type: DateTime
  field :updated_at, type: DateTime
  field :mime, type: String
  field :preview, type: Boolean

  belongs_to :order
end
