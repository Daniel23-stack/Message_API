"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const pg_1 = require("pg");
const QUEUE_NAME = 'messages';
const DATABASE_URL = 'postgres://username:password@localhost:5432/message_db'; // Replace with your PostgreSQL database URL
function consumeMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield amqplib_1.default.connect('amqp://localhost');
            const channel = yield connection.createChannel();
            yield channel.assertQueue(QUEUE_NAME);
            yield channel.consume(QUEUE_NAME, (message) => __awaiter(this, void 0, void 0, function* () {
                if (message !== null) {
                    const parsedMessage = JSON.parse(message.content.toString());
                    // Store the message in PostgreSQL
                    const client = new pg_1.Client({ connectionString: DATABASE_URL });
                    yield client.connect();
                    yield client.query('INSERT INTO messages(sender, recipient, body) VALUES($1, $2, $3)', [
                        parsedMessage.sender,
                        parsedMessage.recipient,
                        parsedMessage.body,
                    ]);
                    yield client.end();
                    console.log('Message stored:', parsedMessage);
                    channel.ack(message);
                }
            }));
        }
        catch (error) {
            console.error('Error consuming messages:', error);
        }
    });
}
consumeMessages();
