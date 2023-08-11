import amqp from 'amqplib';

const QUEUE_NAME = 'messages';

async function publishMessage(message: any) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME);
        await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));

        setTimeout(() => {
            channel.close();
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}

export { publishMessage };
