const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const { addNote,
        deleteNote,
        editNote,
        getNotes,
        uploadBookImage } = require("../controllers/noteController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/students/:studentId/notes",
    handlers: [uploadBookImage, addNote],
  },
  {
    method: HttpMethods.DELETE,
    path: "/students/:noteId/notes",
    handlers: [deleteNote],
  },
 {
    method: HttpMethods.PUT,
    path: "/students/:noteId/notes",
    handlers: [uploadBookImage, editNote],
  },
  {
    method: HttpMethods.GET,
    path: "/students/:studentId/notes",
    handlers: [getNotes],
  },

];

const router = createRouter(routes);

module.exports = router;
