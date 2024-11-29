//File responsible for loading all our data into the datastaxdb
//We will be using the OpenAI API to generate embeddings for our text data
//We will be using the RecursiveCharacterTextSplitter to split the text into chunks
//We will be using the DataAPIClient to connect to the database
//We will be using the DataAPIClient to create a collection in the database

import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Let's define the websites we want to scrape

// Check if we connect to db
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

if (!ASTRA_DB_API_ENDPOINT) {
  throw new Error("ASTRA_DB_API_ENDPOINT is not defined");
}

const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

// These below refers to number of characters in each chunk and the overlap between them
// Meaning 512 characters in each chunk and 100 characters overlap
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  if (!ASTRA_DB_COLLECTION) {
    throw new Error("ASTRA_DB_COLLECTION is not defined");
  }
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 1536,
        metric: similarityMetric,
      },
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

const loadSampleData = async () => {
  if (!ASTRA_DB_COLLECTION) {
    throw new Error("ASTRA_DB_COLLECTION is not defined");
  }
  const collection = await db.collection(ASTRA_DB_COLLECTION);

  const folderPath = "./docs2Embbed";

  try {
    // Get all text files in the directory
    const files = await fs.readdir(folderPath);
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    for (const fileName of txtFiles) {
      // content reads everything from a txt file
      const filePath = path.join(folderPath, fileName);

      // Read the content of the file
      const content = await fs.readFile(filePath, "utf8");
      console.log(`Processing file: ${fileName}`);

      const chunks = await splitter.splitText(content);
      for await (const chunk of chunks) {
        const embeddings = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
          encoding_format: "float",
        });

        const vector = embeddings.data[0].embedding;

        const res = await collection.insertOne({
          $vector: vector,
          text: chunk,
        });

        console.log("res insert", res);
      }
    }
  } catch (error) {
    console.error("Error loading sample data: ", error);
  }
};

createCollection()
  .then(() => loadSampleData())
  .catch((err) => console.error(err));
