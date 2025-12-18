{
  languages.javascript = {
    enable = true;
    bun = {
      enable = true;
      install.enable = true;
    };
  };

  dotenv.disableHint = true;
  processes.dev.exec = "bun dev";

  services.minio = {
    enable = true;
    buckets = ["dev"];
  };
}
