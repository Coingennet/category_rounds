const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/category-rounds/" // Thay tên repository
      : "/",
});
