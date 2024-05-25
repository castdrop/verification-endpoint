import {
  http,
  erc20Abi,
  isAddress,
  getContract,
  createPublicClient,
  type Address,
} from "viem";
import { base } from "viem/chains";
const express = require("express");
const app = express();

const MINIMUM_BALANCE = 1000000000000000000000n;

const DEGEN = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/verify", async (req, res) => {
  const erc20 = getContract({
    abi: erc20Abi,
    address: DEGEN,
    client: { public: publicClient },
  });

  const address = req.query.address as Address;

  if (!address || !isAddress(address)) {
    console.log(`Invalid address: ${address}`);
    res.send({ eligible: false });
  }

  const balance = await erc20.read.balanceOf([address]);

  if (balance >= MINIMUM_BALANCE) {
    console.log(`Eligible address: ${address}`);
    res.send({ eligible: true });
  } else {
    console.log(`Not eligible address: ${address}`);
    res.send({ eligible: false });
  }
});

app.listen(1337, () => console.log("Server ready on port 3000."));

module.exports = app;
