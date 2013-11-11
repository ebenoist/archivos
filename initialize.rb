%w(. ./lib/ ./config/).each do |path|
  $: << path
end

require "bundler"
Bundler.require

require "mongoid"
require "archivos"
require "uuid"
Mongoid.load!(Archivos.database_config)

