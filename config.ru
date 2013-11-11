require 'rubygems'
require 'bundler/setup'
require File.expand_path '../initialize.rb', __FILE__

require 'sidekiq/web'
require "archivos/api"

run Rack::URLMap.new(
    "/" => Archivos::API,
    "/sidekiq" => Sidekiq::Web
)
