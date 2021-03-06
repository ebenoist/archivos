require "bundler/capistrano"
require "capistrano/ext/multistage"

set :application, "archvios"
set :repository, "git@github.com:ebenoist/archivos.git"
set :stages, %w(production)

set :deploy_to, "/home/deploy/archivos"
set :scm, :git

set :format, :pretty
set :log_level, :debug

set :deploy_via, :remote_cache
set :shared_children, %w{log tmp/pids tmp/uploads config/aws.yml}
set :keep_releases, 5
set :user, "deploy"
set :use_sudo, false

namespace :deploy do
  desc "Start application"
  task :start do
    run("cd #{current_path} && bundle exec rake start")
  end

  desc "Stop application"
  task :start do
    run("cd #{current_path} && bundle exec rake stop")
  end

  desc "Restart application"
  task :restart do
    run("cd #{current_path} && bundle exec rake stop")
    run("cd #{current_path} && bundle exec rake start")
  end
end

