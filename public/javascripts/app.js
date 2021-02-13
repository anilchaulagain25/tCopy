var utils = {
  overlay: {
    on: function (text, disapperInSeconds, callBackAfterTimePeriod) {
      document.getElementById("overlay").style.display = "block";
      if (text) $("#overlay span").text(text);
      if (disapperInSeconds)
        setTimeout(utils.overlay.off, 1000 * disapperInSeconds);
      if (
        disapperInSeconds &&
        callBackAfterTimePeriod &&
        typeof callBackAfterTimePeriod === "function"
      )
        callBackAfterTimePeriod();
    },
    off: function () {
      $("#overlay span").text("Please wait ...");
      document.getElementById("overlay").style.display = "none";
    },
  },
  getLongTextFormat: function (input, len) {
    var maxLength = len || 20;
    input = input || "";
    if (input.length > maxLength) {
      return input.substr(0, maxLength - 1) + "...";
    }
    return input;
  },
  copyToClipboard: function (text) {
    var input = document.body.appendChild(document.createElement("input"));
    input.value = text;
    input.focus();
    input.select();
    document.execCommand("copy");
    input.parentNode.removeChild(input);
  },
  getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
};
