import amqp from 'amqplib';
import { Client } from 'pg';

const QUEUE_NAME = 'messages';
const DATABASE_URL = 'postgres://postgres:root1234@localhost:5432/message'; // Replace with your PostgreSQL database URL

async function consumeMessages() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME);
        await channel.consume(QUEUE_NAME, async (message) => {
            if (message !== null) {
                const parsedMessage = JSON.parse(message.content.toString());

                // Store the message in PostgreSQL
                const client = new Client({ connectionString: DATABASE_URL });
                await client.connect();
                await client.query('INSERT INTO messages(sender, recipient, body) VALUES($1, $2, $3)', [
                    parsedMessage.sender,
                    parsedMessage.recipient,
                    parsedMessage.body,
                ]);
                await client.end();

                console.log('Message stored:', parsedMessage);

                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
}

consumeMessages();
