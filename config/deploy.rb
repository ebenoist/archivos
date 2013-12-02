set :application, "archvios"
set :repo_url, "git@github.com:ebenoist/archivos.git"

set :deploy_to, "/home/ubuntu/archivos"
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :deploy_via, :remote_cache
set :linked_files, %w{config/aws.yml}
set :linked_dirs, %w{log tmp/pids}

set :bundle_flags, '--verbose'
set :keep_releases, 5

namespace :deploy do
  desc "Start application"
  task :start do
    on roles(:app) do
      execute("cd #{current_path} && bundle exec rake start")
    end
  end

  desc "Stop application"
  task :start do
    on roles(:app) do
      execute("cd #{current_path} && bundle exec rake stop")
    end
  end

  desc "Restart application"
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute("cd #{current_path} && bundle exec rake stop")
      execute("cd #{current_path} && bundle exec rake start")
    end
  end
end

