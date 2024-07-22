import express from 'express';
import BookService from '../service/book.service';
import { RequestWithUser } from '../utils/requestWithUser';
import authorize from '../middleware/auth.middleware';
import { plainToInstance } from 'class-transformer';
import { BorrowBookDto } from '../dto/book.dto';

class BooksController {
    public router: express.Router;

    constructor(private bookService: BookService) {
        this.router = express.Router();
        this.router.post('/borrow', authorize, this.borrowBook);
        this.router.post('/return', authorize, this.returnBook);
        this.router.get('/borrowhistory', authorize, this.getBorrowHistory);
        this.router.get("/allbooks", authorize, this.getAllBooks);
        this.router.post("/create", authorize, this.createBook);
        this.router.delete("/delete/:id",authorize,this.deleteBook);
        this.router.put("/update/:id",authorize,this.updateBook)
    }

    borrowBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const { isbn, shelf_id } = req.body;
            const user_id = req.id;
            const borrowBookDto = plainToInstance(BorrowBookDto, { isbn, shelf_id, user_id });
            const data = await this.bookService.borrowBook(borrowBookDto);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    returnBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const { isbn, shelf_id } = req.body;
            const user_id = req.id;
            const returnBookDto = plainToInstance(BorrowBookDto, { isbn, shelf_id, user_id });
            const data = await this.bookService.returnBook(returnBookDto);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    getBorrowHistory = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const user_id = req.id;
            const data = await this.bookService.getBorrowedBooks(user_id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    getAllBooks = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
      const data = await this.bookService.getAllBooks();
      res.json(data);
    };
  
    createBook = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
      {
        try {
          if (!(request.role == Role.ADMIN)) {
            throw new HttpException(403, "Forbidden", [
              "You are not authorized to add books",
            ]);
          }
          const book = request.body;
          console.log(book);
          const bookDetails = await this.bookService.createBook(book);
          response.send(bookDetails);
        } catch (err) {
          if (err.code === "23503") {
            const error = new HttpException(404, "Not found", [
              "Shelf or book not found in the database",
            ]);
            next(error);
          }
          next(err);
        }
      }
    };
  
    deleteBook = async (request: RequestWithUser,
      response: express.Response,
      next: express.NextFunction
    ) => {
      {
        try {
          if (!(request.role == Role.ADMIN)) {
            throw new HttpException(403, "Forbidden", [
              "You are not authorized to delete books",
            ]);
          }
          const id = request.params.id;
          const bookDetails = await this.bookService.deleteBook(id);
          response.send(bookDetails);
        } catch (err) {
          if (err.code === "23503") {
            const error = new HttpException(404, "Not found", [
              "Book not found in the database",
            ]);
            next(error);
          }
          next(err);
        }
      }
    };
  
    public updateBook=async(
      request: RequestWithUser,
      response: express.Response,
      next: express.NextFunction
  )=>{
      try{
      if (!(request.role==Role.ADMIN)){
          throw new HttpException(403, "Forbidden", ["You are not authorized to update books"]);
      }
  
      const id=request.params.id
      const book=request.body;
      console.log(book);
      const bookDetails = await this.bookService.updateBooks(id,book);
      response.send(bookDetails);
  }catch(err){
      if (err.code === "23503") {
          const error = new HttpException(404, "Not found", [
            "Book not found in the database",
          ]);
          next(error);
        }
      next(err)
  }
  };

}
export default BooksController;
