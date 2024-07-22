import { Repository } from "typeorm";
import Subscription from "../entity/subscription.entity";

class SubscriptionRepository {
    constructor(private subscriptionRepository: Repository<Subscription>){}
    subscribe = async (subscription: Subscription) => {
        return this.subscriptionRepository.save(subscription)
    }
    
    softRemove = async (subscription: Subscription): Promise<Subscription> => {
		// const subscription = await this.find({bookDetail:{isbn},user:{id:user_id}});
		if (subscription) {
			await this.subscriptionRepository.softRemove(subscription);
		}
        return subscription
    }

    find = async (filter: Partial<Subscription>): Promise<Subscription | null> => {
        return this.subscriptionRepository.findOne({where:filter, relations: ["user", "bookDetail"]})
    }

    toggleNotify = async (isbn: number, user_id: number): Promise<Subscription | null> => {
        let subscription =  await this.find({bookDetail:{isbn:isbn},user:{id:user_id}})
        subscription.sent_request = !subscription.sent_request
        let id = subscription.id
        this.subscriptionRepository.update({id},subscription)
        return subscription

    }

    getIsbnFromUserId = async (user_id: number) => {

        let {bookDetail} = await this.find({user:{id: user_id}},)
        return bookDetail.isbn


    }
}
export default SubscriptionRepository