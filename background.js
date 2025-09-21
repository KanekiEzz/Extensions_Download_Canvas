chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const canvases = document.querySelectorAll("canvas");

      if (canvases.length === 0) {
        alert("No canvas found on this page!");
        return;
      }

      const merged = document.createElement("canvas");
      merged.width = canvases[0].width;
      merged.height = canvases[0].height;
      const ctx = merged.getContext("2d");

      canvases.forEach((c) => {
        ctx.drawImage(c, 0, 0);
      });

      const fileName = "canvas_" + Date.now() + ".png";

      const link = document.createElement("a");
      link.href = merged.toDataURL("image/png");
      link.download = fileName;
      link.click();
    }
  });
});





















// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => {
//       const lower = document.querySelector(".lower-canvas");
//       const upper = document.querySelector(".upper-canvas");

//       if (!lower) {
//         alert("No canvas found on this page!");
//         return;
//       }

//       const merged = document.createElement("canvas");
//       merged.width = lower.width;
//       merged.height = lower.height;
//       const ctx = merged.getContext("2d");

//       ctx.drawImage(lower, 0, 0);
//       if (upper) ctx.drawImage(upper, 0, 0);

//       const link = document.createElement("a");
//       link.href = merged.toDataURL("image/png");
//       link.download = "canvas_image.png";
//       link.click();
//     }
//   });
// });
