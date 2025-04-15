window.addEventListener("message", function (msg) {
  if (msg.data.hasOwnProperty("selectText")) {
    const textarea = document.querySelector("textarea[aria-label*=\"Source text\"]");
    textarea.value = msg.data.selectText;
    textarea.dispatchEvent(
      new Event("input", { bubbles: true, cancelable: true })
    );
    textarea.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: true })
    );
    setTimeout(() => {
      textarea.dispatchEvent(
        new Event("input", { bubbles: true, cancelable: true })
      );
    }, 50);
  }
});
