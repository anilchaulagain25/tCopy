var ClipBoardCreateViewModel = function () {
  var self = this;
  var Models = {
    Main: function (item) {
      item = item || {};
      this.Text = ko.observable(item.Text || "");
      this.IsEncrypted = ko.observable(item.IsEncrypted || false);
      this.Password = ko.observable(item.Password || "");
    },
  };
  //main bindings
  self.Master = ko.observable(new Models.Main());

  //event bindings
  window.submitForm = function () {
    utils.overlay.on();
    var body = ko.toJS(obj.Master());
    body.Text = $(".summernote").summernote("code");
    var actualText = $("<p>" + body.Text + "</p>").text();
    if (!actualText || !actualText.trim()) {
      utils.overlay.on("please provide text", 2);
      $(".summernote").focus();
      return;
    }
    axios
      .post("/create", body)
      .then(function (response) {
        if (response.data.success) {
          utils.overlay.on(
            response.data.msg || "Created successfully",
            2,
            function () {
              window.location.href = "/";
            }
          );
        } else {
          utils.overlay.on(response.data.msg || "Unable to create", 2);
        }
      })
      .catch(function (err) {})
      .then(function () {
        utils.overlay.off();
      });
  };
};

var obj = new ClipBoardCreateViewModel();
$(document).ready(function () {
  $(".summernote").summernote();
  var dom = document.getElementById("user-create");
  if (dom) ko.applyBindings(obj, dom);
});
