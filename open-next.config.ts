import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Vorgerenderte Seiten werden direkt aus den statischen Dateien ausgeliefert.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
