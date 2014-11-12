namespace :dependency do

  desc "install dependency"
  task :npm do

    on roles(:app) do
      within current_path do
        execute "nvm use 0.10.28"
        execute "npm install"
      end
    end
  end

end