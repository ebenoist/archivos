require "./initialize"

def exports
  "ENV=#{Archivos.env} RACK_ENV=#{Archivos.env}"
end

task :start do
  system("#{exports} bundle exec thin -o 9393 start -d -l #{Archivos.log_dir}/thin.log") # start api
  system("#{exports} bundle exec sidekiq -v -C config/sidekiq.yml -r ./initialize.rb -L #{Archivos.log_dir}/sidekiq.log -P #{Archivos.pid_dir}/sidekiq.pid -d") # start sidekiq
end

task :stop do
  system("bundle exec thin -o 9393 stop; true") # stop api
  system("bundle exec sidekiqctl stop #{Archivos.pid_dir}/sidekiq.pid 60")
end
