import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { 
  GasStationClient, 
  createSuiClient, 
  buildGaslessTransactionBytes 
} from "@shinami/clients/sui";
import { TransactionBlock } from "@mysten/sui.js/transactions";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const nodeClient = createSuiClient(process.env.GAS_AND_NODE_TESTNET_ACCESS_KEY);

app.get("/", async (req: Request, res: Response) => {
  const transactionData = {
    "version": 2,
    "sender": null,
    "expiration": null,
    "gasData": {
        "budget": null,
        "price": null,
        "owner": null,
        "payment": null
    },
    "inputs": [
        {
            "UnresolvedPure": {
                "value": "Suiet NFT"
            },
            "$kind": "UnresolvedPure"
        },
        {
            "UnresolvedPure": {
                "value": "Suiet Sample NFT"
            },
            "$kind": "UnresolvedPure"
        },
        {
            "UnresolvedPure": {
                "value": "https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4"
            },
            "$kind": "UnresolvedPure"
        }
    ],
    "commands": [
        {
            "MoveCall": {
                "package": "0x5ea6aafe995ce6506f07335a40942024106a57f6311cb341239abf2c3ac7b82f",
                "module": "nft",
                "function": "mint",
                "typeArguments": [],
                "arguments": [
                    {
                        "Input": 0,
                        "$kind": "Input"
                    },
                    {
                        "Input": 1,
                        "$kind": "Input"
                    },
                    {
                        "Input": 2,
                        "$kind": "Input"
                    }
                ]
            },
            "$kind": "MoveCall"
        }
    ]
}

const serializedTransaction = '{"version":1,"expiration":null,"gasConfig":{},"inputs":[{"kind":"Input","type":"pure","index":0,"value":"Suiet NFT"},{"kind":"Input","type":"pure","index":1,"value":"Suiet Sample NFT"},{"kind":"Input","type":"pure","index":2,"value":"https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4"}],"transactions":[{"kind":"MoveCall","target":"0x5ea6aafe995ce6506f07335a40942024106a57f6311cb341239abf2c3ac7b82f::nft::mint","typeArguments":[],"arguments":[{"kind":"Input","type":"pure","index":0,"value":"Suiet NFT"},{"kind":"Input","type":"pure","index":1,"value":"Suiet Sample NFT"},{"kind":"Input","type":"pure","index":2,"value":"https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4"}]}]}'

const transaction = TransactionBlock.from(serializedTransaction)


const gaslessTransaction = await buildGaslessTransactionBytes(
  nodeClient,
  transaction
)

console.log(gaslessTransaction.length);


  res.send(gaslessTransaction);
});

app.post("/gasless", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});