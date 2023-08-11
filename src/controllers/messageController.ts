import { Request, Response } from 'express';
import { publishMessage } from '../services/messageQueueService';

class MessageController {
    postMessage(req: Request, res: Response) {
        const { sender, recipient, body } = req.body;

        if (!sender || !recipient || !body) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Publish message to message queue
        publishMessage({ sender, recipient, body });

        return res.status(201).json({ message: 'Message sent successfully' });
    }
}

export default new MessageController();
