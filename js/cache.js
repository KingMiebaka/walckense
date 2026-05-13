const version = Date.now();

function addVersion(url) {
  return url.split("?")[0] + "?v=" + version;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
    link.href = addVersion(link.href);
  });

  document.querySelectorAll("script[src]").forEach(script => {
    script.src = addVersion(script.src);
  });
});