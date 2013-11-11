module Archivos
  class << self
    def root
      File.expand_path("../../", __FILE__)
    end

    def env
      @env ||= ENV['ENV'] || ENV['RACK_ENV'] || "development"
    end

    def database_config
      root + "/config/mongoid.yml"
    end
  end
end

