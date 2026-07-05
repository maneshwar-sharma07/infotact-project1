import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

import User from "../src/models/User";
import Workspace from "../src/models/Workspace";
import Channels from "../src/models/Channels";
import Message from "../src/models/Message";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/infotact";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    // Clear old data
    await Message.deleteMany({});
    await Channels.deleteMany({});
    await Workspace.deleteMany({});
    await User.deleteMany({});

    // Password hash
    const passwordHash = await bcrypt.hash("Password123", 10);

    // Create Users
    const users = await User.create([
      {
        name: "Alice",
        email: "alice@example.com",
        passwordHash,
      },
      {
        name: "Bob",
        email: "bob@example.com",
        passwordHash,
      },
      {
        name: "Charlie",
        email: "charlie@example.com",
        passwordHash,
      },
    ]);

    // Create Workspaces
    const workspace1 = await Workspace.create({
      name: "Development",
      description: "Development Workspace",
      owner: users[0]._id,
      members: [users[0]._id, users[1]._id],
      channels: [],
      inviteToken: crypto.randomBytes(16).toString("hex"),
    });

    const workspace2 = await Workspace.create({
      name: "Marketing",
      description: "Marketing Workspace",
      owner: users[2]._id,
      members: [users[2]._id],
      channels: [],
      inviteToken: crypto.randomBytes(16).toString("hex"),
    });

    // Create Channels
    const channels = await Channels.create([
      {
        name: "general",
        workspace: workspace1._id,
        createdBy: users[0]._id,
      },
      {
        name: "backend",
        workspace: workspace1._id,
        createdBy: users[0]._id,
      },
      {
        name: "frontend",
        workspace: workspace1._id,
        createdBy: users[1]._id,
      },
      {
        name: "general",
        workspace: workspace2._id,
        createdBy: users[2]._id,
      },
      {
        name: "design",
        workspace: workspace2._id,
        createdBy: users[2]._id,
      },
    ]);

    workspace1.channels.push(
      channels[0]._id as any,
      channels[1]._id as any,
      channels[2]._id as any
    );

    workspace2.channels.push(
      channels[3]._id as any,
      channels[4]._id as any
    );

    await workspace1.save();
    await workspace2.save();

    // Create 20 Messages
    const messages = [];

    for (let i = 1; i <= 20; i++) {
      messages.push({
        content: `Seed message ${i}`,
        sender: users[i % users.length]._id,
        channel: channels[i % channels.length]._id,
      });
    }

    await Message.insertMany(messages);

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();