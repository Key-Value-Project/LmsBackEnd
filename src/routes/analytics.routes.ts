import AnalyticsController from '../controller/analytics.controller';
import AppdataSource from '../db/data-source';
import BorrowedHistory from '../entity/borrowedHistory.entity';
import BorrowedHistoryRepository from '../repository/borrowedHistory.repository';
import AnalyticsService from '../service/analytics.service';

const analyticsController = new AnalyticsController(
    new AnalyticsService(new BorrowedHistoryRepository(AppdataSource.getRepository(BorrowedHistory)))
);

const analyticsRouter = analyticsController.router;
export default analyticsRouter;
