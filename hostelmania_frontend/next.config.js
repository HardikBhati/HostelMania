module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["plus.unsplash.com", "images.unsplash.com", "t4.ftcdn.net", "0e1f9520cfbb74a61ba4-0c2137d93f8d1ba7abe4c5e2888a558f.ssl.cf1.rackcdn.com"],
  },
  env: {
    STRIPE: process.env.STRIPE,
    MAPBOX: process.env.MAPBOX,
  },
};
