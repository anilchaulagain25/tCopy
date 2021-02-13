var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var Utils = require("./../common/utils");

function createClipBoard(userId, data, cb) {
  if (!data.Text || typeof data.Text !== "string") {
    cb({
      success: false,
      msg: "invalid text",
    });
  } else if (!userId || typeof userId !== "string") {
    cb({
      success: false,
      msg: "invalid user",
    });
  } else if (
    data.IsEncrypted &&
    (!data.Password || typeof data.Password !== "string")
  ) {
    cb({
      success: false,
      msg: "invalid password",
    });
  } else {
    var Model = {
      Text: data.IsEncrypted ? Utils.encrypt(data.Text) : data.Text,
      UserId: userId,
      IsEncrypted: data.IsEncrypted,
      PasswordHash: data.IsEncrypted ? Utils.getHash(data.Password) : null,
      CreatedAt: Date.now(),
    };
    connectDB(function (err, db) {
      if (err) {
        cb({
          success: false,
          msg: "failed to create",
        });
        //log
      } else {
        var dbo = db.db(process.env.DB_NAME);
        dbo.collection("clipboards").insertOne(Model, function (err, res) {
          if (err) {
            cb({ success: false, msg: "failed to create" });
            //log
          } else {
            db.close();
            cb({
              success: true,
              msg: "created successfully",
            });
          }
        });
      }
    });
  }
}
function updateClipBoard(userId, data, cb) {
  if (!data.Text || typeof data.Text !== "string") {
    cb({
      success: false,
      msg: "invalid text",
    });
  } else if (!userId || typeof userId !== "string") {
    cb({
      success: false,
      msg: "invalid user",
    });
  } else if (!data.Id || typeof data.Id !== "string") {
    cb({
      success: false,
      msg: "invalid id",
    });
  } else if (
    data.IsEncrypted &&
    (!data.Password || typeof data.Password !== "string")
  ) {
    cb({
      success: false,
      msg: "invalid password",
    });
  } else {
    var Model = {
      Text: data.IsEncrypted ? Utils.encrypt(data.Text) : data.Text,
      UserId: userId,
      IsEncrypted: data.IsEncrypted,
      PasswordHash: data.IsEncrypted ? Utils.getHash(data.Password) : null,
      CreatedAt: Date.now(),
    };
    connectDB(function (err, db) {
      if (err) {
        cb({
          success: false,
          msg: "failed to udpate",
        });
        //log
      } else {
        var dbo = db.db(process.env.DB_NAME);
        dbo
          .collection("clipboards")
          .updateOne(
            { UserId: Model.UserId, _id: ObjectId(data.Id) },
            { $set: Model },
            function (err, res) {
              if (err) {
                cb({ success: false, msg: "failed to update" });
                //log
              } else {
                db.close();
                cb({
                  success: true,
                  msg: "udpated successfully",
                });
              }
            }
          );
      }
    });
  }
}

function getClipboards(userId, page, recordsPerPage, cb) {
  connectDB(function (err, db) {
    if (err) {
      cb({
        success: false,
        msg: "failed to fetch",
      });
      //log
    } else {
      var dbo = db.db(process.env.DB_NAME);
      dbo
        .collection("clipboards")
        .find({ UserId: userId })
        .sort({ CreatedAt: -1 })
        .skip(page < 1 ? 0 : (page - 1) * recordsPerPage)
        .limit(recordsPerPage)
        .toArray(function (err, docs) {
          if (err) {
            cb({ success: false, msg: "failed to fetch" });
            //log
          } else {
            dbo
              .collection("clipboards")
              .find({ UserId: userId })
              .count(function (err, count) {
                if (err) {
                  cb({ success: false, msg: "failed to fetch" });
                  //log
                }
                db.close();
                cb({
                  success: true,
                  data: docs,
                  meta: {
                    totalCount: count,
                    page: page,
                    recordsPerPage: recordsPerPage,
                  },
                });
              });
          }
        });
    }
  });
}
function getClipboard(userId, id, cb) {
  connectDB(function (err, db) {
    if (err) {
      cb({
        success: false,
        msg: "failed to fetch",
      });
      //log
    } else {
      var dbo = db.db(process.env.DB_NAME);
      dbo
        .collection("clipboards")
        .findOne({ _id: ObjectId(id), UserId: userId }, function (err, doc) {
          if (err) {
            cb({ success: false, msg: "failed to fetch" });
            //log
          } else {
            cb({
              success: true,
              data: doc,
            });
          }
        });
    }
  });
}
function checkPassword(userId, id, password, cb) {
  var passwordHash = Utils.getHash(password);
  connectDB(function (err, db) {
    if (err) {
      cb({
        success: false,
        msg: "failed to fetch",
      });
      //log
    } else {
      var dbo = db.db(process.env.DB_NAME);
      dbo
        .collection("clipboards")
        .findOne(
          { _id: ObjectId(id), UserId: userId, PasswordHash: passwordHash },
          function (err, doc) {
            if (err) {
              cb({ success: false, msg: "failed to fetch" });
              //log
            } else {
              cb({
                success: true,
                data: doc,
              });
            }
          }
        );
    }
  });
}
function connectDB(cb) {
  if (typeof cb !== "function") throw "cb must be function";
  var url = process.env.DB_CONNECTION_STRING;
  MongoClient.connect(url, cb);
}

module.exports = {
  createClipBoard,
  getClipboards,
  getClipboard,
  checkPassword,
  updateClipBoard,
};
