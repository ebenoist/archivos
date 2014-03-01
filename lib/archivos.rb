module Archivos
  class << self
    def root
      File.expand_path("../../", __FILE__)
    end

    def env
      @env ||= ENV['ENV'] || ENV['RACK_ENV'] || "development"
    end

    def database_config
      Archivos.root + "/config/mongoid.yml"
    end

    def pid_dir
      tmp_dir + "/pids"
    end

    def tmp_dir
      Archivos.root + "/tmp"
    end

    def log_dir
      Archivos.root + "/log"
    end
  end
end

