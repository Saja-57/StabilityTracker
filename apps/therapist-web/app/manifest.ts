import { colors } from "@stability/design-tokens";
import { DEFAULT_LANGUAGE, translate } from "@stability/i18n";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: translate(DEFAULT_LANGUAGE, "app.name"),
    short_name: translate(DEFAULT_LANGUAGE, "app.name"),
    description: translate(DEFAULT_LANGUAGE, "brand.description"),
    start_url: "/",
    display: "standalone",
    background_color: colors.background.canvas,
    theme_color: colors.brand.primary,
    icons: [
      {
        src: "/brand/app-icon.png",
        sizes: "1254x1254",
        type: "image/png",
      },
      {
        src: "/brand/logo-mark.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  };
}
