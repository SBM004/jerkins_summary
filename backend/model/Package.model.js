import mongoose from "mongoose"

const dataSchema=new mongoose.Schema({
    
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

  broken: { type: Boolean },
  dockerBroken: { type: Boolean },
  imageBroken: { type: Boolean },
  binaryBroken: { type: Boolean },

  comment: { type: String },
  imageSize: { type: String },
  ciLogo: { type: String, default: null },
  ciJob: { type: String, default: null },
  verification: { type: String, default: null },
  cibroken: { type: Boolean }
  },
  { timestamps: true });


  export default mongoose.model("Package",dataSchema)