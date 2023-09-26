import mongoose from "mongoose";

mongoose.pluralize(null);

const pasteSchema = mongoose.Schema({
  nan_id: { type: String, required: true },
  paste: { type: String,  },
  title: { type: String,  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
    default: null,
  },
  language: { type: String, default: "" },
});

pasteSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const PastesDB = mongoose.model("PastesDB", pasteSchema);

export default PastesDB;
