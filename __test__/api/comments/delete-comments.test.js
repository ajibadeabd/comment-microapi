const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const mongoose = require("mongoose");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "DELETE",
  "/comments/:commentId",
  "DELETE '/comments/:commentId'",
  () => {
    // missing test 401 authentication error
    // missing test 402 validation error

    // 200 success
    test.skip("Should delete a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
        origin: "4edd40c8676",
      });
      await comment.save();

      const res = await request
        .delete(`/comments/${comment._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: comment.ownerId,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.message).toEqual("Comment deleted successfully");
    });

    // 404 not found error
    test.skip("Should fail to delete comment not found", async () => {
      const comment = {
        _id: mongoose.Types.ObjectId(),
        content: "this is a comment",
        ownerId: "rogueuser@email.com",
        applicationId: global.application._id,
      };

      const res = await request
        .delete(`/comments/${comment._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: comment.ownerId,
        });

      expect(res.status).toBe(404);
      expect(res.body.status).toEqual("error");
      expect(res.body.data.length).toBe(0);
    });
  }
);
