class Admin
  include Mongoid::Document
  include Mongoid::Timestamps

  field :user_name, type: String
  field :password, type: String
  field :created_at, type: DateTime
  field :updated_at, type: DateTime

  class << self
    def authorized?(user_name, password)
      admins = Admin.where({ user_name: user_name, password: password })
      admins.present?
    end
  end
end
