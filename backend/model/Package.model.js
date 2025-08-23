import mongoose from "mongoose"

// Schema for individual comment entries
const commentEntrySchema = new mongoose.Schema({
   user: { type: String, default: "Current User" },
   text: { type: String, required: true },
   timestamp: { type: Date, default: Date.now }
});

const dataSchema = new mongoose.Schema({

   packageName: { type: String, required: true },
   imageNames: { type: [String], default: null },
   binaryNames: { type: [String], default: null },

   distroSuccess: { type: String },
   distroFailure: { type: String },
   successTime: { type: Date },
   failureTime: { type: Date, default: null },

   distroFailureTime: { type: String }, // Can be parsed into an object if needed
   distroLastRunTime: { type: String },
   jobLastRunTime: { type: Date },
   dockerLastRunTime: { type: Date },
   scriptLastRunTime: { type: Date, default: null },

   dockerFailureTime: { type: Date, default: null },
   imageFailureTime: { type: Date, default: null },
   scriptFailureTime: { type: Date, default: null },

   status: { type: String },
   owner: { type: String },
   privateRunReason: { type: String, default: null },

   failureCount: { type: String }, // Can be stored as object if parsed
   ratio: { type: Number },
   binaryRatio: { type: Number },
   scriptRatio: { type: Number },

   unavailableDistros: { type: [String] },
   comment: String,
   latest_comment: String,
   comments: {
      BI: { type: [commentEntrySchema], default: [] },
      CI: { type: [commentEntrySchema], default: [] },
      Image: { type: [commentEntrySchema], default: [] },
      Binary: { type: [commentEntrySchema], default: [] },
      Docker: { type: [commentEntrySchema], default: [] }
   },

   // Fixed naming for consistency with frontend
   biBroken: { type: Boolean, default: false },
   dockerBroken: { type: Boolean, default: false },
   imageBroken: { type: Boolean, default: false },
   binaryBroken: { type: Boolean, default: false },
   ciBroken: { type: Boolean, default: false },

   imageSize: { type: String },
   ciLogo: { type: String, default: null },
   ciJob: { type: String, default: null },
   verification: { type: String, default: null },
},
   { timestamps: true });


export default mongoose.model("Package", dataSchema)