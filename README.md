# PDF Chatbot RAG App

This project is a PDF-based chatbot application using Retrieval-Augmented Generation (RAG). Users can upload a PDF document, and the chatbot will answer queries related to the document using the document's content.

## Features

- **PDF Upload**: Users can upload PDF documents to the app.
- **RAG-based Querying**: Queries are processed using a Retrieval-Augmented Generation (RAG) pipeline, fetching relevant content from the uploaded document and generating responses.
- **Document-Specific Queries**: All user queries are answered based on the content of the uploaded document. If the answer cannot be found in the document, the chatbot will notify the user.
- **Real-time Response**: The chatbot provides concise and accurate answers in real-time using the provided context.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Convex**: A backend as a service framework for building applications.
- **OpenAI**: For utilizing OpenAI embeddings and chat models.
- **Convex Vector Store**: For storing and retrieving document embeddings.
- **Convex Storage**: For managing file uploads.

## Getting Started

### Prerequisites

To run this app, you'll need:

- OpenAI API Key
