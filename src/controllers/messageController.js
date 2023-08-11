"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageQueueService_1 = require("../services/messageQueueService");
class MessageController {
    postMessage(req, res) {
        const { sender, recipient, body } = req.body;
        if (!sender || !recipient || !body) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Publish message to message queue
        (0, messageQueueService_1.publishMessage)({ sender, recipient, body });
        return res.status(201).json({ message: 'Message sent successfully' });
    }
}
exports.default = new MessageController();
