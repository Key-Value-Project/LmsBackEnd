import { Repository } from "typeorm";
import Subscription from "../entity/subscription.entity";

class SubscriptionRepository {
    constructor(private subscriptionRepository: Repository<Subscription>){}
    subscribe = async (subscription: Subscription) => {
        return this.subscriptionRepository.save(subscription)
    }
    
    softRemove = async (subscription: Subscription): Promise<void> => {
		// const subscription = await this.find({bookDetail:{isbn},user:{id:user_id}});
		if (subscription) {
			await this.subscriptionRepository.softRemove(subscription);
		}
    }

    find = async (filter: Partial<Subscription>): Promise<Subscription | null> => {
        return this.subscriptionRepository.findOne({where:filter, relations: ["user", "bookDetail"]})
    }
}
export default SubscriptionRepository