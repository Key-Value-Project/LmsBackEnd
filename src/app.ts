import express from 'express';
import loggerMiddleware from './middleware/logger.middleware';
import employeeRouter from './routes/employee.routes';
import AppdataSource from './db/data-source';
import errorMiddleware from './middleware/error.middleware';
import departmentRouter from './routes/department.routes';
import cors from 'cors';
import bookDetailRouter from './routes/bookDetail.routes';
import booksRouter from './routes/books.routes';
import ShelfRouter from './routes/shelf.routes';
import analyticsRouter from './routes/analytics.routes';
import reviewsRouter from './routes/reviews.routes';
import subscriptionRouter from './routes/subscription.routes';

const server = express();
server.use(loggerMiddleware);
server.use(express.json());
server.use(
    cors()
    // 	{
    // 	origin: "http://localhost:5173",
    // 	credentials: true,
    // }
);
server.use('/employee', employeeRouter);
server.use('/department', departmentRouter);
server.use('/book-details', bookDetailRouter);
server.use('/books', booksRouter);
server.use('/notify', subscriptionRouter);
server.use('/shelf', ShelfRouter);
server.use('/analytics', analyticsRouter);
server.use('/reviews', reviewsRouter);

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.use(errorMiddleware);

(async () => {
    try {
        await AppdataSource.initialize();
    } catch (e) {
        console.log('Failed', e);
        process.exit(1);
    }
    server.listen(3000, () => {
        console.log('server listening to 3000');
    });
})();
