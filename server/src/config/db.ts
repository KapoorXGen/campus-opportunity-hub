import dns from "dns";
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    /*
     * Optional custom DNS servers.
     *
     * Useful for local networks where the default DNS
     * resolver refuses MongoDB Atlas SRV queries.
     *
     * In production, this can simply be omitted unless
     * the hosting environment requires it.
     */
    const dnsServers = process.env.MONGODB_DNS_SERVERS
      ?.split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers && dnsServers.length > 0) {
      dns.setServers(dnsServers);
      console.log(
        `MongoDB DNS servers: ${dnsServers.join(", ")}`
      );
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;