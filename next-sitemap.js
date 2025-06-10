module.exports = {
  siteUrl: "https://studyhere.asigdel.com.np",
  generateRobotsTxt: true,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path.startsWith("/subject/") ? "daily" : "monthly",
      priority: path.startsWith("/subject/") ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
