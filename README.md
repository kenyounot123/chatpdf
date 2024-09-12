# PDF Chatbot RAG App

This project is a PDF-based chatbot application using Retrieval-Augmented Generation (RAG). Users can upload a PDF document, and the chatbot will answer queries related to the document using the document's content.

## Features

- **PDF Upload**: Users can upload PDF documents to the app.
- **RAG-based Querying**: Queries are processed using a Retrieval-Augmented Generation (RAG) pipeline, fetching relevant content from the uploaded document and generating responses.
- **Document-Specific Queries**: All user queries are answered based on the content of the uploaded document. If the answer cannot be found in the document, the chatbot will notify the user.
- **Real-time Response**: The chatbot provides concise and accurate answers in real-time using the provided context.

## Technologies Used

- **Next.js**: Frontend framework for building the UI and routing.
- **React**: Component-based UI for building interactive user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling and responsive design.
- **LangChain**: Framework for building RAG pipelines using language models.
- **OpenAI API**: Provides GPT-based language models for generating responses.
- **Pinecone**: Vector database for efficient document embedding retrieval.
- **shadcn**: UI component library for front end

## Getting Started

### Prerequisites

To run this app, you'll need:

- OpenAI API Key
- Pinecone API Key
