import { Buffer } from "node:buffer";
import { describe, expect, it } from "@jest/globals";
import { decryptMessages } from "../helpers";
import { Message } from "@prisma/client";

describe("decrypts messages", () => {
  it("encrypts and decrypts an empty message correctly", () => {
    const string = "";
    const message: Message = {
      id: 0,
      createdAt: new Date(),
      recipientId: 0,
      senderId: 1,
      updatedAt: new Date(),
      text: Buffer.from(string).toString("base64"),
    };
    expect(decryptMessages([message])[0].text).toBe(string);
  });
  it("encrypts and decrypts message correctly", () => {
    const string = "hello, world!";
    const message: Message = {
      id: 0,
      createdAt: new Date(),
      recipientId: 0,
      senderId: 1,
      updatedAt: new Date(),
      text: Buffer.from(string).toString("base64"),
    };
    expect(decryptMessages([message])[0].text).toBe(string);
  });
});
