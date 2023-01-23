import cron from 'node-cron';
import sequelize from '../config/database.mjs';
import { Op } from 'sequelize';
import { ORDER_STATUS } from '../config/variables.mjs';

const { Order, Office, Employee } = sequelize.models;

// schedule jobs every 5 minute > all orders which have status not canceled or shipped >
// updated date is over 30 days, system automatically change status to ‘on-hold’
export const checkOrderStatus = cron.schedule('*/5 * * * *', async () => {
    console.log('----Check order cancelled or shipped every 5 minute---');

    try {
        let queryFilter = { status: { [Op.not]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED] } };

        let currentOrders = await Order.findAll({ where: queryFilter, raw: true, attributes: ['updatedAt', 'orderNumber'] });

        const currentDate = new Date();

        let updatedOrders = []
        for (let order of currentOrders) {
            const orderDate = new Date(order.updatedAt)

            const timeDifference = Math.abs(currentDate - orderDate);
            const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

            if (dayDifference > 30) {
                console.log('1 order is oudated');
                updatedOrders.push(order.orderNumber)
            }
        }

        let rowAffected = await Order.update({
            status: ORDER_STATUS.ON_HOLD
        }, {
            where: {
                orderNumber: updatedOrders
            }
        })

        if (rowAffected != 0) {
            console.log(`Updated successfully ${rowAffected} records`);
            console.log(updatedOrders);
        }
        else {
            console.log('No order is over due');
        }
        console.log('---Task end---');

    } catch (error) {
        console.log(error);
    }
}, {
    scheduled: false
});


// // Check if office has default employee every 12 hours
// export const checkDefaultEmployee = cron.schedule('0 */12 * * *', async () => {
//     console.log('----Check if all office has default employee every 12 hours---');

//     try {
//         console.log('---Task end---');

//     } catch (error) {
//         console.log(error);
//     }
// }, {
//     scheduled: false
// });
