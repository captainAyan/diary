const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

noteSchema.virtual("id").get(function () {
  return this._id;
});

noteSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Note", noteSchema);
