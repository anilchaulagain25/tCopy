var IndexViewModel = function () {
  var self = this;

  self.Clipboards = ko.observableArray([]);
  self.TotalCount = ko.observable(window.Response.meta.totalCount);
  self.Page = ko.observable(window.Response.meta.page);
  self.RecordsPerPage = ko.observable(window.Response.meta.recordsPerPage);
  self.Pages = ko.observable(
    Math.ceil(
      window.Response.meta.totalCount /
        parseFloat(window.Response.meta.recordsPerPage)
    )
  );
  self.timeAgo = function (input) {
    return jQuery.timeago(input);
  };
  self.copyToClipboard = function (text) {
    utils.copyToClipboard(text);
    // utils.overlay.on("copied successfuly", 2);
  };
  self.toUpdatePage = function (id) {
    window.location.href = "/clipboard/" + id;
  };
  self.Clipboards(
    window.Response.data.map(function (item) {
      item.Ago = jQuery.timeago(item.CreatedAt);
      item.PlainText = $("<p>" + item.Text + "</p>").text();
      item.PlainTextShort = utils.getLongTextFormat(
        $("<p>" + item.Text + "</p>").text(),
        100
      );
      return item;
    })
  );
};
var objI = IndexViewModel;
$(document).ready(function () {
  var dom = document.getElementById("user-index");
  jQuery("time.timeago").timeago();
  if (dom) ko.applyBindings(objI, dom);
});
