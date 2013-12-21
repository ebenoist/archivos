require 'rubygems'
require 'bundler/setup'
require File.expand_path '../initialize.rb', __FILE__

require 'sidekiq/web'
require "archivos/api"

use Rack::Static,
  :urls => ["/images", "/js", "/css", "/vendor","/admin.html", "/js/vendor"],
  :root => "www"

api = Rack::URLMap.new(
  "/" => Archivos::API,
  "/sidekiq" => Sidekiq::Web
)

index = Proc.new { |env|
  if env["PATH_INFO"] == "/"
    Rack::Response.new(File.open("www/index.html", File::RDONLY), 200, { "Content-Type" => "text/html" }).finish
  else
    Rack::Response.new(["Does not exist!"], 404).finish # Cascade to the API
  end
}

run Rack::Cascade.new([
  index,
  api,
])
