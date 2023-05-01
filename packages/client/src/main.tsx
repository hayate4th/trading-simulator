import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import { App } from "./App.tsx";
import "./index.css";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
