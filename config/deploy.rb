set :application, "archvios"
set :repo_url, "git@github.com:ebenoist/archivos.git"

set :deploy_to, "/home/ubuntu/archivos"
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :linked_files, %w{config/aws.yml}
set :linked_dirs, %w{log tmp/pids}

set :keep_releases, 5

namespace :deploy do
  desc "Start application"
  task :start do
    on roles(:app) do
      execute :rake, start
    end
  end

  desc "Stop application"
  task :start do
    on roles(:app) do
      execute :rake, stop
    end
  end

  desc "Restart application"
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :rake, stop
      execute :rake, start
    end
  end
end

