%w(. ./lib/ ./config/).each do |path|
  $: << path
end

require "bundler"
Bundler.require

require "mongoid"
require "archivos"
require "uuid"

Mongoid.load!(Archivos.database_config, Archivos.env)

# Load worker
require "archivos/workers/s3_upload_worker"

