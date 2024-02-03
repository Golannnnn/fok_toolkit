import pkg from "../package.json";

const sharedManifest = {
  content_scripts: [
    {
      js: [
        "src/entries/contentScript/blocker/main.js",
        "src/entries/contentScript/uploader/main.js",
        "src/entries/contentScript/scroller/main.js",
      ],
      css: [
        "src/entries/contentScript/blocker/style.css",
        "src/entries/contentScript/uploader/style.css",
        "src/entries/contentScript/scroller/style.css",
      ],
      matches: ["*://*.forum.fok.nl/topic/*"],
      run_at: "document_end",
    },
    {
      js: ["src/entries/contentScript/mentions/main.js"],
      css: ["src/entries/contentScript/mentions/style.css"],
      matches: ["*://*.forum.fok.nl/*"],
      run_at: "document_end",
    },
  ],
  icons: {
    16: "icons/16.png",
    32: "icons/32.png",
    48: "icons/48.png",
    96: "icons/96.png",
    128: "icons/128.png",
  },
  options_ui: {
    page: "src/entries/options/index.html",
    open_in_tab: true,
  },
  permissions: ["storage"],
};

const browserAction = {
  default_icon: {
    16: "icons/16.png",
    32: "icons/32.png",
    48: "icons/48.png",
    96: "icons/96.png",
  },
  default_title: "FOK!Toolkit",
  default_popup: "src/entries/popup/index.html",
};

const ManifestV2 = {
  ...sharedManifest,
  background: {
    scripts: ["src/entries/background/script.js"],
    persistent: true,
  },
  browser_action: browserAction,
  options_ui: {
    ...sharedManifest.options_ui,
    chrome_style: false,
  },
  permissions: [
    ...sharedManifest.permissions,
    "https://api.imgbb.com/1/upload",
  ],
  web_accessible_resources: ["images/arrow-down.svg", "images/arrow-up.svg"],
};

const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  background: {
    service_worker: "src/entries/background/serviceWorker.js",
  },
  host_permissions: ["https://api.imgbb.com/1/upload"],
  web_accessible_resources: [
    {
      matches: ["*://*.forum.fok.nl/*", "https://forum.fok.nl/*"],
      resources: ["images/arrow-down.svg", "images/arrow-up.svg"],
    },
  ],
};

export function getManifest(manifestVersion) {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
  };

  if (manifestVersion === 2) {
    return {
      ...manifest,
      ...ManifestV2,
      manifest_version: manifestVersion,
    };
  }

  if (manifestVersion === 3) {
    return {
      ...manifest,
      ...ManifestV3,
      manifest_version: manifestVersion,
    };
  }

  throw new Error(
    `Missing manifest definition for manifestVersion ${manifestVersion}`
  );
}
