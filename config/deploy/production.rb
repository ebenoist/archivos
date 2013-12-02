set :stage, :production
role :app, %w{ubuntu@ec2-50-17-45-182.compute-1.amazonaws.com}
server 'ec2-50-17-45-182.compute-1.amazonaws.com', user: 'ubuntu', roles: %w{app}
