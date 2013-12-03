ENV['RACK_ENV'] = 'test'
ENV["ENV"] = "test"

require 'rack/test'
require File.expand_path("../../initialize", __FILE__)
require 'sidekiq/testing'

Sidekiq::Testing.fake!

RSpec.configure do |config|
  include Rack::Test::Methods
  config.color_enabled = true

  config.before(:each) do
    Mongoid::Sessions.default.collections.select {|c| c.name !~ /system/}.each {|c| c.find.remove_all}
  end
end
