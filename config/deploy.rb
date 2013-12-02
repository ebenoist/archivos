require "bundler/capistrano"
require "capistrano/ext/multistage"

set :application, "archvios"
set :repo_url, "git@github.com:ebenoist/archivos.git"
set :stages, %w(production)

set :deploy_to, "/home/ubuntu/archivos"
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :deploy_via, :remote_cache
set :linked_files, %w{config/aws.yml}
set :linked_dirs, %w{log tmp/pids}
set :keep_releases, 5

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

