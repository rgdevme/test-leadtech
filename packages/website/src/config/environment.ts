const parseOrigin = (name: "NEXT_PUBLIC_APP_URL" | "NEXT_PUBLIC_SITE_URL") => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be defined as an absolute HTTP or HTTPS origin.`);
  }

  try {
    const url = new URL(value);

    if (!(["http:", "https:"] as const).includes(url.protocol as "http:" | "https:")) {
      throw new Error("Unsupported protocol.");
    }

    if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
      throw new Error("Expected an origin without a path, query, hash, or credentials.");
    }

    return url;
  } catch (error) {
    throw new Error(`${name} must be a valid absolute origin.`, { cause: error });
  }
};

export const environment = {
  appUrl: parseOrigin("NEXT_PUBLIC_APP_URL"),
  siteUrl: parseOrigin("NEXT_PUBLIC_SITE_URL"),
};
