require 'rubygems'
require 'bundler/setup'
require File.expand_path '../initialize.rb', __FILE__

require 'sidekiq/web'
require "archivos/api"

use Rack::Static,
  :urls => ["/images", "/js", "/css", "/vendor"],
  :root => "www"

api = Rack::URLMap.new(
  "/" => Archivos::API,
  "/sidekiq" => Sidekiq::Web
)

index = Proc.new { |env|
  if env["PATH_INFO"] == "/"
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('www/index.html', File::RDONLY)
  ]
  else
    Rack::Response.new(["Doesn't exist"], 404).finish
  end
}

run Rack::Cascade.new([
  index,
  api,
])
