require "./initialize"

task :start do
  system("bundle exec thin -o 9393 start -d") # start api
  system("bundle exec sidekiq -C config/sidekiq.yml -r ./initialize.rb -L log/sidekiq.log P tmp/pids/sidekiq.pid -d") # start sidekiq
end

task :stop do
  system("bundle exec thin -o 9393 stop; true") # stop api
  system("kill -2 `cat tmp/pids/sidekiq.pid`; true") # stop sidekiq
end

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'
