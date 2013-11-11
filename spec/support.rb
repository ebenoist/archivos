ENV['RACK_ENV'] = 'test'
ENV["ENV"] = "test"

require 'rack/test'
require File.expand_path("../../initialize", __FILE__)
require 'sidekiq/testing'

Sidekiq::Testing.fake!

RSpec.configure do |config|
  include Rack::Test::Methods
  # Use color in STDOUT
  config.color_enabled = true
end
