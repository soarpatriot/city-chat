# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'city-chat'
set :repo_url, 'git@github.com:soarpatriot/city-chat.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
# set :deploy_to, '/var/www/my_app'
set :nvm_type, :user # or :system, depends on your nvm setup
set :nvm_node, 'v0.10.28'
set :nvm_map_bins, %w{node npm nvm}
# set :nvm_custom_path, '/home/soar/.nvm/'
# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
set :linked_dirs, %w{node_modules}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
set :supervisor, "#{fetch(:nvm_path)}/#{fetch(:nvm_node)}/bin/supervisor"
# Default value for keep_releases is 5
set :keep_releases, 5

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      within current_path do
        execute :nvm, "use 0.10.28"
        execute :supervisor, "app.js"
      end
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, "dependency:npm"
  after :publishing, :restart
  #after :restart do
   # on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
    #    within current_path do

     #     execute "ll"
          #execute "supervisor app.js"
     #   end
    #end
  #end

end
#after "deploy:check", "dependency:npm"


