import express from "express";
import authorize from "../middleware/auth.middleware";
import { RequestWithUser } from "../utils/requestWithUser";
import SubscriptionService from "../service/subscription.service";
class SubscriptionController {
  public router: express.Router;
  constructor(private subscriptionService: SubscriptionService) {
    this.router = express.Router();
    this.router.post("/", authorize, this.subscribeBook);
    this.router.delete("/", authorize, this.unsubscribeBook)
  }

  subscribeBook = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { isbn, sent_request } = req.body;
    const user_id = req.id;
    const data = await this.subscriptionService.subscribeBook(
      isbn,
      Number(user_id),
      sent_request
    );
    res.json(data);
  };

  unsubscribeBook = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {isbn} = req.body;
    const user_id = req.id
    const data = await this.subscriptionService.unsubscribeBook(isbn, user_id)
    res.json(data)
  }
}
export default SubscriptionController;
