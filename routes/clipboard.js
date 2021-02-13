var express = require("express");
var router = express.Router();
var cliboardService = require("../services/clipboard");
var Utils = require("../common/utils");

/* GET home page. */
router.get("/", function (req, res, next) {
  const recordsPerPage = 5;
  if (req.isAuthenticated()) {
    var page = req.query.page;
    page = parseInt(page) || 1;
    page = page < 1 ? 1 : page;
    cliboardService.getClipboards(
      Utils.parseId(req.user),
      page,
      recordsPerPage,
      function (re) {
        res.render("clipboard/user-index", {
          data: re,
        });
      }
    );
  } else {
    res.render("clipboard/default-index");
  }
});

/* GET create page. */
router.get("/create", isAuthenticated, function (req, res, next) {
  res.render("clipboard/create");
});
/* GET create page. */
router.get("/clipboard/:id", isAuthenticated, function (req, res, next) {
  cliboardService.getClipboard(
    Utils.parseId(req.user),
    req.params.id,
    function (re) {
      if (re.data) res.render("clipboard/update", { data: re });
      else res.redirect("/");
    }
  );
});

router.post("/clipboard/check-password", isAuthenticated, function (
  req,
  res,
  next
) {
  cliboardService.checkPassword(
    Utils.parseId(req.user),
    req.body.Id,
    req.body.Password,
    function (re) {
      if (re.data && re.data.IsEncrypted) {
        re.data.Text = Utils.decrypt(re.data.Text);
      }
      res.json(re);
    }
  );
});

/* POSt create page. */
router.post("/create", isAuthenticated, function (req, res, next) {
  cliboardService.createClipBoard(Utils.parseId(req.user), req.body, function (
    re
  ) {
    res.json(re);
  });
});

/* POSt create page. */
router.put("/update", isAuthenticated, function (req, res, next) {
  cliboardService.updateClipBoard(Utils.parseId(req.user), req.body, function (
    re
  ) {
    res.json(re);
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      res
        .status(401)
        .json({ success: false, msg: "user is not authenticated" });
    } else {
      res.redirect("/auth");
    }
  }
}

module.exports = router;
