# Export Vivlio Book Notes to Notion

<img src="https://i.ibb.co/tMGmJjw/Captura-de-Tela-2022-09-10-a-s-5-43-50-PM.png" alt="drawing" width="1000"/>

## About the Integration

This Notion integration sends book notes taken in a Vivlio e-book reader to a particular Notion database.

## Running Locally

### 1. Setup your local project

```zsh
# Clone this repository locally
git clone https://github.com/Mathbustamante/vivlio-note-exporter.git

# Switch into this project
cd vivlio-note-exporter

# Install the dependencies
npm install
```

### 2. Set your environment variables in a `.env` file

```zsh
NOTION_KEY= <your-notion-api-key>
NOTION_DATABASE_ID=<your-notion-database-id>>
```

You can create your Notion API key [here](https://www.notion.com/my-integrations).

To create a Notion database that will work with this example, duplicate [this template](https://adaptive-pike-454.notion.site/e2a64f72349344b88157d5ecbd7c81d3?v=6d2e5230670943419257e8d4519d0279).

### 3 Go to your Notion database and add a new connection

Add the connection linked to the Notion API key created on step 2.

### 4. Set your book notes in a folder called `notes`

Export your notes in Vivlio and paste the generated `html` files to your `notes` folder.

### 5. Run code

```zsh
node index.js
```
