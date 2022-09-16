/* 
	Export Book Notes - Vivlio
*/

const fs = require('fs');
const path = require('path');
const jsdom = require("jsdom");
const dotenv = require("dotenv")

dotenv.config()

const { Client } = require("@notionhq/client")
const { JSDOM } = jsdom;

const notion = new Client({
  auth: process.env.NOTION_KEY
});

/**
 * Starts Notion exporter
 */
startExport()

/**
 * Traverse each html file and returns array of objects containing the book title, author, and
 * user notes
 */
async function getBookNotes() {
  try {
    const files = fs.readdirSync('./notes')
    const bookNotes = [];
    for (const book of files) {
      if (path.extname(book) === ".html") {
        const data = fs.readFileSync(`./notes/${book}`, 'utf8');
        const dom = new JSDOM(data);
        const currentBook = {};
        currentBook.notes = [];
        currentBook.title = (dom.window.document.querySelector("h1").textContent).slice(22);
        currentBook.author = dom.window.document.querySelector("span") ?
        dom.window.document.querySelector("span").textContent.textContent : "";
        dom.window.document.querySelectorAll(".bm-text").forEach(function (data) {
          currentBook.notes.push({
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{
                type: "text",
                text: {
                  content: `${data.parentNode.querySelector('.bm-page').textContent} - ${data.querySelector('.bm-text > *').textContent}`
                }
              }]
            }
          });
        });
        bookNotes.push(currentBook);
      }
    }
    return bookNotes;
  } catch (error) {
    console.error(error)
    throw new Error('There was an error reading your book notes.')
  }
}

/**
 * Gets a random book emoji
 */
const getRandomEmoji = () => {
  const bookEmojis = ['📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒']
  return bookEmojis[Math.floor((Math.random() * bookEmojis.length))]
}

/**
 * Sends book notes to Notion
 */
async function publishBookNotes(bookName, bookAuthor, pageContent) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID
      },
      icon: {
        type: "emoji",
        emoji: getRandomEmoji()
      },
      properties: {
        title: {
          title: [{
            "text": {
              "content": bookName
            }
          }]
        },
        Author: {
          rich_text: [{
            "text": {
              "content": bookAuthor
            }
          }]
        }
      },
      children: pageContent
    })
    console.log(response);
    console.log(`Success! Entry added ${bookName}.`)
  } catch (error) {
    console.error(error.body)
  }
}

/**
 * Publish book notes to Notion
 */
async function startExport() {
  const books = await getBookNotes();
  for (let i = 0; i < books.length; i++) {
    publishBookNotes(books[i].title, books[i].author, books[i].notes);
  }
}