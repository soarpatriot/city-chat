# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'nanyang'
set :repo_url, 'git@git.soundink.cn:server/inkash.git'

set :rails_env, 'production'

set :rvm_type, :user
set :rvm_ruby_version, '2.1.1'

set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :linked_files, %w{config/database.yml config/settings/production.yml config/apns_sandbox.pem config/apns_production.pem config/initializers/rpush.rb config/newrelic.yml}

set :linked_dirs, %w{bin log tmp public/system public/assets public/uploads}

set :keep_releases, 5

namespace :deploy do

  task :start do 
    invoke :"rvm:hook"
    on roles :app do
      within current_path do
        unless test("[ -f #{fetch(:thin_pid)} ]")
          info ">>>>>> starting thin"
          execute :bundle, "exec thin start -C #{fetch(:thin_config)}"
        else
          error ">>>>>> thin already started"
        end
      end
    end
  end

  task :stop do

    on roles :app do
      within current_path do
        if test("[ -f #{fetch(:thin_pid)} ]")
          info ">>>>>> stopping thin"
          execute :bundle, "exec thin stop -C #{fetch(:thin_config)}"
        else
          error ">>>>>> can not stop. there is no started thin"
        end
      end
    end
  end

  task :restart do
    invoke :"deploy:stop"
    invoke :"deploy:start"
  end

  after :finishing, 'deploy:cleanup'
end

after "deploy:check", "nginx:update_config"
after "deploy:check", "thin:update_config"
before "deploy:cleanup_assets", "rvm:hook"
before "deploy:compile_assets", "rvm:hook"
before "bundler:install", "rvm:hook"
after "deploy:publishing", "deploy:restart"




namespace :rpush do

  desc "Start rpush"
  task :start do

    on roles(:app) do
      within current_path do
        execute :bundle, "exec god start rpush"
      end
    end
  end

  desc "Stop rpush"
  task :stop do

    on roles(:app) do
      within current_path do
        execute :bundle, "exec god stop rpush"
      end
    end
  end

  desc "Restart rpush"
  task :restart do
    on roles(:app) do
      within current_path do
        info ">>>>>> starting application"
        execute :touch, "tmp/restart.txt"
      end
    end
  end


end


