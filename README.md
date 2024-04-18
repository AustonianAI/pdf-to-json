# GPT-3 & Next.js - JSONify a PDF - Convert PDFs into JSON data with your own custom schema.

Working with PDFs can be a huge drag. With AI, we can take PDFs and extract custom JSON data which make them much easier to work with.

Check out a [live deployment of this app at jsonify.org](https://www.jsonify.org/).

Tech stack includes Next.js, Tailwind, OpenAI, and Typescript. Note that this app does not use LangChain, Pinecone, or even GPT-4 (it is using the GPT-3.5 model). While you would likely want to consider these on a more robust app, the purpose of this app is to simply demonstrate the "JSONification of a PDF" process.

[Get in touch via twitter if you have questions](https://twitter.com/AustinAI)

## Development

1. Clone the repo

```
git clone https://github.com/AustonianTX/pdf-to-json.git
```

2. Install packages

```
npm install
```

3. Set up your `.env` file

- Create a `.env` file, and add your OpenAI API key

```
OPENAI_API_KEY=
```

- Visit [openai](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to retrieve API keys and insert into your `.env` file.

## Run the app

One you have installed the dependenies, you can run the app using `npm run dev` to launch the local dev environment. From there you can define a schema, upload your PDF file(s), and parse them into JSON.

## Troubleshooting

In general, keep an eye out in the `issues` and `discussions` section of this repo for solutions.

## Credit

The frontend of this repo was built with [Austin Taylor](https://github.com/austin-triiistudio) at the Austin AI X Foundation Capital hackathon.
