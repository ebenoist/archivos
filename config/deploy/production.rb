set :stage, :production
set :default_environment, {
  'ENV' => "production"
}
role :app, "ubuntu@ec2-50-17-45-182.compute-1.amazonaws.com"

