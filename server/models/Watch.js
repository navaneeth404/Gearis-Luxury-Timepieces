import mongoose from "mongoose";

const watchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    gender: { type: String, enum: ["men", "women", "unisex"], required: true },
    caseSize: { type: Number, required: true },
    strapMaterial: { type: String, enum: ["leather", "metal", "rubber"], required: true },
    movementType: { type: String, enum: ["automatic", "quartz"], required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    description: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Watch = mongoose.model("Watch", watchSchema);
export default Watch;   