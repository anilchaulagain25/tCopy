var ClipBoardUpdateViewModel = function () {
  var self = this;
  var Models = {
    Main: function (item) {
      item = item || {};
      this.Id = ko.observable(item.Id || item["_id"] || "");
      this.Text = ko.observable(item.Text || "");
      this.IsEncrypted = ko.observable(item.IsEncrypted || false);
      this.Password = ko.observable(item.Password || "");
    },
  };
  //main bindings
  self.Master = ko.observable(new Models.Main());
  if (window.Response.data.IsEncrypted) {
    var pw = prompt("Please enter password in order to access your content");
    function invalidPw() {
      alert("invalid password");
      window.location.href = "/";
    }

    if (!pw) {
      invalidPw();
    }

    var body = { Password: pw, Id: window.Response.data["_id"] };
    axios
      .post("/clipboard/check-password", body)
      .then(function (response) {
        if (response.data.success && response.data.data) {
          var responseData = response.data.data;
          responseData.Password = pw;
          self.Master(new Models.Main(responseData));
          $(".summernote").summernote("code", self.Master().Text());
        } else {
          invalidPw();
        }
      })
      .catch(function (err) {})
      .then(function () {
        utils.overlay.off();
      });
  } else {
    self.Master(new Models.Main(window.Response.data));
    $(".summernote").summernote("code", self.Master().Text());
  }
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
      .put("/update", body)
      .then(function (response) {
        if (response.data.success) {
          utils.overlay.on(
            response.data.msg || "Updated successfully",
            2,
            function () {
              window.location.href = "/";
            }
          );
        } else {
          utils.overlay.on(response.data.msg || "Unable to update", 2);
        }
      })
      .catch(function (err) {})
      .then(function () {
        utils.overlay.off();
      });
  };
};

var obj = new ClipBoardUpdateViewModel();
$(document).ready(function () {
  $(".summernote").summernote();
  var dom = document.getElementById("user-create");
  if (dom) ko.applyBindings(obj, dom);
});
