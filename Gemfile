source "https://rubygems.org"

gem "bundler"
gem "thin"
gem "rack"
gem "rake"
gem "sinatra", require: "sinatra/base"
gem "sinatra-contrib", require: false
gem "mongoid", "~> 3.0.0"
gem "bson_ext"
gem "uuid"
gem "sidekiq"
gem "unf"
gem "aws-sdk"

group :development, :test do
  gem "debugger"
end

group :test do
  gem "rspec"
  gem "rack-test"
  gem 'jasmine'
end

group :development do
  gem "rvm-capistrano"
  gem "capistrano", "~> 2.15.4"
end
