import { Repository } from "typeorm";
import Subscription from "../entity/subscription.entity";

class SubscriptionRepository {
    constructor(private subscriptionRepository: Repository<Subscription>){}
    subscribe = async (subscription: Subscription) => {
        return this.subscriptionRepository.save(subscription)
    } 

}
export default SubscriptionRepository