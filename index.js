require("@babel/register");
require("@babel/polyfill");

require("./actions/buildSnapshot.js").default.execute();
