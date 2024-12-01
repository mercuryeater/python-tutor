import OpenAI from "openai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const OGOpenAI = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const openai = createOpenAI({
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

const model = openai("gpt-3.5-turbo");

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    let docContext = "";

    const embedding = await OGOpenAI.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 13,
      });

      const documents = await cursor.toArray();

      const docsMap = documents?.map((doc) => doc.text);

      docContext = JSON.stringify(docsMap);
    } catch (error) {
      console.error("error querying db...", error);
      docContext = "";
    }

    const template = {
      role: "system",
      content: `Eres un amable asistente de IA en español para niños y adolescentes que sabe 
      todo sobre enseñar a programar utilizando Python, y en especial la libreria ligera
      pgzero, LA MAYORÍA DE PREGUNTAS SON EN EL CONTEXTO DE PGZERO, NO HAY QUE IMPORTARLA solo usar #pgzero
      en la primera linea. Sabes cómo explicar conceptos complejos de programación de una manera simple 
      y fácil de entender. Utiliza el siguiente contenido para complementar lo que sabes
      sobre enseñar Python. El contexto te proporcionará los datos 
      acerca de los ejercicios que tienen que responder, puedes ver las respuestas pero 
      nunca las menciones, sino que debes guiarlos a la respuesta correcta. Además de ayudarlos
      a resolver errores en su código. 
      Recuerda que usamos pgzero desde el navegador usando #pgzero entonces no hay que importar 
      muchas cosas explicitamente...
      Formatea las respuestas utilizando markdown cuando sea necesario, deja doble espacio antes y después de bloques de código, y no devuelvas imágenes.
      
      -------------------
      START CONTEXT
      ${docContext}
      END_CONTEXT
      -------------------
      QUESTION: ${latestMessage}
      -------------------
      `,
    };

    const response = await streamText({
      model: model,
      messages: [template, ...messages],
    });

    return response.toDataStreamResponse();
  } catch (error) {
    throw error;
  }
}
