require "bundler/capistrano"
require "capistrano/ext/multistage"
require "rvm/capistrano"

set :application, "archvios"
set :repository, "git@github.com:ebenoist/archivos.git"
set :stages, %w(production)

set :deploy_to, "/home/ubuntu/archivos"
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :deploy_via, :remote_cache
set :linked_files, %w{config/aws.yml}
set :linked_dirs, %w{log tmp/pids tmp/uploads}
set :keep_releases, 5
set :user, "ubuntu"
set :use_sudo, false

#SET UP RVM
set :rvm_ruby_string, ENV['GEM_HOME'].gsub(/.*\//,"")
set :rvm_install_ruby_params, '--1.9'      # for jruby/rbx default to 1.9 mode
set :rvm_install_pkgs, %w[libyaml openssl] # package list from https://rvm.io/packages
set :rvm_install_ruby_params, '--with-opt-dir=/usr/local/rvm/usr' # package support

before 'deploy:setup', 'rvm:install_rvm'   # install RVM
before 'deploy:setup', 'rvm:install_ruby'  # install Ruby and create gemset, or:
before 'deploy:setup', 'rvm:create_gemset' # only create gemset

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

