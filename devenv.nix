{pkgs, ...}: {
  packages = [pkgs.postgresql pkgs.sops pkgs.age];

  env.SOPS_AGE_KEY_FILE = ".sops-age-key.txt";

  languages.javascript = {
    enable = true;
    bun = {
      enable = true;
      install.enable = true;
    };
    pnpm.enable = true;
  };

  dotenv.disableHint = true;
  processes.dev = {
    exec = "sops exec-env secrets.dev.yaml 'vite dev'";
    process-compose.availability = {
      restart = "on_failure";
      backoff_seconds = 10;
    };
  };

  services.postgres = {
    enable = true;
    initialDatabases = [{name = "cms";}];
    listen_addresses = "127.0.0.1";
  };

  services.minio = {
    enable = true;
    buckets = ["dev"];
  };
}
