{
  languages.javascript = {
    enable = true;
    bun = {
      enable = true;
      install.enable = true;
    };
  };

  dotenv.disableHint = true;
  processes.dev = {
    exec = "bun dev";
    process-compose.availability = {
      restart = "on_failure";
      backoff_seconds = 10;
    };
  };

  services.minio = {
    enable = true;
    buckets = ["dev"];
  };
}
