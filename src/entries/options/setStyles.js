import browser from "webextension-polyfill";

async function setStyles() {
  const bgUrl = browser.runtime.getURL("images/options_bg.jpg");
  document.body.style.background = `url(${bgUrl}) repeat center center`;
  document.body.style.backgroundSize = "cover";

  const fontUrl = browser.runtime.getURL(
    "fonts/archivo-narrow-v30-latin-regular.woff2"
  );

  const fontFace = new FontFace("Archivo Narrow", `url(${fontUrl})`, {
    style: "normal",
    weight: "400",
  });

  document.fonts.add(fontFace);
  await fontFace.load();
}

export default setStyles;
